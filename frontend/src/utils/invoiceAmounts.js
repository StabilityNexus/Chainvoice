import { ethers } from "ethers";

/**
 * Resolve the decimals to format an on-chain invoice amount with.
 *
 * Truthiness is not usable here: `0` is a legitimate decimals value, and a
 * token whose metadata lookup failed leaves it undefined. Either one skipping
 * the conversion would leave the amount in base units, which then flows into
 * `parseUnits` and the native `value` of a payment — so this returns null
 * rather than guessing, and callers drop the invoice instead of showing or
 * paying a wrong figure.
 *
 * Shared by every page that renders an on-chain-only invoice. It decides
 * payment amounts, so it must not be duplicated per page and allowed to drift.
 *
 * @param {Object} paymentToken - the invoice's payment token descriptor
 * @returns {number|null} decimals, or null when they cannot be trusted
 */
export function resolveInvoiceDecimals(paymentToken) {
  const raw = paymentToken?.decimals;
  if (raw !== undefined && raw !== null && raw !== "") {
    const parsedDecimals = Number(raw);
    if (Number.isInteger(parsedDecimals) && parsedDecimals >= 0) {
      return parsedDecimals;
    }
    return null;
  }
  // Native currency carries no ERC-20 metadata; every supported chain uses 18.
  if (!paymentToken?.address || paymentToken.address === ethers.ZeroAddress) {
    return 18;
  }
  return null;
}

/**
 * Format a date for display, tolerating the nulls that on-chain-only invoices
 * carry — the chain does not store invoice dates, so a stub has none.
 *
 * @param {string|number|Date|null|undefined} value
 * @returns {string} a localised date-time, or an em dash placeholder
 */
export function formatInvoiceDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}
