import { ethers } from 'ethers';

/**
 * Compute a deterministic keccak256 hash of invoice data.
 * Keys are sorted recursively to ensure the same data always
 * produces the same hash regardless of property insertion order.
 *
 * @param {Object} invoiceData - the invoice data object
 * @returns {string} - keccak256 hash as hex string (0x-prefixed)
 */
export function computeInvoiceHash(invoiceData) {
  const serialized = stableStringify(invoiceData);
  return ethers.keccak256(ethers.toUtf8Bytes(serialized));
}

/**
 * Verify that an invoice's data matches an expected hash.
 *
 * @param {Object} invoiceData - the invoice data object
 * @param {string} expectedHash - the expected hash (from on-chain)
 * @returns {boolean}
 */
export function verifyInvoiceHash(invoiceData, expectedHash) {
  const computed = computeInvoiceHash(invoiceData);
  return computed.toLowerCase() === expectedHash.toLowerCase();
}

/**
 * Deterministic JSON serialization with sorted keys (recursive).
 * Ensures the same object always produces the same string
 * regardless of key insertion order.
 *
 * @param {*} obj
 * @returns {string}
 */
export function stableStringify(obj) {
  if (obj === null || obj === undefined) return JSON.stringify(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => stableStringify(item)).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const parts = sortedKeys.map((key) => {
    return JSON.stringify(key) + ':' + stableStringify(obj[key]);
  });
  return '{' + parts.join(',') + '}';
}
