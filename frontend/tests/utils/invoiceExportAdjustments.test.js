import { describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule("../../src/utils/wagmiChainHelpers.js", () => ({
  getWagmiChainInfo: () => ({
    name: "Test",
    nativeCurrency: { symbol: "ETH", name: "Ether", decimals: 18 },
  }),
  getWagmiChainName: () => "Test",
}));

const { generateJSONContent } = await import("../../src/utils/generateInvoiceJSON.js");
const { generateCSVContent } = await import("../../src/utils/generateInvoiceCSV.js");

const makeInvoice = () => ({
  id: 7n,
  isPaid: false,
  isCancelled: false,
  amountDue: "400",
  chainId: 1,
  issueDate: "2026-11-18T00:00:00.000Z",
  dueDate: "2026-11-25T00:00:00.000Z",
  user: {},
  client: {},
  paymentToken: {
    address: "0x0000000000000000000000000000000000000001",
    symbol: "USDC",
    decimals: 6,
  },
  items: [
    {
      description: "Percentage discount",
      qty: "1",
      unitPrice: "200",
      discount: "10",
      discountType: "percentage",
      tax: "10",
      taxType: "amount",
      amount: "200",
    },
    {
      description: "Fixed discount",
      qty: "1",
      unitPrice: "200",
      discount: "10",
      discountType: "amount",
      tax: "0",
      taxType: "percentage",
      amount: "200",
    },
  ],
});

describe("invoice adjustment export formatting", () => {
  it("formats discounts and taxes in JSON exports", () => {
    const json = generateJSONContent(makeInvoice(), 0);

    expect(json.items[0].discount).toBe("10%");
    expect(json.items[0].tax).toBe("10 USDC");
    expect(json.items[1].discount).toBe("10 USDC");
    expect(json.items[1].tax).toBe("0%");
  });

  it("formats discounts and taxes in CSV exports", () => {
    const csv = generateCSVContent(makeInvoice(), 0);

    expect(csv).toContain("10%");
    expect(csv).toContain("10 USDC");
    expect(csv).toContain("0%");
  });
});
