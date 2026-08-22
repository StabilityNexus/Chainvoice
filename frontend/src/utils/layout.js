/**
 * Shared spacing for the dashboard shell.
 *
 * The dashboard already constrains its content with a fixed sidebar, so pages
 * add no max-width of their own — an inner `max-w-*` on top of that left a
 * large dead gutter on wide screens. Keeping the rhythm here means the whole
 * dashboard can be tuned in one place instead of per-page magic classes.
 */

/** Outer wrapper for a page rendered inside the dashboard outlet. */
export const PAGE_CONTAINER = "w-full px-0 sm:px-1";

/** Vertical gap between the major sections of a page. */
export const SECTION_GAP = "mb-4 sm:mb-5";

/** Standard white content card. */
export const CARD =
  "bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 overflow-hidden";

/** Page title block: heading plus optional supporting line. */
export const PAGE_HEADER = "mb-3 sm:mb-4";
