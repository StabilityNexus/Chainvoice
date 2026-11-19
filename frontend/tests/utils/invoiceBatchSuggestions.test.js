import { findBatchSuggestions } from "../../src/utils/invoiceBatchSuggestions.js";
import { filterAndSortInvoices } from "../../src/utils/invoiceFilterSortHelpers.js";

const tokenA = {
  address: "0x00000000000000000000000000000000000000aa",
  symbol: "TKA",
  decimals: 18,
};
const tokenB = {
  address: "0x00000000000000000000000000000000000000bb",
  symbol: "TKB",
  decimals: 6,
};

const makeInvoice = (id, token, issueDate) => ({
  id,
  issueDate,
  isPaid: false,
  isCancelled: false,
  user: { address: "0xsender", fname: "Sender" },
  paymentToken: token,
  amountDueBaseUnits:
    token.decimals === 6 ? "2000000" : "1000000000000000000",
});

const invoices = [
  makeInvoice("1", tokenA, "2026-11-07T08:00:00.000Z"),
  makeInvoice("2", tokenA, "2026-11-07T09:00:00.000Z"),
  makeInvoice("3", tokenB, "2026-11-07T10:00:00.000Z"),
  makeInvoice("4", tokenB, "2026-11-07T11:00:00.000Z"),
];

describe("findBatchSuggestions", () => {
  it("only suggests invoices that remain after filtering", () => {
    expect(findBatchSuggestions(invoices)).toHaveLength(2);

    const tokenBOnly = filterAndSortInvoices(invoices, {
      token: tokenB.address,
    });

    const suggestions = findBatchSuggestions(tokenBOnly);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].token.address).toBe(tokenB.address);
    expect(
      suggestions[0].invoices.map((invoice) => invoice.id).sort()
    ).toEqual(["3", "4"]);
    expect(
      suggestions[0].invoices.every(
        (invoice) => invoice.paymentToken.address === tokenB.address
      )
    ).toBe(true);
  });

  it("does not suggest a batch when filtering leaves one payable invoice", () => {
    const partiallyPaid = invoices.map((invoice) =>
      invoice.id === "4" ? { ...invoice, isPaid: true } : invoice
    );

    const tokenBOnly = filterAndSortInvoices(partiallyPaid, {
      token: tokenB.address,
    });

    expect(findBatchSuggestions(tokenBOnly)).toEqual([]);
  });
});
