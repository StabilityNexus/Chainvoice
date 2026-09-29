// Paging for the on-chain getSentInvoices / getReceivedInvoices views, which
// return one page of invoices plus the total. The contract rejects a limit
// above MAX_PAGE_LIMIT (50), so no page size here may exceed it.

export const INVOICE_PAGE_SIZES = [10, 20, 50];
export const DEFAULT_INVOICE_PAGE_SIZE = 10;

/** Number of pages needed to show `total` invoices; at least 1. */
export function getTotalPages(total, pageSize) {
  if (!total || !pageSize) return 1;
  return Math.ceil(total / pageSize);
}

/** Label for MUI TablePagination's labelDisplayedRows. `page` is 0-based. */
export function formatPageLabel({ from, to, count, page }, pageSize) {
  return `Page ${page + 1} of ${getTotalPages(count, pageSize)} · ${from}–${to} of ${count}`;
}

/**
 * Fetch one page with a contract view shaped (user, offset, limit) ->
 * (invoices, total). `page` is 0-based.
 */
export async function fetchInvoicePage(view, user, page, pageSize) {
  const [invoices, total] = await view(user, page * pageSize, pageSize);
  return { invoices: Array.from(invoices), total: Number(total) };
}

/**
 * Narrow a selection of invoice ids to those present on the loaded page.
 * Selection and batch actions can only act on the page that is currently
 * loaded, so ids left over from another page have to be dropped rather than
 * silently paid against — or quietly filtered out at payment time.
 */
export function filterSelectionToPage(selectedIds, pageInvoices) {
  const pageIds = new Set((pageInvoices || []).map((invoice) => invoice.id));
  const kept = new Set();
  for (const id of selectedIds || []) {
    if (pageIds.has(id)) kept.add(id);
  }
  return kept;
}
