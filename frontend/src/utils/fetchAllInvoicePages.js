
import { MAX_PAGE_LIMIT } from "./invoicePagination.js";

export async function fetchAllInvoicePages(
  view,
  user,
  pageSize = MAX_PAGE_LIMIT,
  blockTag
) {
  if (!Number.isSafeInteger(pageSize) || pageSize <= 0) {
    throw new Error("Invalid invoice page size.");
  }

  if (
    blockTag !== undefined &&
    (!Number.isSafeInteger(blockTag) || blockTag < 0)
  ) {
    throw new Error("Invalid block tag.");
  }

  const allInvoices = [];
  let total = null;

  for (
    let offset = 0;
    total === null || offset < total;
    offset += pageSize
  ) {
    const result =
      blockTag === undefined
        ? await view(user, offset, pageSize)
        : await view(user, offset, pageSize, { blockTag });

    const [page, pageTotal] = result;
    const currentTotal = Number(pageTotal);

    if (!Number.isSafeInteger(currentTotal) || currentTotal < 0) {
      throw new Error("The contract returned an invalid invoice count.");
    }

    if (total === null) {
      total = currentTotal;
    } else if (total !== currentTotal) {
      throw new Error(
        "Invoice data changed during summary retrieval. Please retry."
      );
    }

    const invoices = Array.from(page ?? []);
    const expectedCount = Math.min(pageSize, total - offset);

    if (invoices.length !== expectedCount) {
      throw new Error(
        "Unable to retrieve all invoices for the financial summary."
      );
    }

    allInvoices.push(...invoices);
  }

  return allInvoices;
}
