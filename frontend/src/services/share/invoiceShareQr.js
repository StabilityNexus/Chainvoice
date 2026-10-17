/**
 * QR rendering for share links: a Chainvoice mark in the middle, and a
 * downloadable card that says what the code is for.
 *
 * Level M, not the H that a centre logo usually calls for. That advice
 * assumes a payload small enough that raising the redundancy is free; ours is
 * not, and raising it backfires. Decoding a real 620-character link at each
 * level, the grid grows faster than the redundancy helps:
 *
 *   L  version 17,  89 modules   M  version 19,  97 modules
 *   Q  version 24, 117 modules   H  version 27, 129 modules
 *
 * H was the worst of the four to actually read back. M decodes reliably while
 * leaving a real error budget, so it is the one that survives a phone camera.
 *
 * The logo fits inside that budget because it is smaller than it looks: it
 * spans LOGO_RATIO of the width, which is the square of that — about 3% — of
 * the modules. M can lose 15%.
 *
 * A UPI code of the kind GPay shows encodes about 60 characters and fits in
 * version 7, which is why theirs stays chunky with a large logo. Ours carries
 * the whole invoice, so it cannot be that sparse. What it can be is large:
 * see SHARE_QR_MAX_CHARS, and the enlarged view in the share dialog.
 */

/** See the note above: measured, not assumed. */
const ERROR_CORRECTION = 'M';

/**
 * Fraction of the code's width the logo may cover.
 *
 * Width, so the module cost is the square of it — 0.16 covers about 2.6% of
 * the code against level M's 15% budget, leaving the rest to absorb glare,
 * creases and a poor camera.
 */
const LOGO_RATIO = 0.16;

// BASE_URL keeps the logo resolvable when the app is served from a
// subdirectory, such as a /pr-preview/pr-N/ build.
const DEFAULT_LOGO_SRC = `${import.meta.env?.BASE_URL ?? '/'}logo.png`;

/** Load an image, resolving to null rather than throwing. */
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Trace a rounded rectangle; `roundRect` is still patchy across browsers. */
function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

/**
 * Render the share link as a QR code with the Chainvoice mark in the centre.
 *
 * A logo that fails to load is skipped rather than fatal: a plain QR still
 * does the job, an error where the code should be does not.
 *
 * @param {string} url - the share link to encode
 * @param {Object} [options]
 * @param {number} [options.size=512] - pixel width of the rendered code
 * @param {string} [options.logoSrc=DEFAULT_LOGO_SRC]
 * @returns {Promise<string>} PNG data URL
 */
export async function renderShareQr(url, { size = 512, logoSrc = DEFAULT_LOGO_SRC } = {}) {
  const canvas = document.createElement('canvas');
  const { default: QRCode } = await import('qrcode');
  await QRCode.toCanvas(canvas, url, {
    errorCorrectionLevel: ERROR_CORRECTION,
    margin: 2,
    width: size,
    color: { dark: '#111827', light: '#ffffff' },
  });

  const logo = await loadImage(logoSrc);
  if (logo) {
    const ctx = canvas.getContext('2d');
    const box = canvas.width * LOGO_RATIO;
    const pad = box * 0.12;
    const x = (canvas.width - box) / 2;
    const y = (canvas.height - box) / 2;

    // A quiet zone behind the mark. Without it the logo sits on top of dark
    // modules and scanners read the edges of both as one shape.
    ctx.fillStyle = '#ffffff';
    roundedRect(ctx, x - pad, y - pad, box + pad * 2, box + pad * 2, box * 0.2);
    ctx.fill();
    ctx.drawImage(logo, x, y, box, box);
  }

  return canvas.toDataURL('image/png');
}


/** Shorten text with an ellipsis until it fits the given width. */
function fitText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) {
    out = out.slice(0, -1);
  }
  return `${out}…`;
}

/**
 * Compose the shareable card: the code, and what it is for, as one image.
 *
 * This is the thing that actually gets sent. A bare link in a chat says
 * nothing about what it opens, and a bare QR is an anonymous black square —
 * neither survives being forwarded, screenshotted or printed. A payment app's
 * share sheet hands over a card instead: who is asking, the code, and one
 * line saying what to do with it. This is that card.
 *
 * The context sits around the code rather than inside it. A UPI code has to
 * carry the payee name in its URI because the code is all the scanner gets;
 * our token already carries the whole invoice, so putting it in the image
 * would cost capacity and buy nothing.
 *
 * @param {string} url - the share link to encode
 * @param {Object} params
 * @param {string} params.heading - who is asking, e.g. the sender's name
 * @param {string} [params.subheading] - a line under the heading
 * @param {string} [params.caption] - printed under the code, e.g. "Invoice #6 · 10.0 DAI"
 * @param {string} [params.footnote] - the call to action
 * @param {string} [params.logoSrc=DEFAULT_LOGO_SRC]
 * @returns {Promise<string>} PNG data URL
 */
export async function renderShareQrCard(
  url,
  { heading, subheading, caption, footnote, logoSrc = DEFAULT_LOGO_SRC } = {}
) {
  const qrDataUrl = await renderShareQr(url, { size: 640, logoSrc });
  const qr = await loadImage(qrDataUrl);
  // Without the code there is no card worth sending; hand back what we have.
  if (!qr) return qrDataUrl;

  const WIDTH = 860;
  const GUTTER = 56;
  const CARD_X = GUTTER;
  const CARD_W = WIDTH - GUTTER * 2;
  const QR_SIZE = CARD_W - 96;

  const headerTop = 96;
  const cardTop = headerTop + (subheading ? 108 : 78);
  const qrTop = cardTop + 48;
  const captionTop = qrTop + QR_SIZE + 52;
  const cardBottom = captionTop + (caption ? 36 : -16);
  const height = cardBottom + (footnote ? 130 : 64);

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#eef2fb';
  ctx.fillRect(0, 0, WIDTH, height);

  const logo = await loadImage(logoSrc);
  const avatar = 62;
  let textLeft = CARD_X;
  if (logo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(CARD_X + avatar / 2, headerTop - 8, avatar / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.clip();
    ctx.drawImage(logo, CARD_X + 6, headerTop - 8 - avatar / 2 + 6, avatar - 12, avatar - 12);
    ctx.restore();
    textLeft = CARD_X + avatar + 20;
  }

  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1f2937';
  ctx.font = '600 40px Montserrat, Inter, system-ui, sans-serif';
  ctx.fillText(
    fitText(ctx, heading || 'Chainvoice invoice', WIDTH - textLeft - GUTTER),
    textLeft,
    headerTop + 4
  );

  if (subheading) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '400 24px Inter, system-ui, sans-serif';
    ctx.fillText(
      fitText(ctx, subheading, WIDTH - textLeft - GUTTER),
      textLeft,
      headerTop + 44
    );
  }

  // The white card the code sits on, as a payment app presents it.
  ctx.fillStyle = '#ffffff';
  roundedRect(ctx, CARD_X, cardTop, CARD_W, cardBottom - cardTop, 40);
  ctx.fill();

  ctx.drawImage(qr, CARD_X + (CARD_W - QR_SIZE) / 2, qrTop, QR_SIZE, QR_SIZE);

  if (caption) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.font = '500 27px Inter, system-ui, sans-serif';
    ctx.fillText(
      fitText(ctx, caption, CARD_W - 64),
      WIDTH / 2,
      captionTop
    );
  }

  if (footnote) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6b7280';
    ctx.font = '400 26px Inter, system-ui, sans-serif';
    ctx.fillText(fitText(ctx, footnote, WIDTH - GUTTER * 2), WIDTH / 2, cardBottom + 74);
  }

  return canvas.toDataURL('image/png');
}

/**
 * Turn a data URL into a File, for `navigator.share({ files })`.
 *
 * @param {string} dataUrl
 * @param {string} filename
 * @returns {Promise<File>}
 */
export async function dataUrlToFile(dataUrl, filename) {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], filename, { type: blob.type || 'image/png' });
}

export { ERROR_CORRECTION, LOGO_RATIO };
