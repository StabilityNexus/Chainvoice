import {
  encodeInvoiceShare,
  decodeInvoiceShare,
  InvoiceShareError,
  TOKEN_PREFIX,
} from './invoiceShareCodec.js';

/**
 * Share links and the several shapes they come back in.
 *
 * A token leaves the app inside a URL, but it reaches the importer however
 * the two people happened to share it: a tapped link, a pasted link, a
 * scanned QR, a link that a chat app wrapped across two lines, or a `.cvinv`
 * file when the invoice was too big for a URL. All of those funnel through
 * {@link parseInvoiceShareInput} so the import page has one code path.
 */

/** Route that renders the importer. Registered in App.jsx. */
export const SHARE_IMPORT_PATH = '/dashboard/import';

/**
 * Query parameter carrying the token.
 *
 * Single-letter on purpose — the whole link is length-critical, and this one
 * is never typed by a human.
 */
export const SHARE_TOKEN_PARAM = 'i';

/**
 * Resolve the app's own base URL.
 *
 * Falls back to a bare path when there is no `window`, so building a link in
 * a test or a non-browser context yields something inspectable rather than
 * throwing.
 */
function defaultOrigin() {
  if (typeof window === 'undefined' || !window.location) return '';
  return window.location.origin;
}

function defaultBasePath() {
  const base =
    typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL
      : '/';
  return base.endsWith('/') ? base : `${base}/`;
}

/**
 * Build the shareable URL for an invoice.
 *
 * The token goes in the hash fragment, never in a query string on the path.
 * Fragments are not sent to servers, so the invoice details never appear in
 * an access log, a CDN cache or a Referer header. The app's HashRouter puts
 * the route there anyway, so this costs nothing.
 *
 * @param {Object} params - same shape as {@link encodeInvoiceShare}
 * @param {Object} [options]
 * @param {string} [options.origin] - override the origin (tests, previews)
 * @returns {string} absolute share URL
 */
export function buildInvoiceShareUrl(params, { origin } = {}) {
  const token = encodeInvoiceShare(params);
  const query = new URLSearchParams({ [SHARE_TOKEN_PARAM]: token }).toString();
  const root = origin === undefined ? defaultOrigin() : origin;
  return `${root}${defaultBasePath()}#${SHARE_IMPORT_PATH}?${query}`;
}

/**
 * Pull a token out of whatever the user gave us.
 *
 * Tolerant by design, because every one of these has been seen in the wild:
 * whitespace and newlines injected by a chat client wrapping a long link, a
 * link pasted without its scheme, a bare token, or the contents of an
 * exported file. What it will not do is guess — anything with no recognisable
 * token throws, rather than being passed downstream to fail as a corrupt
 * payload.
 *
 * @param {string} input - a URL, a bare token, or exported file contents
 * @returns {string} the token
 */
export function parseInvoiceShareInput(input) {
  if (typeof input !== 'string' || !input.trim()) {
    throw new InvoiceShareError('EMPTY', 'Paste a share link or choose a file');
  }

  // Chat clients and email wrap long links. A base64url token contains no
  // whitespace, so stripping all of it can only repair the damage.
  const cleaned = input.replace(/\s+/g, '');

  if (cleaned.startsWith(TOKEN_PREFIX)) return cleaned;

  // An exported file: JSON with the token inside. Parsed before the URL
  // branch because file contents can also contain a full link.
  if (cleaned.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleaned);
      const fromFile = parsed?.token ?? parsed?.link;
      if (typeof fromFile === 'string') return parseInvoiceShareInput(fromFile);
    } catch {
      // Not JSON after all; fall through to the URL branch.
    }
  }

  // A link. Matched with a regex rather than `new URL()` because the token
  // lives inside the hash fragment, which URL exposes as one opaque string
  // that still has to be picked apart — and because this has to cope with
  // input that is not a well-formed URL at all.
  const match = cleaned.match(
    new RegExp(`[?&]${SHARE_TOKEN_PARAM}=(${TOKEN_PREFIX.replace('.', '\\.')}[A-Za-z0-9_-]+)`)
  );
  if (match) return match[1];

  throw new InvoiceShareError(
    'UNKNOWN_FORMAT',
    'No invoice share code found in that link. Copy the whole link, ' +
      'including the part after the # sign.'
  );
}

/**
 * Parse and decode in one step.
 *
 * @param {string} input - a URL, a bare token, or exported file contents
 * @returns {{invoiceId: string, chainId: number, invoiceData: Object}}
 */
export function decodeInvoiceShareInput(input) {
  return decodeInvoiceShare(parseInvoiceShareInput(input));
}
