import { beforeAll, describe, expect, it } from "@jest/globals";
import { spawnSync } from "node:child_process";
import process from "node:process";

// isPastDueDate has to land on local midnight, not on "24 hours after the due
// instant". The two only differ on a day where the clocks change, and the Jest
// setup (tests/setupTimezone.cjs) pins every test to Asia/Kolkata, which has no
// daylight saving. Jest cannot switch zone per test either, so these cases run
// in a child Node process that is in America/New_York. A reimplementation as
// `due.getTime() + 86400000` passes every other test in the suite and fails here.
const ZONE = "America/New_York";
const HELPERS_URL = new URL("../../src/utils/invoiceFilterSortHelpers.js", import.meta.url).href;

// 2026: clocks go forward on Sunday March 8 (02:00 -> 03:00, a 23-hour day) and
// back on Sunday November 1 (02:00 -> 01:00, a 25-hour day).
//
// "due" is what the date picker stores for the due day: local midnight at its
// start, as a UTC instant. "at" is the moment being asked about.
const CASES = [
  // Spring forward. Due Sun Mar 8: 00:00 EST = 05:00Z. The day ends at the local
  // midnight that follows, Mar 9 00:00 EDT = 04:00Z, only 23 hours later.
  // A fixed 24 hours would put the boundary an hour late, at 05:00Z.
  { name: "mid-morning on the 23-hour due day", due: "2026-03-08T05:00:00.000Z", at: "2026-03-08T12:00:00.000Z", expected: false },
  { name: "after the clocks jump, still the due day", due: "2026-03-08T05:00:00.000Z", at: "2026-03-09T03:59:59.999Z", expected: false },
  { name: "the local midnight that ends the 23-hour day", due: "2026-03-08T05:00:00.000Z", at: "2026-03-09T04:00:00.000Z", expected: true },
  { name: "30 minutes after it (a fixed 24 hours would say not yet)", due: "2026-03-08T05:00:00.000Z", at: "2026-03-09T04:30:00.000Z", expected: true },
  { name: "the last millisecond a fixed 24 hours would still call on time", due: "2026-03-08T05:00:00.000Z", at: "2026-03-09T04:59:59.999Z", expected: true },
  { name: "a due date stored mid-afternoon uses the same boundary (before)", due: "2026-03-08T19:00:00.000Z", at: "2026-03-09T03:59:59.999Z", expected: false },
  { name: "a due date stored mid-afternoon uses the same boundary (after)", due: "2026-03-08T19:00:00.000Z", at: "2026-03-09T04:00:00.000Z", expected: true },

  // Fall back. Due Sun Nov 1: 00:00 EDT = 04:00Z. The day ends at Nov 2 00:00 EST =
  // 05:00Z, 25 hours later. A fixed 24 hours would put the boundary an hour early,
  // at 04:00Z, which is only 23:00 on the due day.
  { name: "the hour a fixed 24 hours would call overdue is still the due day", due: "2026-11-01T04:00:00.000Z", at: "2026-11-02T04:00:00.000Z", expected: false },
  { name: "the last millisecond of the 25-hour due day", due: "2026-11-01T04:00:00.000Z", at: "2026-11-02T04:59:59.999Z", expected: false },
  { name: "the local midnight that ends the 25-hour day", due: "2026-11-01T04:00:00.000Z", at: "2026-11-02T05:00:00.000Z", expected: true },
];

// Runs in the child. Setting TZ at runtime is what changes the zone on every
// platform: Node on Windows ignores a TZ in the environment at start-up, but does
// honour an assignment to process.env.TZ. The report lets the parent prove the
// zone really took effect before it trusts any of the results.
const CHILD_SCRIPT = `
process.env.TZ = ${JSON.stringify(ZONE)};
const { isPastDueDate } = await import(process.env.HELPERS_URL);
const cases = JSON.parse(process.env.CASES);
const offset = (y, m, d) => new Date(y, m, d).getTimezoneOffset();
const hours = (y, m, d) => (new Date(y, m, d + 1) - new Date(y, m, d)) / 3600000;
process.stdout.write(JSON.stringify({
  zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  offsets: {
    mar7: offset(2026, 2, 7), mar8: offset(2026, 2, 8), mar9: offset(2026, 2, 9),
    oct31: offset(2026, 9, 31), nov1: offset(2026, 10, 1), nov2: offset(2026, 10, 2),
  },
  dayHours: { mar8: hours(2026, 2, 8), nov1: hours(2026, 10, 1) },
  results: cases.map((c) => isPastDueDate(c.due, Date.parse(c.at))),
}));
`;

describe(`isPastDueDate across daylight-saving changes (${ZONE}, in a child process)`, () => {
  let report;

  beforeAll(() => {
    const child = spawnSync(process.execPath, ["--input-type=module", "-e", CHILD_SCRIPT], {
      env: {
        ...process.env,
        TZ: ZONE,
        HELPERS_URL,
        CASES: JSON.stringify(CASES.map(({ due, at }) => ({ due, at }))),
      },
      encoding: "utf8",
      timeout: 30000,
    });

    if (child.error || child.status !== 0) {
      throw new Error(
        `The ${ZONE} child process failed (status ${child.status}): ${child.error ?? child.stderr}`
      );
    }
    report = JSON.parse(child.stdout);
  });

  describe("the child really is in New York time", () => {
    it("reports the zone", () => {
      expect(report.zone).toBe(ZONE);
    });

    it("is on standard time before the spring change and daylight time after it", () => {
      // getTimezoneOffset is minutes behind UTC: EST is 300, EDT is 240.
      expect([report.offsets.mar7, report.offsets.mar8, report.offsets.mar9]).toEqual([300, 300, 240]);
    });

    it("is on daylight time before the autumn change and standard time after it", () => {
      expect([report.offsets.oct31, report.offsets.nov1, report.offsets.nov2]).toEqual([240, 240, 300]);
    });

    it("has a 23-hour day in March and a 25-hour day in November", () => {
      expect(report.dayHours).toEqual({ mar8: 23, nov1: 25 });
    });
  });

  describe("the overdue boundary is the next local midnight, not 24 hours later", () => {
    it.each(CASES.map((c, index) => [c.name, index, c.expected]))(
      "%s",
      (_name, index, expected) => {
        expect(report.results[index]).toBe(expected);
      }
    );
  });
});
