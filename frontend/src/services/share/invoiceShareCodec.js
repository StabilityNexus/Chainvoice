import { deflateSync, inflateSync } from 'fflate';
import {
  bytesToBase64Url,
  base64UrlToBytes,
} from '../relay/invoiceCrypto.js';

/**
 * Self-contained invoice sharing: pack an invoice payload small enough to
 * travel inside a link or a QR code.
 *
 * This exists because relay delivery has a hard precondition — the recipient
 * must have registered a messaging key on-chain (see
 * `sendEncryptedInvoice`). Until they do, the invoice exists on-chain but its
 * payload has nowhere to go and the recipient sees only the on-chain stub. A
 * share token carries the payload itself, so it works with no key registered
 * and with the relay down or the message expired.
 *
 * Deliberately NOT encrypted. The only key that could travel with a
 * self-contained link is one embedded in the same link, which anybody holding
 * the link also holds — that is obfuscation, not confidentiality, and calling
 * it encryption would misrepresent it. Treat a share token as public: whoever
 * has it can read the invoice.
 *
 * Integrity is not left to the token either. Every payload is committed to
 * on-chain as `invoiceDataHash` at creation time, so the importer recomputes
 * that hash and compares it against the chain (see `verifyShareAgainstChain`).
 * A tampered token fails that check, which is strictly stronger than any
 * signature the token could carry about itself.
 */

/**
 * Token format marker.
 *
 * A token is `cv1.<base64url(rawDeflate(json))>`. The prefix is matched
 * exactly on decode so a future format can change the encoding without older
 * tokens being misread as the new one — a silent misparse here would surface
 * as an unverifiable invoice rather than an obvious error.
 */
const TOKEN_PREFIX = 'cv1.';
const ENVELOPE_TYPE = 'invoice';
const ENVELOPE_VERSION = 1;

/**
 * Practical size ceilings, in characters of the finished URL.
 *
 * Neither is a spec limit. Browsers accept far longer URLs than
 * SHARE_URL_MAX_CHARS, and a version-40 QR code holds 2,953 bytes — but chat
 * clients wrap or truncate long links, and a maximally dense QR is
 * unreliable in front of a phone camera. These are the points past which the
 * UI should offer the file fallback instead.
 */
const SHARE_URL_MAX_CHARS = 2000;
const SHARE_QR_MAX_CHARS = 1500;

/** Thrown for every malformed or unsupported token, with a `code` to switch on. */
export class InvoiceShareError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'InvoiceShareError';
    this.code = code;
  }
}

/**
 * Serialise an envelope to JSON.
 *
 * BigInts are stringified rather than thrown on, matching `encryptPayload` —
 * invoice amounts and ids reach this layer as either strings or BigInts
 * depending on whether they came from a form or from a contract read.
 */
function toJson(envelope) {
  return JSON.stringify(envelope, (_, v) =>
    typeof v === 'bigint' ? v.toString() : v
  );
}

/**
 * Pack an invoice into a share token.
 *
 * `invoiceData` must be byte-for-byte the object that was hashed into the
 * on-chain `invoiceDataHash`. It is carried through untouched: the envelope
 * wraps it rather than merging into it, because any field added, renamed or
 * dropped inside it changes the hash and makes the token unverifiable on the
 * far side.
 *
 * @param {Object} params
 * @param {number|string|bigint} params.invoiceId - on-chain invoice id
 * @param {number|string} params.chainId
 * @param {Object} params.invoiceData - the payload exactly as hashed
 * @returns {string} share token
 */
export function encodeInvoiceShare({ invoiceId, chainId, invoiceData }) {
  const numericChainId = Number(chainId);
  if (!Number.isFinite(numericChainId) || numericChainId <= 0) {
    throw new InvoiceShareError(
      'INVALID_CHAIN',
      `Invalid chainId for a share token: ${chainId}`
    );
  }
  if (invoiceId === null || invoiceId === undefined || invoiceId === '') {
    throw new InvoiceShareError(
      'INVALID_INVOICE_ID',
      'Invalid invoiceId for a share token'
    );
  }
  if (!invoiceData || typeof invoiceData !== 'object') {
    throw new InvoiceShareError(
      'INVALID_PAYLOAD',
      'Invoice data is required to build a share token'
    );
  }

  const envelope = {
    v: ENVELOPE_VERSION,
    t: ENVELOPE_TYPE,
    id: invoiceId.toString(),
    c: numericChainId,
    d: invoiceData,
  };

  // Raw DEFLATE, not zlib: the two-byte zlib header buys nothing here and the
  // token is length-critical. fflate's deflateSync is already raw.
  const compressed = deflateSync(new TextEncoder().encode(toJson(envelope)), {
    level: 9,
  });
  return TOKEN_PREFIX + bytesToBase64Url(compressed);
}

/**
 * Unpack a share token.
 *
 * Every failure mode of a link that travelled through a chat app — truncated,
 * line-wrapped, prefix stripped, produced by a newer version of the app —
 * lands here as an InvoiceShareError rather than a decode that half-succeeds.
 *
 * Nothing returned is trusted. The payload still has to be checked against
 * the on-chain hash before it is shown as an invoice or stored.
 *
 * @param {string} token
 * @returns {{invoiceId: string, chainId: number, invoiceData: Object}}
 */
export function decodeInvoiceShare(token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw new InvoiceShareError('EMPTY', 'No invoice share code found');
  }

  const trimmed = token.trim();
  if (!trimmed.startsWith(TOKEN_PREFIX)) {
    throw new InvoiceShareError(
      'UNKNOWN_FORMAT',
      'This does not look like a Chainvoice share link. It may have been ' +
        'shortened or truncated on the way here — ask the sender to resend it.'
    );
  }

  let json;
  try {
    const bytes = base64UrlToBytes(trimmed.slice(TOKEN_PREFIX.length));
    json = new TextDecoder().decode(inflateSync(bytes));
  } catch {
    throw new InvoiceShareError(
      'CORRUPT',
      'This share link is incomplete or damaged. Chat apps sometimes cut ' +
        'long links — ask the sender to share the invoice file instead.'
    );
  }

  let envelope;
  try {
    envelope = JSON.parse(json);
  } catch {
    throw new InvoiceShareError('CORRUPT', 'This share link is damaged');
  }

  if (envelope?.t !== ENVELOPE_TYPE) {
    throw new InvoiceShareError('UNKNOWN_FORMAT', 'This is not an invoice share link');
  }
  if (Number(envelope.v) !== ENVELOPE_VERSION) {
    throw new InvoiceShareError(
      'UNSUPPORTED_VERSION',
      `This link was made by a newer version of Chainvoice (format v${envelope.v}). Please refresh and try again.`
    );
  }

  const chainId = Number(envelope.c);
  if (!Number.isFinite(chainId) || chainId <= 0) {
    throw new InvoiceShareError('INVALID_CHAIN', 'This share link has no valid network');
  }
  if (!envelope.id) {
    throw new InvoiceShareError('INVALID_INVOICE_ID', 'This share link has no invoice id');
  }
  if (!envelope.d || typeof envelope.d !== 'object' || Array.isArray(envelope.d)) {
    throw new InvoiceShareError('INVALID_PAYLOAD', 'This share link has no invoice data');
  }

  return {
    invoiceId: String(envelope.id),
    chainId,
    invoiceData: envelope.d,
  };
}

/**
 * Measure a finished share URL against the practical limits.
 *
 * Returned rather than enforced: an invoice too big for a QR code is still
 * perfectly shareable as a link, and one too big for a link is still
 * shareable as a file. Only the UI knows which of those it is offering.
 *
 * @param {string} url
 * @returns {{chars: number, fitsUrl: boolean, fitsQr: boolean}}
 */
export function describeShareSize(url) {
  const chars = typeof url === 'string' ? url.length : 0;
  return {
    chars,
    fitsUrl: chars > 0 && chars <= SHARE_URL_MAX_CHARS,
    fitsQr: chars > 0 && chars <= SHARE_QR_MAX_CHARS,
  };
}

export {
  TOKEN_PREFIX,
  ENVELOPE_VERSION,
  SHARE_URL_MAX_CHARS,
  SHARE_QR_MAX_CHARS,
};
