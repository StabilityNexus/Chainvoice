import { describe, expect, it, jest } from "@jest/globals";

// invoiceExportHelpers reads chain metadata through wagmiChainHelpers, which
// imports the whole React app. These tests only need a chain to look up.
jest.unstable_mockModule("../../src/utils/wagmiChainHelpers.js", () => ({
  getWagmiChainInfo: () => ({
    name: "Test",
    nativeCurrency: { symbol: "ETH", name: "Ether", decimals: 18 },
  }),
  getWagmiChainName: () => "Test",
}));

const { toISODate, toDisplayDate } = await import("../../src/utils/invoiceExportHelpers.js");
const { generateJSONContent } = await import("../../src/utils/generateInvoiceJSON.js");
const { generateCSVContent } = await import("../../src/utils/generateInvoiceCSV.js");

// The project's Jest setup (tests/setupTimezone.cjs) runs every test in
// Asia/Kolkata, UTC+5:30. In UTC these cases would pass even with the bug, so
// fail loudly if the zone is ever not the one the cases were written for.
const IST_OFFSET_MINUTES = -330;

// What the invoice form produces: the date picker returns local midnight, and
// the issue date is the moment the form was opened.
const pickedDueDate = new Date(2026, 9, 20); // "Oct 20" in the calendar
const formOpenedAt = new Date(2026, 9, 20, 1, 30); // 01:30 IST, which is still Oct 19 in UTC

// The payload is JSON-encoded to be stored and relayed, so exports read the ISO
// string, never the Date.
const stored = JSON.parse(JSON.stringify({ issueDate: formOpenedAt, dueDate: pickedDueDate }));

const makeInvoice = () => ({
  id: 7n,
  isPaid: false,
  isCancelled: false,
  amountDue: "1",
  chainId: 1,
  issueDate: stored.issueDate,
  dueDate: stored.dueDate,
  user: {},
  client: {},
  paymentToken: { address: "0x0000000000000000000000000000000000000000" },
  items: [],
});

describe("test environment", () => {
  it("runs in a time zone east of UTC", () => {
    expect(new Date(2026, 9, 20).getTimezoneOffset()).toBe(IST_OFFSET_MINUTES);
  });

  it("stores local midnight as the previous day in UTC, which is the case being fixed", () => {
    expect(stored.dueDate).toBe("2026-10-19T18:30:00.000Z");
    expect(stored.issueDate).toBe("2026-10-19T20:00:00.000Z");
  });
});

describe("toISODate", () => {
  it("returns the calendar day that was picked, not the UTC day", () => {
    expect(toISODate(stored.dueDate)).toBe("2026-10-20");
  });

  it("returns the local day for an issue date created just after local midnight", () => {
    expect(toISODate(stored.issueDate)).toBe("2026-10-20");
  });

  it("agrees with the date the UI displays", () => {
    expect(toDisplayDate(stored.dueDate)).toBe("Oct 20, 2026");
    expect(toISODate(stored.dueDate)).toBe("2026-10-20");
  });

  it("accepts a Date as well as an ISO string", () => {
    expect(toISODate(pickedDueDate)).toBe("2026-10-20");
  });

  it("keeps the whole local day on one date", () => {
    expect(toISODate(new Date(2026, 9, 20, 0, 0, 0, 0))).toBe("2026-10-20");
    expect(toISODate(new Date(2026, 9, 20, 23, 59, 59, 999))).toBe("2026-10-20");
    expect(toISODate(new Date(2026, 9, 21, 0, 0, 0, 0))).toBe("2026-10-21");
  });

  it("rolls over month and year boundaries on the local day", () => {
    expect(toISODate(new Date(2026, 11, 31, 0, 0))).toBe("2026-12-31");
    expect(toISODate(new Date(2027, 0, 1, 0, 0))).toBe("2027-01-01");
  });

  it("returns null for a missing or invalid value", () => {
    expect(toISODate(null)).toBeNull();
    expect(toISODate(undefined)).toBeNull();
    expect(toISODate("")).toBeNull();
    expect(toISODate("not a date")).toBeNull();
  });
});

describe("exports of a due date picked as Oct 20", () => {
  it("writes 2026-10-20 to the JSON export", () => {
    const json = generateJSONContent(makeInvoice(), 0);

    expect(json.dueDate).toBe("2026-10-20");
    expect(json.issueDate).toBe("2026-10-20");
  });

  it("writes 2026-10-20 to the CSV export", () => {
    const [header, row] = generateCSVContent(makeInvoice(), 0).split("\n");
    const columns = header.split(",");
    const values = row.split(",");

    expect(values[columns.indexOf("DueDate")]).toBe("2026-10-20");
    expect(values[columns.indexOf("IssueDate")]).toBe("2026-10-20");
  });

  it("leaves the date empty when an invoice has none", () => {
    const invoice = { ...makeInvoice(), issueDate: null, dueDate: null };

    expect(generateJSONContent(invoice, 0).dueDate).toBeNull();
    const [header, row] = generateCSVContent(invoice, 0).split("\n");
    expect(row.split(",")[header.split(",").indexOf("DueDate")]).toBe("");
  });
});
