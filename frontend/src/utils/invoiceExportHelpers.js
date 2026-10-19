"use client";

import { ethers } from "ethers";
import { getWagmiChainInfo } from "./wagmiChainHelpers";

/**
 * Resolve chain and token metadata for an invoice.
 */
export const resolveChainMeta = (invoice) => {
  const chainId = invoice.paymentToken?.chainId ?? invoice.chainId;
  const chainInfo = getWagmiChainInfo(chainId);
  const nativeSymbol = chainInfo?.nativeCurrency?.symbol || "ETH";
  const nativeName = chainInfo?.nativeCurrency?.name || "Ether";
  const tokenSymbol = invoice.paymentToken?.symbol || nativeSymbol;
  return { chainId, chainInfo, nativeSymbol, nativeName, tokenSymbol };
};

/**
 * Format the network fee from wei to a human-readable string.
 */
export const formatNetworkFee = (fee) => {
  try {
    return ethers.formatUnits(fee);
  } catch {
    return "0";
  }
};

/**
 * Derive a canonical invoice ID string.
 */
export const formatInvoiceId = (invoice) =>
  invoice.id.toString().padStart(6, "0");

/**
 * Derive the display status of an invoice.
 */
export const resolveStatus = (invoice) =>
  invoice.isCancelled ? "CANCELLED" : invoice.isPaid ? "PAID" : "UNPAID";

/**
 * Build a party (from / billTo) object from a person sub-object.
 * @param {Object} person - invoice.user or invoice.client
 * @param {*} fallback - value used when a field is missing ("N/A" for CSV, null for JSON)
 */
export const buildParty = (person, fallback = null) => ({
  name:
    `${person?.fname || ""} ${person?.lname || ""}`.trim() || fallback,
  email: person?.email || fallback,
  address: person?.address || fallback,
  city: person?.city || fallback,
  country: person?.country || fallback,
  postalCode: person?.postalcode || fallback,
});

/**
 * Normalize an invoice item with safe defaults.
 */
export const normalizeItem = (item) => ({
  description: item.description || "N/A",
  quantity: item.qty || 0,
  unitPrice: item.unitPrice || 0,
  discount: item.discount || "0",
  tax: item.tax || "0%",
  amount: item.amount || 0,
});

/**
 * Convert a date value to a locale-formatted string for CSV / PDF display.
 * Returns an empty string when the input is missing or invalid.
 */
export const toDisplayDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Convert a date value to a date-only string (YYYY-MM-DD) for CSV / JSON export.
 * Returns null when the input is missing or invalid.
 *
 * Issue and due dates are calendar dates: the picker produces local midnight and
 * the UI formats them in local time. The day is therefore read from the local
 * components, so an export shows the date the person picked and the UI shows.
 * Reading UTC components instead shifted the date back one day east of UTC
 * (local midnight in IST is 18:30 UTC the day before).
 *
 * The stored value is still an instant, so a viewer in another time zone reads
 * the calendar day in their own zone, exactly as the UI does for them.
 */
export const toISODate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * Format the total amount display for an invoice drawer.
 * Native payments (no token address or ZeroAddress) combine amount + fee.
 * ERC-20 payments show "amount TOKEN + fee NATIVE".
 */
export const formatInvoiceTotal = (invoice, fee, fallbackChainId) => {
  const tokenSymbol =
  invoice.paymentToken?.symbol ||
  getWagmiChainInfo(
    invoice.paymentToken?.chainId ?? invoice.chainId ?? fallbackChainId
  )?.nativeCurrency?.symbol ||
  "ETH";
  const tokenAddress = invoice.paymentToken?.address;
  const chainInfo = getWagmiChainInfo(
    invoice.paymentToken?.chainId ?? invoice.chainId ?? fallbackChainId
  );
  const nativeSymbol = chainInfo?.nativeCurrency?.symbol || "ETH";
  const formattedFee = formatNetworkFee(fee);
  const isNative = !tokenAddress || tokenAddress === ethers.ZeroAddress;

  if (isNative) {
    try {
      const amountDueWei = ethers.parseUnits(invoice.amountDue || "0", 18);
      const feeWei = ethers.parseUnits(formattedFee || "0", 18);
      const totalWei = amountDueWei + feeWei;
      const totalEth = ethers.formatUnits(totalWei, 18);
      return `${Number(totalEth).toFixed(6)} ${nativeSymbol}`;
    } catch {
      return `${(parseFloat(invoice.amountDue) + parseFloat(formattedFee)).toFixed(6)} ${nativeSymbol}`;
    }
  }
  return `${invoice.amountDue} ${tokenSymbol} + ${formattedFee} ${nativeSymbol}`;
};
