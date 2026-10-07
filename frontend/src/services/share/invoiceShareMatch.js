import { ethers } from 'ethers';
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
 * The hash alone is not enough. `createInvoice` takes `to`, `amountDue`,
 * `tokenAddress` and `invoiceDataHash` as four independent arguments and
 * never checks them against each other, so a sender is free to commit a hash
 * of a payload that disagrees with the invoice they actually created —
 * showing one amount or one counterparty in the details while the chain
 * holds another. The hash would verify perfectly. So the fields the contract
 * does hold are compared against the payload too.
 *
 * Kept apart from the module that talks to an RPC, and free of any chain
 * config, so the comparison everything else trusts can be exercised directly.
 */

/** Result codes, so the UI can word each outcome for itself. */
export const VERIFY_OK = 'ok';
export const VERIFY_UNSUPPORTED_CHAIN = 'unsupported_chain';
export const VERIFY_NOT_FOUND = 'not_found';
export const VERIFY_HASH_MISMATCH = 'hash_mismatch';
export const VERIFY_FIELD_MISMATCH = 'field_mismatch';
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
    tokenAddress: raw[4].toLowerCase(),
    isPaid: raw[5],
    isCancelled: raw[6],
    invoiceDataHash: raw[7],
  };

  if (!verifyInvoiceHash(invoiceData, onChain.invoiceDataHash)) {
    return { code: VERIFY_HASH_MISMATCH, onChain };
  }

  const mismatch = findFieldMismatch(onChain, invoiceData);
  if (mismatch) {
    return { code: VERIFY_FIELD_MISMATCH, onChain, mismatch };
  }

  return { code: VERIFY_OK, onChain };
}

/** Lowercase an address for comparison, tolerating a missing one. */
function addr(value) {
  return typeof value === 'string' ? value.toLowerCase() : null;
}

/**
 * Name the first payload field that disagrees with the chain, or null.
 *
 * Both creation paths derive the payload and the contract arguments from the
 * same values — `client.address` is the `to` argument, `paymentToken.address`
 * the token, and `amountDue` the amount before `parseUnits` — so an invoice
 * made by this app always agrees with itself here. Only one assembled by hand
 * can disagree.
 *
 * @param {Object} onChain
 * @param {Object} invoiceData
 * @returns {string|null}
 */
function findFieldMismatch(onChain, invoiceData) {
  if (addr(invoiceData?.user?.address) !== onChain.from) return 'sender';
  if (addr(invoiceData?.client?.address) !== onChain.to) return 'recipient';
  if (addr(invoiceData?.paymentToken?.address) !== onChain.tokenAddress) {
    return 'payment token';
  }

  // The amount is the field worth lying about, and the one that needs the
  // payload's own `decimals` to compare — so a wrong `decimals` has to fail
  // here too rather than quietly rescaling the total.
  const decimals = invoiceData?.paymentToken?.decimals;
  if (!Number.isInteger(decimals) || decimals < 0) return 'amount';
  try {
    const expected = ethers.parseUnits(String(invoiceData?.amountDue), decimals);
    if (expected !== BigInt(onChain.amountDue)) return 'amount';
  } catch {
    return 'amount';
  }

  return null;
}
