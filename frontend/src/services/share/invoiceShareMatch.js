import { verifyInvoiceHash } from '../relay/invoiceHashUtils.js';

/**
 * The decision at the heart of importing a shared invoice.
 *
 * A share token is public and anyone can edit one, so nothing in it may be
 * believed on its own. What makes it trustworthy is the commitment the sender
 * made when they created the invoice: `invoiceDataHash` on-chain. Recomputing
 * that hash over the payload and comparing proves it is the payload the
 * sender committed to — the same check the relay path makes in
 * `ReceivedInvoice`'s `storeRelayInvoice`.
 *
 * Kept apart from the module that talks to an RPC, and free of any chain
 * config, so the comparison everything else trusts can be exercised directly.
 */

/** Result codes, so the UI can word each outcome for itself. */
export const VERIFY_OK = 'ok';
export const VERIFY_UNSUPPORTED_CHAIN = 'unsupported_chain';
export const VERIFY_NOT_FOUND = 'not_found';
export const VERIFY_HASH_MISMATCH = 'hash_mismatch';
export const VERIFY_UNREACHABLE = 'unreachable';

/**
 * Decide whether a payload matches an invoice as the contract returned it.
 *
 * @param {Array} raw - the `InvoiceDetails` tuple from `getInvoice`
 * @param {Object} invoiceData - payload from the share token
 * @returns {{code: string, onChain: Object}}
 */
export function evaluateOnChainInvoice(raw, invoiceData) {
  const onChain = {
    invoiceId: raw[0].toString(),
    from: raw[1].toLowerCase(),
    to: raw[2].toLowerCase(),
    amountDue: raw[3],
    tokenAddress: raw[4],
    isPaid: raw[5],
    isCancelled: raw[6],
    invoiceDataHash: raw[7],
  };

  return {
    code: verifyInvoiceHash(invoiceData, onChain.invoiceDataHash)
      ? VERIFY_OK
      : VERIFY_HASH_MISMATCH,
    onChain,
  };
}
