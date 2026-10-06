// Invoice issue and due dates are calendar days. New invoices store them as
// "YYYY-MM-DD" so every viewer sees the day the issuer picked, whatever their
// timezone. Invoices created before that store a full ISO timestamp, which
// carries no record of the issuer's zone; those are read as the viewer's
// local day, as they always were.

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (n) => String(n).padStart(2, "0");

/**
 * Parse a stored invoice date.
 *
 * @param {string|number|Date|null|undefined} value
 * @returns {Date|null} local midnight for a calendar date, the stored instant
 *   for a legacy timestamp, or null when the value is missing or invalid
 */
export function parseInvoiceDate(value) {
  if (!value) return null;

  const match = typeof value === "string" ? CALENDAR_DATE.exec(value) : null;
  if (match) {
    const [, y, m, d] = match.map(Number);
    const date = new Date(y, m - 1, d);
    // Rejects overflowing input such as "2026-02-30" instead of rolling over.
    return date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
      ? date
      : null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * @param {string|number|Date|null|undefined} value
 * @returns {string|null} the calendar day as "YYYY-MM-DD", or null
 */
export function toCalendarDate(value) {
  const date = parseInvoiceDate(value);
  if (!date) return null;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * @param {string|number|Date|null|undefined} value
 * @param {string} [fallback=""] returned when the value is missing or invalid
 * @returns {string} e.g. "Feb 20, 2026"
 */
export function formatCalendarDate(value, fallback = "") {
  const date = parseInvoiceDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * An invoice is overdue once its whole due day has passed.
 *
 * @param {string|number|Date|null|undefined} dueDate
 * @param {Date} [now=new Date()]
 * @returns {boolean}
 */
export function isPastDue(dueDate, now = new Date()) {
  const date = parseInvoiceDate(dueDate);
  if (!date) return false;
  const nextDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );
  return now.getTime() >= nextDay.getTime();
}
