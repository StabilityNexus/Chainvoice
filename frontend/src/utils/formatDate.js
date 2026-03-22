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
 * across midnight for users in negative UTC offsets. Showing the offset
 * makes the displayed date unambiguous for financial documents.
 *
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatInvoiceDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `${formatted} (${getUTCOffset()})`;
}

/**
 * Formats a full timestamp (date + time) for table rows.
 * Output: "Feb 20, 2026, 3:45 PM (UTC+5:30)"
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
