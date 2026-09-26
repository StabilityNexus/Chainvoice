import {
  INVOICE_PAGE_SIZES,
  DEFAULT_INVOICE_PAGE_SIZE,
  getTotalPages,
  formatPageLabel,
  fetchInvoicePage,
} from "../../src/utils/invoicePagination.js";

// Mirrors Chainvoice.MAX_PAGE_LIMIT; a larger page size makes the view revert.
const MAX_PAGE_LIMIT = 50;

describe("invoicePagination page sizes", () => {
  test("stay within the contract's MAX_PAGE_LIMIT", () => {
    for (const size of INVOICE_PAGE_SIZES) {
      expect(size).toBeGreaterThan(0);
      expect(size).toBeLessThanOrEqual(MAX_PAGE_LIMIT);
    }
    expect(INVOICE_PAGE_SIZES).toContain(DEFAULT_INVOICE_PAGE_SIZE);
  });
});

describe("invoicePagination.getTotalPages", () => {
  test("is 1 when there is nothing to show", () => {
    expect(getTotalPages(0, 10)).toBe(1);
  });

  test("rounds a partial last page up", () => {
    expect(getTotalPages(10, 10)).toBe(1);
    expect(getTotalPages(11, 10)).toBe(2);
    expect(getTotalPages(25, 10)).toBe(3);
    expect(getTotalPages(25, 50)).toBe(1);
  });
});

describe("invoicePagination.formatPageLabel", () => {
  test("shows the 1-based page, page count and row range", () => {
    expect(formatPageLabel({ from: 1, to: 10, count: 25, page: 0 }, 10)).toBe(
      "Page 1 of 3 · 1–10 of 25"
    );
    expect(formatPageLabel({ from: 21, to: 25, count: 25, page: 2 }, 10)).toBe(
      "Page 3 of 3 · 21–25 of 25"
    );
  });
});

describe("invoicePagination.fetchInvoicePage", () => {
  test("passes offset and limit for the page and normalises the result", async () => {
    const calls = [];
    const view = async (...args) => {
      calls.push(args);
      return [["a", "b"], 12n];
    };

    const result = await fetchInvoicePage(view, "0xabc", 1, 10);

    expect(calls).toEqual([["0xabc", 10, 10]]);
    expect(result).toEqual({ invoices: ["a", "b"], total: 12 });
  });

  test("returns an empty page with the total when past the end", async () => {
    const view = async () => [[], 5n];
    await expect(fetchInvoicePage(view, "0xabc", 3, 10)).resolves.toEqual({
      invoices: [],
      total: 5,
    });
  });
});
