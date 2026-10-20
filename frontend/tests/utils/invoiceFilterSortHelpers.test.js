import { afterEach, jest } from "@jest/globals";
import {
  filterAndSortInvoices,
  isPastDueDate,
} from "../../src/utils/invoiceFilterSortHelpers.js";

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

// A due date names a calendar day. The date picker stores it as local midnight at
// the start of that day, so comparing the stored instant with the current time
// flagged an invoice overdue the moment its due day began. The setup runs these
// in Asia/Kolkata (UTC+5:30); every moment below is built in local time.
describe("overdue is decided by local calendar days", () => {
  // The user picked "Oct 20" in the calendar.
  const dueDate = new Date(2026, 9, 20).toISOString(); // 2026-10-19T18:30:00.000Z in IST
  const at = (...localParts) => new Date(...localParts).getTime();

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("isPastDueDate", () => {
    it("is false at the start of the due day", () => {
      expect(isPastDueDate(dueDate, at(2026, 9, 20, 0, 0, 0, 0))).toBe(false);
    });

    it("is false at 09:00 on the due day, which used to flag it overdue", () => {
      expect(isPastDueDate(dueDate, at(2026, 9, 20, 9, 0))).toBe(false);
    });

    it("is false at the very end of the due day", () => {
      expect(isPastDueDate(dueDate, at(2026, 9, 20, 23, 59, 59, 999))).toBe(false);
    });

    it("flips exactly at the local midnight that follows the due day", () => {
      expect(isPastDueDate(dueDate, at(2026, 9, 21, 0, 0, 0, 0) - 1)).toBe(false);
      expect(isPastDueDate(dueDate, at(2026, 9, 21, 0, 0, 0, 0))).toBe(true);
    });

    it("is false just after the instant the old comparison used", () => {
      // 2026-10-19T18:30Z is local midnight in IST: the stored instant the old check compared.
      expect(isPastDueDate(dueDate, Date.parse("2026-10-19T18:30:00.001Z"))).toBe(false);
      expect(isPastDueDate(dueDate, Date.parse("2026-10-20T00:00:00.000Z"))).toBe(false);
    });

    it("is true on later days", () => {
      expect(isPastDueDate(dueDate, at(2026, 9, 25, 12, 0))).toBe(true);
      expect(isPastDueDate(dueDate, at(2027, 0, 1, 0, 0))).toBe(true);
    });

    it("uses the due day of a due date that carries a time of day", () => {
      const lateDue = new Date(2026, 9, 20, 22, 15).toISOString();
      expect(isPastDueDate(lateDue, at(2026, 9, 20, 23, 0))).toBe(false);
      expect(isPastDueDate(lateDue, at(2026, 9, 21, 0, 0))).toBe(true);
    });

    it("accepts a Date as well as an ISO string", () => {
      expect(isPastDueDate(new Date(2026, 9, 20), at(2026, 9, 20, 9, 0))).toBe(false);
      expect(isPastDueDate(new Date(2026, 9, 20), at(2026, 9, 21, 0, 0))).toBe(true);
    });

    it("is false for a missing or invalid due date", () => {
      expect(isPastDueDate(null, at(2030, 0, 1))).toBe(false);
      expect(isPastDueDate(undefined, at(2030, 0, 1))).toBe(false);
      expect(isPastDueDate("", at(2030, 0, 1))).toBe(false);
      expect(isPastDueDate("not a date", at(2030, 0, 1))).toBe(false);
    });
  });

  describe("through the status filter and sort", () => {
    const invoices = [
      { id: "unpaid", dueDate, isPaid: false, isCancelled: false, amountDue: "1" },
      { id: "paid", dueDate, isPaid: true, isCancelled: false, amountDue: "1" },
      { id: "cancelled", dueDate, isPaid: false, isCancelled: true, amountDue: "1" },
    ];
    const overdueIds = () =>
      filterAndSortInvoices(invoices, { status: "overdue" }).map((i) => i.id);
    // Status rank: pending 1, overdue 2, paid 3, cancelled 4; equal ranks fall back to the id.
    // The peer is pending with a far-off due date. Its id sorts after "unpaid", so with a
    // descending sort it comes first while both are pending (tie, larger id first) and
    // second once "unpaid" is overdue (rank 2 beats rank 1). The order only changes if the
    // rank does.
    const pendingPeer = {
      id: "zz-peer",
      dueDate: new Date(2030, 0, 1).toISOString(),
      isPaid: false,
      isCancelled: false,
      amountDue: "1",
    };
    const rankedIds = () =>
      filterAndSortInvoices([invoices[0], pendingPeer], { sortBy: "status", sortDir: "desc" }).map(
        (i) => i.id,
      );

    it("does not list an invoice as overdue on its due day", () => {
      jest.useFakeTimers({ now: at(2026, 9, 20, 9, 0) });
      expect(overdueIds()).toEqual([]);
    });

    it("does not list it at the end of the due day", () => {
      jest.useFakeTimers({ now: at(2026, 9, 20, 23, 59, 59, 999) });
      expect(overdueIds()).toEqual([]);
    });

    it("lists only the unpaid, uncancelled invoice once the due day is over", () => {
      jest.useFakeTimers({ now: at(2026, 9, 21, 0, 0, 0, 0) });
      expect(overdueIds()).toEqual(["unpaid"]);
    });

    it("ranks the invoice as pending until the due day ends, then as overdue", () => {
      jest.useFakeTimers({ now: at(2026, 9, 20, 9, 0) });
      expect(rankedIds()).toEqual(["zz-peer", "unpaid"]);

      jest.useFakeTimers({ now: at(2026, 9, 20, 23, 59, 59, 999) });
      expect(rankedIds()).toEqual(["zz-peer", "unpaid"]);

      jest.useFakeTimers({ now: at(2026, 9, 21, 0, 0, 0, 0) });
      expect(rankedIds()).toEqual(["unpaid", "zz-peer"]);
    });
  });
});
