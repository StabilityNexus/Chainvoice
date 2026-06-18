import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { BrowserProvider, Contract } from 'ethers';
import { ChainvoiceABI } from '../contractsABI/ChainvoiceABI.js';
import {
  deriveWakuKeyPair,
  registerPublicKeyOnChain,
  fetchPublicKeyFromChain,
  bytesToHex,
} from '../services/waku/wakuKeyManager.js';

/**
 * React hook for managing Waku ECIES keypair.
 * Handles derivation from wallet signature, session caching,
 * and on-chain registration status.
 */
export function useWakuKeys() {
  const { data: walletClient } = useWalletClient();
  const { address, chainId } = useAccount();
  const [keys, setKeys] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberSession, setRememberSession] = useState(true);

  const getContract = useCallback(async () => {
    if (!walletClient || !chainId) return null;
    const provider = new BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const contractAddress =
      import.meta.env[`VITE_CONTRACT_ADDRESS_${chainId}`];
    if (!contractAddress) return null;
    return new Contract(contractAddress, ChainvoiceABI, signer);
  }, [walletClient, chainId]);

  /** Derive keys from wallet signature without registering on-chain. */
  const deriveKeysOnly = useCallback(async (remember) => {
    if (!walletClient || !address) throw new Error('Wallet not connected');
    const provider = new BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const shouldRemember = remember !== undefined ? remember : rememberSession;
    const keyPair = await deriveWakuKeyPair(signer, address, shouldRemember);
    setKeys(keyPair);
    return keyPair;
  }, [walletClient, address, rememberSession]);

  /** Check if the user's Waku public key is registered on-chain. */
  const checkRegistration = useCallback(async () => {
    const contract = await getContract();
    if (!contract || !address) return false;
    try {
      const pubKey = await fetchPublicKeyFromChain(contract, address);
      const registered = pubKey !== null && pubKey.length > 0;
      setIsRegistered(registered);
      return registered;
    } catch {
      return false;
    }
  }, [getContract, address]);

  /** Derive keys AND register the public key on-chain (if not already). */
  const deriveAndRegister = useCallback(async (remember) => {
    try {
      setIsLoading(true);
      setError(null);

      const keyPair = await deriveKeysOnly(remember);

      const contract = await getContract();
      if (!contract) throw new Error('Contract not available on this network');

      // Check if already registered with same key
      const existingKey = await fetchPublicKeyFromChain(contract, address);
      if (existingKey && existingKey.length > 0) {
        if (bytesToHex(existingKey) === bytesToHex(keyPair.publicKey)) {
          setIsRegistered(true);
          return;
        }
      }

      // Register on-chain
      await registerPublicKeyOnChain(contract, keyPair.publicKey);
      setIsRegistered(true);
    } catch (err) {
      console.error('[useWakuKeys] Failed to derive/register keys:', err);
      setError(err.message || 'Failed to register Waku keys');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [deriveKeysOnly, getContract, address]);

  // Check registration status when wallet/chain changes
  useEffect(() => {
    if (address && walletClient && chainId) {
      checkRegistration().catch(() => {});
    }
  }, [address, walletClient, chainId, checkRegistration]);

  return {
    keys,
    isRegistered,
    isLoading,
    error,
    rememberSession,
    setRememberSession,
    deriveAndRegister,
    deriveKeysOnly,
    checkRegistration,
  };
}
