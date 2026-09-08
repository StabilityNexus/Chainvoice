import { ethers } from 'ethers';
import { chainConfig } from '../../utils/chainConfig.js';
import { ChainvoiceABI } from '../../contractsABI/ChainvoiceABI.js';
import {
  evaluateOnChainInvoice,
  VERIFY_NOT_FOUND,
  VERIFY_UNREACHABLE,
  VERIFY_UNSUPPORTED_CHAIN,
} from './invoiceShareMatch.js';

/**
 * Check a shared invoice against the chain, without a wallet.
 *
 * A share token is public and anyone can edit one, so nothing in it may be
 * believed on its own. What makes it trustworthy is the same commitment the
 * relay path relies on: the sender hashed the payload into `invoiceDataHash`
 * when they created the invoice, so recomputing that hash and comparing it
 * against the chain proves the payload is the one the sender committed to.
 * See `evaluateOnChainInvoice`, which makes that comparison.
 *
 * Deliberately read-only and wallet-free. Every supported chain ships a
 * public RPC URL in its wagmi config, so an invoice can be decoded, verified
 * and rendered before the recipient connects anything — which is the point of
 * a shared link. Connecting is only needed to save or pay it.
 */

/**
 * Find the wagmi chain definition for a chain id.
 * @param {number|string} chainId
 * @returns {Object|undefined}
 */
function findChain(chainId) {
  return chainConfig.find((chain) => Number(chain.id) === Number(chainId));
}

/**
 * Build a read-only provider for a chain from its public RPC URL.
 *
 * `staticNetwork` matters: without it ethers issues an `eth_chainId` probe
 * per provider and retries network detection on failure, which turns an
 * unreachable RPC into a slow hang instead of a prompt error.
 *
 * @param {number|string} chainId
 * @returns {ethers.JsonRpcProvider|null}
 */
export function getPublicProvider(chainId) {
  const chain = findChain(chainId);
  const url = chain?.rpcUrls?.default?.http?.[0];
  if (!url) return null;
  return new ethers.JsonRpcProvider(url, Number(chain.id), {
    staticNetwork: true,
  });
}

/**
 * Read the Chainvoice contract address configured for a chain.
 *
 * Mirrors how every other caller resolves it. An empty value means the chain
 * is deliberately not wired up yet — see the notes in `.env.example` about
 * deployments still running the v1 contract.
 *
 * @param {number|string} chainId
 * @returns {string|null}
 */
export function getContractAddress(chainId) {
  const configured = import.meta.env[`VITE_CONTRACT_ADDRESS_${Number(chainId)}`];
  return configured ? configured : null;
}

/**
 * Verify a decoded share token against its on-chain commitment.
 *
 * Never throws for an untrustworthy invoice — an unverifiable payload is an
 * expected outcome of opening a stranger's link, not an exception. Callers
 * switch on `code` and show the invoice only when it is `ok`.
 *
 * @param {Object} params
 * @param {string} params.invoiceId
 * @param {number|string} params.chainId
 * @param {Object} params.invoiceData - payload from the token
 * @returns {Promise<{code: string, onChain?: Object, error?: Error}>}
 */
export async function verifyShareAgainstChain({ invoiceId, chainId, invoiceData }) {
  const chain = findChain(chainId);
  const contractAddress = getContractAddress(chainId);
  if (!chain || !contractAddress) {
    return { code: VERIFY_UNSUPPORTED_CHAIN, chainName: chain?.name };
  }

  const provider = getPublicProvider(chainId);
  if (!provider) {
    return { code: VERIFY_UNSUPPORTED_CHAIN, chainName: chain.name };
  }

  let raw;
  try {
    const contract = new ethers.Contract(contractAddress, ChainvoiceABI, provider);
    raw = await contract.getInvoice(invoiceId);
  } catch (err) {
    // A revert means the id does not exist on this contract; anything else is
    // the RPC being unreachable. The two need different wording — one is a bad
    // link, the other is "try again in a minute".
    const isRevert =
      err?.code === 'CALL_EXCEPTION' || err?.code === 'BAD_DATA';
    return {
      code: isRevert ? VERIFY_NOT_FOUND : VERIFY_UNREACHABLE,
      chainName: chain.name,
      error: err,
    };
  } finally {
    provider.destroy?.();
  }

  return { ...evaluateOnChainInvoice(raw, invoiceData), chainName: chain.name };
}
