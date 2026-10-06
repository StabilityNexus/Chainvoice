import {
  formatCalendarDate,
  isPastDue,
  parseInvoiceDate,
  toCalendarDate,
} from "../../src/utils/invoiceDates.js";

// Tests run in Asia/Kolkata (UTC+5:30), set by tests/setupTimezone.cjs.

describe("invoiceDates.parseInvoiceDate", () => {
  test("reads a calendar date as local midnight, not UTC midnight", () => {
    const date = parseInvoiceDate("2026-02-20");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(20);
    expect(date.getHours()).toBe(0);
    expect(date.getMinutes()).toBe(0);
  });

  test("keeps the stored instant of a legacy timestamp", () => {
    const iso = "2026-02-19T18:30:00.000Z";
    expect(parseInvoiceDate(iso).toISOString()).toBe(iso);
  });

  test("accepts Date objects and epoch milliseconds", () => {
    const date = new Date(2026, 1, 20, 15, 45);
    expect(parseInvoiceDate(date).getTime()).toBe(date.getTime());
    expect(parseInvoiceDate(date.getTime()).getTime()).toBe(date.getTime());
  });

  test("returns a copy rather than the caller's Date", () => {
    const date = new Date(2026, 1, 20);
    expect(parseInvoiceDate(date)).not.toBe(date);
  });

  test.each([undefined, null, "", "not a date", "2026-02-30", "2026-13-01"])(
    "returns null for %p",
    (value) => {
      expect(parseInvoiceDate(value)).toBeNull();
    }
  );
});

describe("invoiceDates.toCalendarDate", () => {
  test("returns a calendar date unchanged", () => {
    expect(toCalendarDate("2026-02-20")).toBe("2026-02-20");
  });

  test("uses the local day of a Date, as the invoice form picks it", () => {
    expect(toCalendarDate(new Date(2026, 1, 20))).toBe("2026-02-20");
    expect(toCalendarDate(new Date(2026, 1, 20, 23, 59))).toBe("2026-02-20");
  });

  test("reads a legacy timestamp near UTC midnight as the viewer's local day", () => {
    // 18:30 UTC on Feb 19 is 00:00 on Feb 20 in Kolkata.
    expect(toCalendarDate("2026-02-19T18:30:00.000Z")).toBe("2026-02-20");
    expect(toCalendarDate("2026-02-19T18:29:59.999Z")).toBe("2026-02-19");
  });

  test("returns null for missing or invalid input", () => {
    expect(toCalendarDate(null)).toBeNull();
    expect(toCalendarDate("garbage")).toBeNull();
  });
});

describe("invoiceDates.formatCalendarDate", () => {
  test("formats a calendar date as that exact day", () => {
    expect(formatCalendarDate("2026-02-20")).toBe("Feb 20, 2026");
    expect(formatCalendarDate("2026-01-01")).toBe("Jan 1, 2026");
  });

  test("formats a legacy timestamp", () => {
    expect(formatCalendarDate("2026-02-20T10:00:00.000Z")).toBe("Feb 20, 2026");
  });

  test("returns the fallback for missing or invalid input", () => {
    expect(formatCalendarDate(undefined)).toBe("");
    expect(formatCalendarDate("garbage", "—")).toBe("—");
  });
});

describe("invoiceDates.isPastDue", () => {
  const now = new Date(2026, 1, 20, 12, 0);

  test("is not past due on the due day itself", () => {
    expect(isPastDue("2026-02-20", now)).toBe(false);
    expect(isPastDue("2026-02-20", new Date(2026, 1, 20, 23, 59, 59))).toBe(
      false
    );
  });

  test("is past due once the due day has ended", () => {
    expect(isPastDue("2026-02-19", now)).toBe(true);
    expect(isPastDue("2026-02-20", new Date(2026, 1, 21))).toBe(true);
  });

  test("is not past due for a future day", () => {
    expect(isPastDue("2026-02-21", now)).toBe(false);
  });

  test("handles legacy timestamps by their local day", () => {
    expect(isPastDue("2026-02-19T10:00:00.000Z", now)).toBe(true);
    expect(isPastDue("2026-02-20T01:00:00.000Z", now)).toBe(false);
  });

  test("is never past due without a valid due date", () => {
    expect(isPastDue(null, now)).toBe(false);
    expect(isPastDue("garbage", now)).toBe(false);
  });
});
