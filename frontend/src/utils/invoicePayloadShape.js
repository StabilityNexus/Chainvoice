/**
 * Check that an invoice payload has the shape the invoice pages render.
 *
 * The on-chain hash proves a payload is the one the sender committed to, not
 * that it is well formed: a hostile sender can commit to `{ user: { fname: 1 } }`
 * just as easily. Received, Sent and Import render these fields directly (for
 * example `fname.charAt(0)`), and the payload stays in IndexedDB, so a wrong
 * type would crash the page on every visit. Payloads made by this app always
 * pass; only one assembled by hand can fail.
 */

const PARTY_TEXT_FIELDS = [
  "address",
  "fname",
  "lname",
  "email",
  "country",
  "city",
  "postalcode",
];
const ITEM_TEXT_FIELDS = ["description", "discountType", "taxType"];

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isAbsent = (value) => value === undefined || value === null;

const isPrimitive = (value) =>
  isAbsent(value) || ["string", "number", "boolean"].includes(typeof value);

const isTextOrAbsent = (value) => isAbsent(value) || typeof value === "string";

const isTextNumberOrAbsent = (value) =>
  isAbsent(value) || typeof value === "string" || typeof value === "number";

/** A flat object whose named text fields are strings and the rest primitives. */
function isFlatRecord(value, textFields) {
  if (!isPlainObject(value)) return false;
  return Object.entries(value).every(([key, field]) =>
    textFields.includes(key) ? isTextOrAbsent(field) : isPrimitive(field)
  );
}

/**
 * Name the first part of the payload with the wrong shape, or null.
 *
 * @param {*} payload - an invoice payload from the relay, a share link or a backup
 * @returns {string|null}
 */
export function getPayloadShapeError(payload) {
  if (!isPlainObject(payload)) return "payload";
  if (!isTextNumberOrAbsent(payload.amountDue)) return "amountDue";
  if (!isTextNumberOrAbsent(payload.issueDate)) return "issueDate";
  if (!isTextNumberOrAbsent(payload.dueDate)) return "dueDate";

  const token = payload.paymentToken;
  if (
    !isPlainObject(token) ||
    typeof token.address !== "string" ||
    !isTextOrAbsent(token.symbol) ||
    !isTextOrAbsent(token.name)
  ) {
    return "paymentToken";
  }

  if (!isFlatRecord(payload.user, PARTY_TEXT_FIELDS)) return "user";
  if (!isFlatRecord(payload.client, PARTY_TEXT_FIELDS)) return "client";

  if (!Array.isArray(payload.items)) return "items";
  if (!payload.items.every((item) => isFlatRecord(item, ITEM_TEXT_FIELDS))) {
    return "items";
  }

  if (!isAbsent(payload.batchInfo) && !isFlatRecord(payload.batchInfo, [])) {
    return "batchInfo";
  }

  return null;
}
