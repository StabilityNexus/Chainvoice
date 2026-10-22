import { ethers } from 'ethers';
import { chainConfig, getContractAddress } from '../../utils/chainConfig.js';
import { ChainvoiceABI } from '../../contractsABI/ChainvoiceABI.js';
import {
  buildChainInvoice,
  createTokenMetadataReader,
} from '../../utils/chainInvoice.js';
import {
  evaluateOnChainInvoice,
  VERIFY_FIELD_MISMATCH,
  VERIFY_NOT_FOUND,
  VERIFY_OK,
  VERIFY_UNREACHABLE,
  VERIFY_UNSUPPORTED_CHAIN,
} from './invoiceShareMatch.js';

export { getContractAddress };

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
 * @returns {Promise<{code: string, onChain?: Object, invoice?: Object, fee?: bigint|null, error?: Error}>}
 *   `invoice` is set when `code` is ok: the invoice as the invoice pages build
 *   it, with the token's symbol and decimals read from the token contract.
 *   `fee` is the contract's current `devFee` in wei, or null if it couldn't
 *   be read
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

  try {
    const contract = new ethers.Contract(contractAddress, ChainvoiceABI, provider);
    let raw;
    try {
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
    }

    const result = evaluateOnChainInvoice(raw, invoiceData);
    if (result.code !== VERIFY_OK) return { ...result, chainName: chain.name };

    // The hash proves the sender wrote this payload, not that its token symbol
    // and decimals are the token's. Build the preview the way the invoice
    // pages do, from the token contract.
    const token = await createTokenMetadataReader({
      runner: provider,
      nativeCurrency: chain.nativeCurrency,
    })(raw[4]);
    const invoice = buildChainInvoice(raw, invoiceData, token);
    // Null means the token's decimals couldn't be read, so no amount is safe
    // to show.
    if (!invoice) return { code: VERIFY_UNREACHABLE, chainName: chain.name };
    if (invoice._payloadMismatch) {
      return {
        code: VERIFY_FIELD_MISMATCH,
        onChain: result.onChain,
        mismatch: invoice._payloadMismatch,
        chainName: chain.name,
      };
    }

    // Only the preview's fee line depends on this, so a failed read hides
    // that line instead of failing the import.
    const fee = await contract.devFee().catch(() => null);

    return { ...result, invoice, fee, chainName: chain.name };
  } finally {
    provider.destroy?.();
  }
}
