/**
 * Shared spacing for the app shell.
 *
 * One width cap for the navbar and every page, so the logo, the nav links and
 * the page content all line up on the same left and right edges. Pages add no
 * max-width of their own — an inner `max-w-*` on top of the dashboard sidebar
 * left a large dead gutter on one side only.
 */

/**
 * Gutter shared by the navbar and all page shells.
 *
 * No max-width: a cap wide enough to matter still left a visible band of dead
 * space down both sides. What made the layout read as stretched was blocks not
 * sharing a right edge, not the page being wide — so the blocks align instead
 * and the shell simply uses the screen.
 */
export const SHELL = "mx-auto w-full px-3 sm:px-4 lg:px-6";

/** Outer wrapper for a page rendered inside the dashboard outlet. */
export const PAGE_CONTAINER = "w-full px-0 sm:px-1";

/** Vertical gap between the major sections of a page. */
export const SECTION_GAP = "mb-4 sm:mb-5";

/** Standard white content card. */
export const CARD =
  "bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 overflow-hidden";

/** Page title block: heading plus optional supporting line. */
export const PAGE_HEADER = "mb-3 sm:mb-4";
