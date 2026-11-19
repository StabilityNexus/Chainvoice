import { ethers } from "ethers";
import { isInvoicePayable, sumBaseUnits } from "./chainInvoice.js";

/**
 * Group payable invoices that share a sender, payment token and issue day.
 *
 * Callers must pass the invoices that are currently visible: a suggestion is
 * an offer to pay every invoice in it, so it must never include hidden rows.
 *
 * @param {Array<Object>} invoices - visible invoices
 * @returns {Array<Object>} batch suggestions
 */
export function findBatchSuggestions(invoices) {
  const suggestions = [];
  const groups = invoices
    .filter(isInvoicePayable)
    .reduce((acc, inv) => {
      // Undated on-chain-only invoices would otherwise all share the
      // "Invalid Date" key and be suggested as one bogus batch.
      const issueDate = inv.issueDate
        ? new Date(inv.issueDate).toDateString()
        : `undated-${inv.id}`;
      const key = `${inv.user?.address}_${inv.paymentToken?.address || "ETH"
        }_${issueDate}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(inv);
      return acc;
    }, {});

  Object.entries(groups).forEach(([key, invoices]) => {
    if (invoices.length >= 2) {
      const totalAmount = ethers.formatUnits(
        sumBaseUnits(invoices),
        invoices[0].paymentToken.decimals
      );
      suggestions.push({
        id: key,
        invoices,
        sender: invoices[0].user,
        token: invoices[0].paymentToken,
        totalAmount,
        reason: `${invoices.length} invoices from same sender on same day`,
        type: "same_day_sender",
      });
    }
  });

  return suggestions;
}
