/**
 * Reminder/snooze persistence service.
 *
 * Manages reminder state for modals (key registration, backup prompts, etc.)
 * with per-wallet scoping so each wallet has independent settings.
 *
 * Storage strategy:
 *   - 'tab' scope     → sessionStorage with unique tab ID (survives refresh, clears on tab close)
 *   - 'session' scope → sessionStorage (clears when browser closes)
 *   - 'custom' scope  → localStorage with a target timestamp
 *   - 'recurring'     → localStorage with interval + lastShown timestamp
 *   - 'permanent'     → localStorage with permanent flag
 *
 * All keys are namespaced: `cv_reminder_{walletAddress}_{reminderKey}`
 */

// Generate a unique tab ID so tab-scoped reminders survive page refreshes
// but not tab closes.
const TAB_ID_KEY = 'cv_tab_id';
if (!sessionStorage.getItem(TAB_ID_KEY)) {
  sessionStorage.setItem(TAB_ID_KEY, `tab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
}
const TAB_ID = sessionStorage.getItem(TAB_ID_KEY);

/** Build a namespaced storage key */
function storageKey(walletAddress, reminderKey) {
  const addr = (walletAddress || 'anonymous').toLowerCase();
  return `cv_reminder_${addr}_${reminderKey}`;
}

/**
 * Dismiss/snooze a reminder.
 *
 * @param {string} walletAddress - current wallet address
 * @param {string} reminderKey - unique identifier (e.g. 'key_registration', 'backup')
 * @param {object} options
 * @param {'tab'|'session'|'custom'|'recurring'|'permanent'} options.type
 * @param {string} [options.until] - ISO date string for 'custom' type
 * @param {'daily'|'weekly'} [options.interval] - for 'recurring' type
 */
export function setReminder(walletAddress, reminderKey, { type, until, interval }) {
  const key = storageKey(walletAddress, reminderKey);
  const data = {
    type,
    dismissedAt: Date.now(),
    tabId: TAB_ID,
  };

  switch (type) {
    case 'tab':
      // Tab-scoped: store in sessionStorage with tab ID
      data.tabId = TAB_ID;
      sessionStorage.setItem(key, JSON.stringify(data));
      break;

    case 'session':
      // Session-scoped: store in sessionStorage (clears on browser close)
      sessionStorage.setItem(key, JSON.stringify(data));
      break;

    case 'custom':
      // Custom date: store in localStorage with expiry
      if (!until) throw new Error('Custom reminder requires an "until" date');
      data.until = new Date(until).getTime();
      localStorage.setItem(key, JSON.stringify(data));
      break;

    case 'recurring':
      // Recurring: store interval and last acknowledged time
      if (!interval) throw new Error('Recurring reminder requires an "interval"');
      data.interval = interval;
      data.lastAcknowledged = Date.now();
      localStorage.setItem(key, JSON.stringify(data));
      break;

    case 'permanent':
      // Permanently dismissed
      data.permanent = true;
      localStorage.setItem(key, JSON.stringify(data));
      break;

    default:
      throw new Error(`Unknown reminder type: ${type}`);
  }
}

/**
 * Check whether a reminder should be shown.
 *
 * @param {string} walletAddress
 * @param {string} reminderKey
 * @returns {boolean} true = show the reminder/modal, false = still snoozed
 */
export function shouldShowReminder(walletAddress, reminderKey) {
  const key = storageKey(walletAddress, reminderKey);

  // Check sessionStorage first (tab / session scope)
  const sessionData = sessionStorage.getItem(key);
  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);

      if (parsed.type === 'tab') {
        // Only valid if same tab
        return parsed.tabId !== TAB_ID;
      }

      if (parsed.type === 'session') {
        // Valid for entire browser session
        return false;
      }
    } catch {
      // Corrupted data — show reminder
      sessionStorage.removeItem(key);
    }
  }

  // Check localStorage (custom / recurring / permanent)
  const localData = localStorage.getItem(key);
  if (!localData) return true; // No reminder set → show

  try {
    const parsed = JSON.parse(localData);

    if (parsed.type === 'permanent') {
      return false; // Permanently dismissed
    }

    if (parsed.type === 'custom') {
      // Show if past the snooze time
      return Date.now() >= parsed.until;
    }

    if (parsed.type === 'recurring') {
      const intervalMs = parsed.interval === 'daily'
        ? 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000; // weekly
      return Date.now() - parsed.lastAcknowledged >= intervalMs;
    }
  } catch {
    // Corrupted data — show reminder
    localStorage.removeItem(key);
  }

  return true;
}

/**
 * Get the current reminder state for display purposes.
 *
 * @param {string} walletAddress
 * @param {string} reminderKey
 * @returns {object|null}
 */
export function getReminder(walletAddress, reminderKey) {
  const key = storageKey(walletAddress, reminderKey);

  const sessionData = sessionStorage.getItem(key);
  if (sessionData) {
    try { return JSON.parse(sessionData); } catch { /* ignore */ }
  }

  const localData = localStorage.getItem(key);
  if (localData) {
    try { return JSON.parse(localData); } catch { /* ignore */ }
  }

  return null;
}

/**
 * Clear/remove a reminder entirely.
 *
 * @param {string} walletAddress
 * @param {string} reminderKey
 */
export function clearReminder(walletAddress, reminderKey) {
  const key = storageKey(walletAddress, reminderKey);
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
}
