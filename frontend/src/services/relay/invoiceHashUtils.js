import { ethers } from 'ethers';

/**
 * Compute a deterministic keccak256 hash of invoice data.
 * Keys are sorted recursively to ensure the same data always
 * produces the same hash regardless of property insertion order.
 *
 * This is the commitment stored on-chain as `invoiceDataHash`. The
 * plaintext never touches the chain — the receiver recomputes this hash
 * from the payload delivered over the relay and compares it against the
 * on-chain value to prove the sender did not tamper with it in transit.
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
  if (!expectedHash) return false;
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
  // `null` for undefined, matching what JSON.stringify does to an undefined
  // array entry. The payload reaches the receiver as JSON, so anything this
  // renders differently to JSON.stringify makes the two sides compute
  // different hashes and silently fails verification.
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'bigint') return JSON.stringify(obj.toString());
  if (obj instanceof Date) return JSON.stringify(obj.toISOString());
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    // Indexed rather than mapped: Array.prototype.map skips holes, which would
    // collapse a sparse array into fewer elements than JSON.stringify emits.
    const items = [];
    for (let i = 0; i < obj.length; i++) {
      items.push(stableStringify(obj[i]));
    }
    return '[' + items.join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const parts = [];
  for (const key of sortedKeys) {
    if (obj[key] !== undefined) {
      parts.push(JSON.stringify(key) + ':' + stableStringify(obj[key]));
    }
  }
  return '{' + parts.join(',') + '}';
}
