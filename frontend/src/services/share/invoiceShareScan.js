import jsQR from 'jsqr';
import { InvoiceShareError } from './invoiceShareCodec.js';

/**
 * Read a share code out of a QR image.
 *
 * The third way an invoice arrives. A link can be tapped and a file can be
 * chosen, but a QR is often all someone has: a screenshot of a chat, a photo
 * of a printed invoice, the card this app itself produces. Without this they
 * would have to find a second device to point a camera with.
 *
 * Decoding happens entirely in the page — the image is never uploaded
 * anywhere, which matters because it carries the whole invoice.
 */

/**
 * Largest image worth decoding, in bytes.
 *
 * A screenshot or photo of a QR is comfortably under this; anything larger is
 * a mistaken pick, and decoding runs on the main thread, so it is refused
 * before it can freeze the tab.
 */
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

/**
 * Longest edge the image is scaled to before decoding.
 *
 * A phone photo can be 4000px wide. Scanning at that size is slow and no more
 * accurate — the modules are already far larger than they need to be — while
 * scaling too far destroys them. This is comfortably above what any readable
 * QR needs.
 */
const DECODE_MAX_EDGE = 1600;

/** Load a File into an image element, or reject if it is not a usable image. */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new InvoiceShareError('UNREADABLE_IMAGE', 'That file is not an image.')
      );
    };
    img.src = url;
  });
}

/**
 * Draw an image to a canvas at a sane size and return its pixels.
 *
 * @param {HTMLImageElement} img
 * @param {number} maxEdge
 * @returns {ImageData}
 */
function pixelsFor(img, maxEdge) {
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  // A QR photographed against a dark surface can arrive with transparency;
  // flattening onto white keeps the binariser from reading it as all-dark.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

/**
 * Decode the text of a QR code in an image file.
 *
 * Tries the image as given, then inverted. A code photographed off a screen
 * in dark mode, or rendered light-on-dark, is a normal thing to be handed and
 * fails the first pass every time.
 *
 * @param {File} file
 * @returns {Promise<string>} the decoded text
 */
export async function scanQrImageFile(file) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new InvoiceShareError(
      'UNREADABLE_IMAGE',
      'Choose an image of a QR code.'
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new InvoiceShareError(
      'TOO_LARGE',
      'That image is too large. A screenshot or photo of the code is enough.'
    );
  }

  const img = await loadImageFromFile(file);
  const pixels = pixelsFor(img, DECODE_MAX_EDGE);

  for (const inversion of ['dontInvert', 'onlyInvert']) {
    // jsQR does not always return null when it fails. Handed something that
    // looks like a code but will not extract — a plain dark rectangle is
    // enough — it throws from inside the extractor. To a caller that is the
    // same outcome as finding nothing, so it is treated as one rather than
    // surfacing a TypeError from a dependency.
    let result = null;
    try {
      result = jsQR(pixels.data, pixels.width, pixels.height, {
        inversionAttempts: inversion,
      });
    } catch {
      result = null;
    }
    if (result?.data) return result.data;
  }

  throw new InvoiceShareError(
    'NO_QR_FOUND',
    'No QR code found in that image. Try a sharper or less cropped picture.'
  );
}

export { MAX_IMAGE_BYTES };
