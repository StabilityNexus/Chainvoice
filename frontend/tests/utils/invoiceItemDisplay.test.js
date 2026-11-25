import { describe, expect, it, jest } from "@jest/globals";

// invoiceExportHelpers imports wagmiChainHelpers, which pulls in the React app.
// These helpers never read chain data.
jest.unstable_mockModule("../../src/utils/wagmiChainHelpers.js", () => ({
  getWagmiChainInfo: () => ({}),
  getWagmiChainName: () => undefined,
}));

const { formatItemDiscount, formatItemTax, normalizeItem } = await import(
  "../../src/utils/invoiceExportHelpers.js"
);

describe("formatItemDiscount", () => {
  it("shows a percentage discount with %", () => {
    expect(formatItemDiscount({ discount: "10", discountType: "percentage" }, "USDC")).toBe("10%");
  });

  it("shows a fixed discount with the token symbol", () => {
    expect(formatItemDiscount({ discount: "10", discountType: "amount" }, "USDC")).toBe("10 USDC");
  });

  it("shows empty values as 0 in the item's type", () => {
    expect(formatItemDiscount({ discount: "", discountType: "percentage" }, "USDC")).toBe("0%");
    expect(formatItemDiscount({ discountType: "amount" }, "USDC")).toBe("0 USDC");
  });

  it("treats an item without a type as a fixed amount, like invoiceCalculations", () => {
    expect(formatItemDiscount({ discount: "5" }, "ETH")).toBe("5 ETH");
  });
});

describe("formatItemTax", () => {
  it("shows a percentage tax with %", () => {
    expect(formatItemTax({ tax: "18", taxType: "percentage" }, "USDC")).toBe("18%");
  });

  it("shows a fixed tax with the token symbol, also when empty", () => {
    expect(formatItemTax({ tax: "2", taxType: "amount" }, "USDC")).toBe("2 USDC");
    expect(formatItemTax({ tax: "", taxType: "amount" }, "USDC")).toBe("0 USDC");
  });

  it("treats an item without a type as a percentage and does not double the %", () => {
    expect(formatItemTax({ tax: "5" }, "ETH")).toBe("5%");
    expect(formatItemTax({ tax: "5%" }, "ETH")).toBe("5%");
    expect(formatItemTax({}, "ETH")).toBe("0%");
  });

  it("omits the symbol when it is not known", () => {
    expect(formatItemTax({ tax: "3", taxType: "amount" })).toBe("3");
  });
});

describe("normalizeItem", () => {
  it("keeps raw discount and tax values for JSON export, with the types carrying the unit", () => {
    const item = { description: "Design", qty: 1, unitPrice: "200", discount: "10", discountType: "percentage", tax: "4", taxType: "amount", amount: "184" };
    expect(normalizeItem(item)).toMatchObject({
      discount: "10",
      discountType: "percentage",
      tax: "4",
      taxType: "amount",
    });
  });

  it("keeps the old defaults when discount and tax are missing", () => {
    expect(normalizeItem({})).toMatchObject({
      discount: "0",
      discountType: "amount",
      tax: "0%",
      taxType: "percentage",
    });
  });

  it("does not give an empty fixed tax a percentage default", () => {
    expect(normalizeItem({ tax: "", taxType: "amount" })).toMatchObject({ tax: "0", taxType: "amount" });
  });
});
