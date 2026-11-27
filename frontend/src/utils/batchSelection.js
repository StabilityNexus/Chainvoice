import { ethers } from "ethers";
import { isInvoicePayable, sumBaseUnits } from "./chainInvoice.js";

/**
 * Ids of `invoices` that are also in `visibleInvoices`, in their original order.
 * A batch suggestion may only select invoices the user can see, so a filter
 * that hides an invoice also keeps it out of the batch payment.
 */
export function visibleInvoiceIds(invoices, visibleInvoices) {
  const visibleIds = new Set(visibleInvoices.map((inv) => inv.id));
  return invoices.map((inv) => inv.id).filter((id) => visibleIds.has(id));
}

/**
 * Groups of 2+ payable invoices from the same sender, in the same token, issued
 * on the same day. Callers pass only the invoices on screen.
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
