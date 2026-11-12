
import {
  classifyInvoiceStatus,
  summarizeInvoices,
} from "../../src/utils/invoiceFinancialSummary";

function makeInvoice({
  id = "1",
  chainId = 1,
  tokenAddress = "0xABC",
  symbol = "USDC",
  decimals = 6,
  amount = "1000000",
  isPaid = false,
  isCancelled = false,
} = {}) {
  return {
    id,
    chainId,
    amountDueBaseUnits: amount,
    paymentToken: {
      address: tokenAddress,
      symbol,
      decimals,
    },
    isPaid,
    isCancelled,
  };
}

describe("classifyInvoiceStatus", () => {
  test("classifies an unpaid invoice as outstanding", () => {
    expect(classifyInvoiceStatus(makeInvoice())).toBe("outstanding");
  });

  test("classifies a paid invoice as paid", () => {
    expect(
      classifyInvoiceStatus(makeInvoice({ isPaid: true }))
    ).toBe("paid");
  });

  test("classifies a cancelled invoice as cancelled", () => {
    expect(
      classifyInvoiceStatus(makeInvoice({ isCancelled: true }))
    ).toBe("cancelled");
  });

  test("cancellation takes precedence when both flags are true", () => {
    expect(
      classifyInvoiceStatus(
        makeInvoice({ isPaid: true, isCancelled: true })
      )
    ).toBe("cancelled");
  });
});

describe("summarizeInvoices", () => {
  test("returns an empty array when there are no invoices", () => {
    expect(summarizeInvoices([])).toEqual([]);
  });

  test("calculates invoice counts and amounts by status", () => {
    const invoices = [
      makeInvoice({
        id: "1",
        amount: "1000000",
        isPaid: true,
      }),
      makeInvoice({
        id: "2",
        amount: "2000000",
      }),
      makeInvoice({
        id: "3",
        amount: "3000000",
        isCancelled: true,
      }),
      makeInvoice({
        id: "4",
        amount: "4000000",
        isPaid: true,
        isCancelled: true,
      }),
    ];

    const [summary] = summarizeInvoices(invoices);

    expect(summary.total).toBe(4);
    expect(summary.paid).toBe(1);
    expect(summary.outstanding).toBe(1);
    expect(summary.cancelled).toBe(2);

    expect(summary.totalBaseUnits).toBe(10000000n);
    expect(summary.paidBaseUnits).toBe(1000000n);
    expect(summary.outstandingBaseUnits).toBe(2000000n);
    expect(summary.cancelledBaseUnits).toBe(7000000n);
  });

  test("groups token addresses case-insensitively", () => {
    const invoices = [
      makeInvoice({
        id: "1",
        tokenAddress: "0xABC",
        amount: "100",
      }),
      makeInvoice({
        id: "2",
        tokenAddress: "0xabc",
        amount: "200",
      }),
    ];

    const result = summarizeInvoices(invoices);

    expect(result).toHaveLength(1);
    expect(result[0].total).toBe(2);
    expect(result[0].totalBaseUnits).toBe(300n);
  });

  test("keeps different tokens on the same chain separate", () => {
    const invoices = [
      makeInvoice({
        id: "1",
        tokenAddress: "0xAAA",
        symbol: "TOKEN_A",
        amount: "100",
      }),
      makeInvoice({
        id: "2",
        tokenAddress: "0xBBB",
        symbol: "TOKEN_B",
        amount: "200",
      }),
    ];

    const result = summarizeInvoices(invoices);

    expect(result).toHaveLength(2);
    expect(result.map((group) => group.totalBaseUnits)).toEqual([
      100n,
      200n,
    ]);
  });

  test("keeps the same token address on different chains separate", () => {
    const invoices = [
      makeInvoice({
        id: "1",
        chainId: 1,
        tokenAddress: "0xABC",
        amount: "100",
      }),
      makeInvoice({
        id: "2",
        chainId: 137,
        tokenAddress: "0xABC",
        amount: "200",
      }),
    ];

    const result = summarizeInvoices(invoices);

    expect(result).toHaveLength(2);
    expect(result.map((group) => group.chainId)).toEqual(["1", "137"]);
  });

  test("supports different decimal counts for separate token groups", () => {
    const invoices = [
      makeInvoice({
        id: "1",
        tokenAddress: "0xAAA",
        symbol: "USDC",
        decimals: 6,
        amount: "1500000",
      }),
      makeInvoice({
        id: "2",
        tokenAddress: "0xBBB",
        symbol: "TOKEN",
        decimals: 18,
        amount: "2500000000000000000",
      }),
    ];

    const result = summarizeInvoices(invoices);

    expect(result).toHaveLength(2);
    expect(result.find((group) => group.tokenAddress === "0xaaa").decimals)
      .toBe(6);
    expect(result.find((group) => group.tokenAddress === "0xbbb").decimals)
      .toBe(18);
  });

  test("preserves precision for very large amounts", () => {
    const amount = "900719925474099312345678901234567890";

    const [summary] = summarizeInvoices([
      makeInvoice({ amount }),
    ]);

    expect(summary.totalBaseUnits).toBe(BigInt(amount));
  });

  test("rejects missing chain or token metadata", () => {
    expect(() =>
      summarizeInvoices([
        makeInvoice({
          chainId: "",
        }),
      ])
    ).toThrow("Missing chain or token metadata.");

    expect(() =>
      summarizeInvoices([
        {
          ...makeInvoice(),
          paymentToken: {
            decimals: 6,
          },
        },
      ])
    ).toThrow("Missing chain or token metadata.");
  });

  test("rejects invalid token decimals", () => {
    for (const decimals of [-1, 256, 1.5, null]) {
      expect(() =>
        summarizeInvoices([
          makeInvoice({ decimals }),
        ])
      ).toThrow(/Invalid token decimals/);
    }
  });

  test("rejects invalid on-chain amounts", () => {
    for (const amount of ["-1", "1.5", "abc", null, 100]) {
      expect(() =>
        summarizeInvoices([
          makeInvoice({ amount }),
        ])
      ).toThrow(/Invalid on-chain amount/);
    }
  });

  test("rejects inconsistent decimals for the same token and chain", () => {
    expect(() =>
      summarizeInvoices([
        makeInvoice({
          id: "1",
          tokenAddress: "0xABC",
          decimals: 6,
        }),
        makeInvoice({
          id: "2",
          tokenAddress: "0xabc",
          decimals: 18,
        }),
      ])
    ).toThrow(/Inconsistent decimals/);
  });
});
