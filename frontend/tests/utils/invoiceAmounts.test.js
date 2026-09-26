import { sumInvoiceAmounts } from "../../src/utils/invoiceAmounts.js";

const invoices = (...amounts) => amounts.map((amountDue) => ({ amountDue }));

describe("invoiceAmounts.sumInvoiceAmounts", () => {
  test("returns 0n for an empty list", () => {
    expect(sumInvoiceAmounts([], 18)).toBe(0n);
  });

  test("sums 6-decimal amounts that a float total would round", () => {
    // 100.1 + 200.2 is 300.29999999999995 as a float, which parseUnits
    // rejects for a 6-decimal token.
    expect(sumInvoiceAmounts(invoices("100.1", "200.2"), 6)).toBe(300300000n);
    expect(sumInvoiceAmounts(invoices("0.1", "0.2"), 6)).toBe(300000n);
  });

  test("sums small amounts that a float total would turn into exponents", () => {
    // 0.0000001 + 0.0000001 is 2e-7 as a float, which parseUnits cannot read.
    expect(sumInvoiceAmounts(invoices("0.0000001", "0.0000001"), 18)).toBe(
      200000000000n
    );
  });

  test("keeps 18-decimal totals exact", () => {
    expect(sumInvoiceAmounts(invoices("0.1", "0.2"), 18)).toBe(
      300000000000000000n
    );
  });

  test("supports 0-decimal tokens", () => {
    expect(sumInvoiceAmounts(invoices("2", "3"), 0)).toBe(5n);
  });

  test("accepts numeric amounts as well as strings", () => {
    expect(sumInvoiceAmounts(invoices(1.5, "2.5"), 6)).toBe(4000000n);
  });

  test("expands numeric amounts that stringify to exponential notation", () => {
    // String(0.0000001) is "1e-7", which parseUnits cannot read.
    expect(sumInvoiceAmounts(invoices(0.0000001), 18)).toBe(100000000000n);
    expect(sumInvoiceAmounts(invoices(1e-9), 18)).toBe(1000000000n);
    expect(sumInvoiceAmounts(invoices(0.0000001, "0.0000001"), 18)).toBe(
      200000000000n
    );
  });

  test("rejects non-finite numeric amounts", () => {
    expect(() => sumInvoiceAmounts(invoices(Number.NaN), 18)).toThrow(
      /Invalid invoice amount/
    );
    expect(() => sumInvoiceAmounts(invoices(Infinity), 18)).toThrow(
      /Invalid invoice amount/
    );
  });

  test("throws when an amount has more decimals than the token allows", () => {
    expect(() => sumInvoiceAmounts(invoices("1.1234567"), 6)).toThrow();
  });
});
