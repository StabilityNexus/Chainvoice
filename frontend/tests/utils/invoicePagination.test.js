import {
  MAX_PAGE_LIMIT,
  INVOICE_PAGE_SIZES,
  DEFAULT_INVOICE_PAGE_SIZE,
  getTotalPages,
  formatPageLabel,
  fetchInvoicePage,
  filterSelectionToPage,
} from "../../src/utils/invoicePagination.js";

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

describe("invoicePagination.filterSelectionToPage", () => {
  test("drops ids that are not on the loaded page", () => {
    const kept = filterSelectionToPage(
      new Set([1n, 2n, 99n]),
      [{ id: 1n }, { id: 2n }, { id: 3n }]
    );

    expect(kept).toEqual(new Set([1n, 2n]));
  });

  test("returns an empty set when the page shares no ids", () => {
    expect(filterSelectionToPage(new Set([1n, 2n]), [{ id: 11n }])).toEqual(
      new Set()
    );
    expect(filterSelectionToPage(new Set([1n]), [])).toEqual(new Set());
  });

  test("compares BigInt ids by value, not identity", () => {
    // The selection stores its own BigInt instances; only value equality can
    // match them against the freshly fetched page.
    expect(filterSelectionToPage(new Set([BigInt(7)]), [{ id: BigInt(7) }]))
      .toEqual(new Set([7n]));
  });

  test("tolerates a missing selection or page", () => {
    expect(filterSelectionToPage(undefined, [{ id: 1n }])).toEqual(new Set());
    expect(filterSelectionToPage(new Set([1n]), undefined)).toEqual(new Set());
  });

  test("does not mutate the selection it is given", () => {
    const selected = new Set([1n, 99n]);
    filterSelectionToPage(selected, [{ id: 1n }]);
    expect(selected).toEqual(new Set([1n, 99n]));
  });
});
