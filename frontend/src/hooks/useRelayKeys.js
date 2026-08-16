import { useState, useCallback, useEffect, useRef } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { BrowserProvider, Contract } from 'ethers';
import { ChainvoiceABI } from '../contractsABI/ChainvoiceABI.js';
import {
  deriveRelayKeyPair,
  registerPublicKeyOnChain,
  fetchPublicKeyFromChain,
  bytesToHex,
  getCachedKeyPair,
  clearCachedKeys,
} from '../services/relay/relayKeyManager.js';

/**
 * React hook for managing the user's ECIES messaging keypair.
 * Handles derivation from a wallet signature, session caching,
 * and on-chain registration status.
 */
export function useRelayKeys() {
  const { data: walletClient } = useWalletClient();
  const { address, chainId } = useAccount();
  const [keys, setKeys] = useState(null);
  const [hasKeys, setHasKeys] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUnsupportedNetwork, setIsUnsupportedNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Persist to sessionStorage by default. Without this the private key lives
  // only in module memory, so a page reload silently loses it and anything
  // gated on key availability — like polling the relay for new invoices —
  // never starts again. sessionStorage still dies with the tab.
  const [rememberSession, setRememberSession] = useState(true);

  // Always the address of the currently connected account, readable from
  // inside in-flight async work to tell whether its result is still wanted.
  // Written in an effect rather than during render: a render can be discarded
  // without committing (StrictMode double-renders, for one), and recording an
  // address the committed tree never used would make the staleness check
  // discard results that are actually current.
  const activeAddressRef = useRef(address);
  useEffect(() => {
    activeAddressRef.current = address;
  }, [address]);

  // Reset account-scoped state and republish any already-derived key in one
  // pass. Reads the cache directly rather than going through
  // deriveRelayKeyPair, which would fall through to signMessage when the cache
  // is empty or corrupt and pop an unexplained signature prompt on page load.
  useEffect(() => {
    setIsRegistered(false);
    setError(null);

    const cached = address ? getCachedKeyPair(address) : null;
    setKeys(cached);
    setHasKeys(cached !== null);
  }, [address]);

  // Drop the stored key for an account the user has actually left — a
  // disconnect, or a switch to a different account.
  //
  // Deliberately not an effect cleanup: cleanups also run on unmount, which
  // would wipe the key on every route change, on any second consumer of this
  // hook unmounting, and once immediately in StrictMode — throwing away the
  // key the effect above had just restored, and defeating the reason for
  // persisting it at all.
  const previousAddressRef = useRef(address);
  useEffect(() => {
    const previous = previousAddressRef.current;
    previousAddressRef.current = address;
    if (previous && previous !== address) {
      clearCachedKeys(previous);
    }
  }, [address]);

  const getContract = useCallback(async () => {
    if (!walletClient || !chainId) return null;
    const provider = new BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const contractAddress = import.meta.env[`VITE_CONTRACT_ADDRESS_${chainId}`];
    if (!contractAddress) return null;
    return new Contract(contractAddress, ChainvoiceABI, signer);
  }, [walletClient, chainId]);

  /** Derive keys from wallet signature without registering on-chain. */
  const deriveKeysOnly = useCallback(
    async (remember) => {
      if (!walletClient || !address) throw new Error('Wallet not connected');
      const requestedAddress = address;
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const shouldRemember = remember !== undefined ? remember : rememberSession;
      const keyPair = await deriveRelayKeyPair(signer, requestedAddress, shouldRemember);
      // Signing takes as long as the user takes, so the account may have
      // changed underneath us; publishing then would attach one account's key
      // to another.
      if (activeAddressRef.current !== requestedAddress) return keyPair;
      setKeys(keyPair);
      setHasKeys(true);
      return keyPair;
    },
    [walletClient, address, rememberSession]
  );

  /** Check if the user's public key is registered on-chain. */
  const checkRegistration = useCallback(async () => {
    const requestedAddress = address;
    // Reading the registry is an async chain call. If the user switches
    // accounts while it is in flight, the resolved value describes the old
    // account — applying it would report the previous account's registration
    // state for the current one, and could skip the setup step for an address
    // that has no key on chain.
    const isStale = () => activeAddressRef.current !== requestedAddress;

    // "No contract on this chain" is not the same as "not registered", and
    // registering cannot fix it — report it separately so callers can say so
    // rather than offering a setup step that is guaranteed to fail.
    const unsupported =
      Boolean(chainId) && !import.meta.env[`VITE_CONTRACT_ADDRESS_${chainId}`];
    if (!isStale()) setIsUnsupportedNetwork(unsupported);
    if (unsupported) {
      if (!isStale()) setIsRegistered(false);
      return false;
    }

    const contract = await getContract();
    if (!contract || !requestedAddress) {
      if (!isStale()) setIsRegistered(false);
      return false;
    }
    try {
      const pubKey = await fetchPublicKeyFromChain(contract, requestedAddress);
      const registered = pubKey !== null && pubKey.length > 0;
      if (!isStale()) setIsRegistered(registered);
      return registered;
    } catch (err) {
      // A transient RPC failure is indistinguishable from "not registered" in
      // the returned value, so leave a trace of which one it was.
      console.warn('[useRelayKeys] Registry read failed:', err);
      if (!isStale()) setIsRegistered(false);
      return false;
    }
  }, [getContract, address, chainId]);

  /** Derive keys AND register the public key on-chain (if not already). */
  const deriveAndRegister = useCallback(
    async (remember) => {
      const requestedAddress = address;
      // Abort rather than publish if the account changes mid-flow: the signer,
      // the key being compared and the key being registered must all describe
      // the same account.
      const assertSameAccount = () => {
        if (activeAddressRef.current !== requestedAddress) {
          throw new Error('Account changed during key registration');
        }
      };

      try {
        setIsLoading(true);
        setError(null);

        const keyPair = await deriveKeysOnly(remember);
        assertSameAccount();

        const contract = await getContract();
        if (!contract) throw new Error('Contract not available on this network');
        assertSameAccount();

        // Skip the transaction if the same key is already registered
        const existingKey = await fetchPublicKeyFromChain(contract, requestedAddress);
        assertSameAccount();
        if (existingKey && existingKey.length > 0) {
          if (bytesToHex(existingKey) === bytesToHex(keyPair.publicKey)) {
            setIsRegistered(true);
            return;
          }
        }

        await registerPublicKeyOnChain(contract, keyPair.publicKey);
        assertSameAccount();
        setIsRegistered(true);
      } catch (err) {
        console.error('[useRelayKeys] Failed to derive/register keys:', err);
        // The rejection value is whatever the wallet provider threw, which is
        // not guaranteed to be an Error. Reading .message off a string or null
        // would throw from inside this catch, losing the real failure and
        // never running setError.
        const rawMessage =
          typeof err?.message === 'string' ? err.message : String(err ?? '');
        const code = err?.code;
        let errMsg = rawMessage || 'Failed to register messaging keys';
        if (
          errMsg.toLowerCase().includes('user rejected') ||
          errMsg.toLowerCase().includes('rejected the request') ||
          code === 'ACTION_REJECTED' ||
          code === 4001
        ) {
          errMsg =
            'Signature request rejected. You must sign the message to enable encrypted invoices.';
        }
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [deriveKeysOnly, getContract, address]
  );

  // Check registration status when wallet/chain changes
  useEffect(() => {
    if (address && walletClient && chainId) {
      checkRegistration().catch(() => {});
    }
  }, [address, walletClient, chainId, checkRegistration]);

  return {
    keys,
    hasKeys,
    isRegistered,
    isUnsupportedNetwork,
    isLoading,
    error,
    rememberSession,
    setRememberSession,
    deriveAndRegister,
    deriveKeysOnly,
    checkRegistration,
  };
}
