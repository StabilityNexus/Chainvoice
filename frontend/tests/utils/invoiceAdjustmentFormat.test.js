import {
  DEFAULT_DISCOUNT_TYPE,
  DEFAULT_TAX_TYPE,
  formatAdjustment,
  formatInvoiceDiscount,
  formatInvoiceTax,
} from "../../src/utils/invoiceAdjustmentFormat.js";

describe("invoiceAdjustmentFormat.formatAdjustment", () => {
  test("formats a percentage with a trailing percent sign", () => {
    expect(formatAdjustment("10", "percentage", "USDC", DEFAULT_DISCOUNT_TYPE)).toBe("10%");
  });

  test("formats a fixed amount with the token symbol", () => {
    expect(formatAdjustment("10", "amount", "USDC", DEFAULT_TAX_TYPE)).toBe("10 USDC");
  });

  test("formats empty values using the selected type", () => {
    expect(formatAdjustment("", "percentage", "USDC", DEFAULT_TAX_TYPE)).toBe("0%");
    expect(formatAdjustment(null, "amount", "USDC", DEFAULT_DISCOUNT_TYPE)).toBe("0 USDC");
  });

  test("does not duplicate an existing suffix", () => {
    expect(formatAdjustment("5%", "percentage", "USDC", DEFAULT_TAX_TYPE)).toBe("5%");
    expect(formatAdjustment("10 USDC", "amount", "USDC", DEFAULT_DISCOUNT_TYPE)).toBe(
      "10 USDC",
    );
  });
});

describe("invoiceAdjustmentFormat invoice helpers", () => {
  test("uses the item type when present", () => {
    expect(
      formatInvoiceDiscount(
        { discount: "10", discountType: "percentage" },
        "USDC",
      ),
    ).toBe("10%");
    expect(formatInvoiceTax({ tax: "10", taxType: "amount" }, "USDC")).toBe("10 USDC");
  });

  test("uses calculation defaults for older invoices without type fields", () => {
    expect(formatInvoiceDiscount({ discount: "10" }, "USDC")).toBe("10 USDC");
    expect(formatInvoiceTax({ tax: "10" }, "USDC")).toBe("10%");
  });

  test("handles missing items and symbols", () => {
    expect(formatInvoiceDiscount(undefined, "USDC")).toBe("0 USDC");
    expect(formatInvoiceTax({}, undefined)).toBe("0%");
  });
});
