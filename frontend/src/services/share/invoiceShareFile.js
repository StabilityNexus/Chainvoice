import { encodeInvoiceShare } from './invoiceShareCodec.js';
import { buildInvoiceShareUrl } from './invoiceShareLink.js';

/**
 * File fallback for invoices too large to share as a link or a QR code.
 *
 * The token itself has no size limit — links and QR codes do. A long invoice
 * (dozens of line items) still encodes fine, it just cannot survive a chat
 * client that truncates URLs. Writing the same token to a file sidesteps
 * every one of those limits and keeps the share channel the sender's choice:
 * email, Discord, a USB stick.
 *
 * The file is JSON with the token inside rather than the bare token, so it is
 * inspectable — someone who opens it can see which invoice and which network
 * it is for without running it through the app.
 */

const FILE_FORMAT = 'chainvoice-invoice-share';
const FILE_VERSION = 1;
const FILE_EXTENSION = 'cvinv';

/**
 * Build the object written to a `.cvinv` file.
 *
 * `link` is included alongside `token` purely as a convenience: it is the
 * same data, and a recipient who received the file can paste that line
 * instead of hunting for the import page.
 *
 * @param {Object} params - same shape as {@link encodeInvoiceShare}
 * @returns {Object}
 */
export function buildInvoiceShareFile(params) {
  const token = encodeInvoiceShare(params);
  return {
    format: FILE_FORMAT,
    version: FILE_VERSION,
    invoiceId: String(params.invoiceId),
    chainId: Number(params.chainId),
    exportedAt: new Date().toISOString(),
    token,
    link: buildInvoiceShareUrl(params),
  };
}

/**
 * Download an invoice as a `.cvinv` file.
 *
 * @param {Object} params - same shape as {@link encodeInvoiceShare}
 * @returns {string} the filename written
 */
export function downloadInvoiceShareFile(params) {
  const contents = buildInvoiceShareFile(params);
  const blob = new Blob([JSON.stringify(contents, null, 2)], {
    type: 'application/json;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const filename = `chainvoice-invoice-${contents.invoiceId}.${FILE_EXTENSION}`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Read a shared invoice file back to text.
 *
 * Returns the raw text rather than a parsed token so the caller can hand it
 * to `parseInvoiceShareInput`, which already copes with a file that contains
 * a token, a link, or the JSON wrapper around either.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readInvoiceShareFile(file) {
  return file.text();
}

export { FILE_FORMAT, FILE_VERSION, FILE_EXTENSION };
