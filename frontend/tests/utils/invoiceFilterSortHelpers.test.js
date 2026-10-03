import { filterAndSortInvoices } from "../../src/utils/invoiceFilterSortHelpers.js";

describe("filterAndSortInvoices helper", () => {
  const pastDate = new Date(Date.now() - 86400000 * 5).toISOString(); // 5 days ago
  const futureDate = new Date(Date.now() + 86400000 * 5).toISOString(); // 5 days in future

  const sampleInvoices = [
    {
      id: "1",
      amountDue: "100.50",
      issueDate: "2026-01-01",
      dueDate: futureDate,
      isPaid: false,
      isCancelled: false,
      paymentToken: { address: "0x111", symbol: "USDC" },
    },
    {
      id: "2",
      amountDue: "500.00",
      issueDate: "2026-02-01",
      dueDate: pastDate,
      isPaid: false,
      isCancelled: false,
      paymentToken: { address: "0x222", symbol: "ETH" },
    },
    {
      id: "3",
      amountDue: "50.00",
      issueDate: "2026-03-01",
      dueDate: pastDate,
      isPaid: true,
      isCancelled: false,
      paymentToken: { address: "0x111", symbol: "USDC" },
    },
    {
      id: "4",
      amountDue: "1000.00",
      issueDate: "2026-04-01",
      dueDate: pastDate,
      isPaid: false,
      isCancelled: true,
      paymentToken: { address: "0x333", symbol: "DAI" },
    },
  ];

  it("filters overdue invoices correctly", () => {
    const res = filterAndSortInvoices(sampleInvoices, { status: "overdue" });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("2");
  });

  it("filters paid, pending, and cancelled statuses", () => {
    const paid = filterAndSortInvoices(sampleInvoices, { status: "paid" });
    expect(paid).toHaveLength(1);
    expect(paid[0].id).toBe("3");

    const pending = filterAndSortInvoices(sampleInvoices, { status: "pending" });
    expect(pending).toHaveLength(2);

    const cancelled = filterAndSortInvoices(sampleInvoices, { status: "cancelled" });
    expect(cancelled).toHaveLength(1);
    expect(cancelled[0].id).toBe("4");
  });

  it("sorts by date ascending and descending", () => {
    const asc = filterAndSortInvoices(sampleInvoices, { sortBy: "date", sortDir: "asc" });
    expect(asc.map((i) => i.id)).toEqual(["1", "2", "3", "4"]);

    const desc = filterAndSortInvoices(sampleInvoices, { sortBy: "date", sortDir: "desc" });
    expect(desc.map((i) => i.id)).toEqual(["4", "3", "2", "1"]);
  });

  it("sorts by amountDue ascending and descending with precision-safe BigInt logic", () => {
    const largeAmountInvoices = [
      { id: "1", amountDue: "9007199254740993" },
      { id: "2", amountDue: "9007199254740992" },
      { id: "3", amountDue: "100.5" },
    ];
    const asc = filterAndSortInvoices(largeAmountInvoices, { sortBy: "amountDue", sortDir: "asc" });
    expect(asc.map((i) => i.id)).toEqual(["3", "2", "1"]);

    const desc = filterAndSortInvoices(largeAmountInvoices, { sortBy: "amountDue", sortDir: "desc" });
    expect(desc.map((i) => i.id)).toEqual(["1", "2", "3"]);
  });

  it("sorts by status ascending and descending", () => {
    const asc = filterAndSortInvoices(sampleInvoices, { sortBy: "status", sortDir: "asc" });
    // Ranks: pending=1 (id 1), overdue=2 (id 2), paid=3 (id 3), cancelled=4 (id 4)
    expect(asc.map((i) => i.id)).toEqual(["1", "2", "3", "4"]);

    const desc = filterAndSortInvoices(sampleInvoices, { sortBy: "status", sortDir: "desc" });
    expect(desc.map((i) => i.id)).toEqual(["4", "3", "2", "1"]);
  });

  it("filters by minAmount and maxAmount range using BigInt scaling", () => {
    const rangeRes = filterAndSortInvoices(sampleInvoices, { minAmount: "100", maxAmount: "600" });
    expect(rangeRes.map((i) => i.id)).toEqual(["2", "1"]); // 500.00 and 100.50 sorted by date desc
  });

  it("filters token by normalized contract address", () => {
    const res = filterAndSortInvoices(sampleInvoices, { token: "0x111" });
    expect(res.map((i) => i.id)).toEqual(["3", "1"]);
    const resUpper = filterAndSortInvoices(sampleInvoices, { token: "0X111" });
    expect(resUpper.map((i) => i.id)).toEqual(["3", "1"]);
  });

  it("filters token by legacy symbol for backward compatibility", () => {
    const resLower = filterAndSortInvoices(sampleInvoices, { token: "usdc" });
    expect(resLower.map((i) => i.id)).toEqual(["3", "1"]);
    const resUpper = filterAndSortInvoices(sampleInvoices, { token: "USDC" });
    expect(resUpper.map((i) => i.id)).toEqual(["3", "1"]);
  });

  it("does not incorrectly group two different tokens that share the same symbol when filtering by contract address", () => {
    const sameSymbolInvoices = [
      { id: "101", paymentToken: { address: "0x111", symbol: "USDC" } },
      { id: "102", paymentToken: { address: "0x999", symbol: "USDC" } },
    ];

    const res111 = filterAndSortInvoices(sameSymbolInvoices, { token: "0x111" });
    expect(res111.map((i) => i.id)).toEqual(["101"]);

    const res999 = filterAndSortInvoices(sameSymbolInvoices, { token: "0x999" });
    expect(res999.map((i) => i.id)).toEqual(["102"]);

    const resSymbol = filterAndSortInvoices(sameSymbolInvoices, { token: "USDC" });
    expect(resSymbol.map((i) => i.id).sort()).toEqual(["101", "102"]);
  });

  it("ensures fromDate and toDate filters are inclusive of boundary dates", () => {
    const dateInvoices = [
      { id: "1", issueDate: "2026-02-01" },
      { id: "2", issueDate: "2026-02-15" },
      { id: "3", issueDate: "2026-02-28" },
    ];

    const resFrom = filterAndSortInvoices(dateInvoices, { fromDate: "2026-02-01" });
    expect(resFrom.map((i) => i.id)).toEqual(["3", "2", "1"]);

    const resFromStrict = filterAndSortInvoices(dateInvoices, { fromDate: "2026-02-02" });
    expect(resFromStrict.map((i) => i.id)).toEqual(["3", "2"]);

    const resTo = filterAndSortInvoices(dateInvoices, { toDate: "2026-02-28" });
    expect(resTo.map((i) => i.id)).toEqual(["3", "2", "1"]);

    const resToStrict = filterAndSortInvoices(dateInvoices, { toDate: "2026-02-15" });
    expect(resToStrict.map((i) => i.id)).toEqual(["2", "1"]);
  });

  it("sorts by client correctly for both sent and received invoice branches", () => {
    const clientInvoices = [
      {
        id: "1",
        client: { fname: "Bob", lname: "Smith", address: "0xbbb" },
        user: { fname: "Zoe", lname: "Adams", address: "0xzzz" },
      },
      {
        id: "2",
        client: { fname: "Alice", lname: "Jones", address: "0xaaa" },
        user: { fname: "Charlie", lname: "Brown", address: "0xccc" },
      },
    ];

    const sentAsc = filterAndSortInvoices(clientInvoices, {
      sortBy: "client",
      sortDir: "asc",
      isSent: true,
    });
    expect(sentAsc.map((i) => i.id)).toEqual(["2", "1"]);

    const receivedAsc = filterAndSortInvoices(clientInvoices, {
      sortBy: "client",
      sortDir: "asc",
      isSent: false,
    });
    expect(receivedAsc.map((i) => i.id)).toEqual(["2", "1"]);
  });
});
