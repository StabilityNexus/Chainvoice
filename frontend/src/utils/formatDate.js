/**
 * Returns the user's local UTC offset string, e.g. "UTC+5:30" or "UTC-8:00"
 */
function getUTCOffset() {
  const offset = -new Date().getTimezoneOffset(); // minutes, sign flipped
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
}

/**
 * Formats invoice issue/due dates (date only, no time).
 * Output: "Feb 20, 2026 (UTC+5:30)"
 *
 * Why: new Date(isoString).toLocaleDateString() silently shifts the date
 * across midnight for users in negative UTC offsets. Rendering the calendar
 * date only keeps financial document dates stable across viewers.
 *
 * @param {string|Date} dateStr
 * @returns {string}
+ */
export function formatInvoiceDate(dateStr) {
  if (!dateStr) return "N/A";
  // Strip time component to avoid UTC→local midnight shift
  // "2026-02-20T..." or "2026-02-20" → ["2026","02","20"]
  const parts = String(dateStr).split("T")[0].split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    const date = new Date(year, month - 1, day); // local date, no TZ conversion
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  // Fallback for non-ISO formats
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  /**
   * Formats a full timestamp (date + time) for table rows.
   * * Output: "Feb 20, 2026"
   *
   * @param {string|Date} dateStr
   * @returns {string}
   */
  export function formatDateTime(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    const formatted = date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formatted} (${getUTCOffset()})`;
  }
}
