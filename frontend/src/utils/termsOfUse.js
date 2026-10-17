// The Terms of Use are maintained centrally for every Stability Nexus
// interface, so they are fetched rather than copied: an update to the source
// document reaches Chainvoice without a release.
export const TERMS_RAW_URL =
  "https://raw.githubusercontent.com/StabilityNexus/Info/main/TermsOfUse.md";
export const TERMS_PAGE_URL =
  "https://github.com/StabilityNexus/Info/blob/main/TermsOfUse.md";

export const TERMS_STORAGE_KEY = "chainvoice-terms-of-use-accepted";

/**
 * The UTC calendar day of `date`, as "YYYY-MM-DD". Acceptance lasts until
 * 00:00 UTC, so the day has to be UTC's and not the user's local one.
 */
export function utcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

// Merely touching window.localStorage throws in some privacy modes, so the
// lookup itself is guarded, not just the reads and writes.
function defaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * Whether the terms were accepted on the current UTC day. Anything unreadable
 * counts as not accepted, so a storage failure asks again instead of skipping.
 */
export function hasAcceptedTermsToday(
  storage = defaultStorage(),
  now = new Date()
) {
  try {
    return storage?.getItem(TERMS_STORAGE_KEY) === utcDayKey(now);
  } catch {
    return false;
  }
}

/**
 * Records acceptance for the current UTC day. Returns false when storage is
 * unavailable, in which case the acceptance lasts only for this page load.
 */
export function recordTermsAcceptance(
  storage = defaultStorage(),
  now = new Date()
) {
  try {
    if (!storage) return false;
    storage.setItem(TERMS_STORAGE_KEY, utcDayKey(now));
    return true;
  } catch {
    return false;
  }
}
