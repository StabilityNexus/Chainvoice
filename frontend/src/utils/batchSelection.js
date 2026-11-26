/**
 * Ids of `invoices` that are also in `visibleInvoices`, in their original order.
 * A batch suggestion may only select invoices the user can see, so a filter
 * that hides an invoice also keeps it out of the batch payment.
 */
export function visibleInvoiceIds(invoices, visibleInvoices) {
  const visibleIds = new Set(visibleInvoices.map((inv) => inv.id));
  return invoices.map((inv) => inv.id).filter((id) => visibleIds.has(id));
}
