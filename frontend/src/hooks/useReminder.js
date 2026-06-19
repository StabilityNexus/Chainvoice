import { useState, useEffect, useCallback, useRef } from 'react';
import {
  shouldShowReminder,
  setReminder,
  clearReminder,
} from '@/services/reminderService';

/**
 * React hook for managing reminder/snooze state for a specific modal.
 *
 * @param {string} reminderKey - unique identifier (e.g. 'key_registration')
 * @param {string|null} walletAddress - current wallet address (null = not connected)
 * @param {object} [options]
 * @param {boolean} [options.requiresAction] - if true, reminder can't be permanently dismissed
 * @param {number} [options.checkIntervalMs] - how often to re-check (default: 60s)
 * @returns {{ isDue: boolean, dismiss: function, clear: function, snoozeOptions: array }}
 */
export function useReminder(reminderKey, walletAddress, options = {}) {
  const { requiresAction = false, checkIntervalMs = 60_000 } = options;

  const [isDue, setIsDue] = useState(false);
  const intervalRef = useRef(null);

  // Check reminder status
  const checkStatus = useCallback(() => {
    if (!walletAddress) {
      setIsDue(false);
      return;
    }
    setIsDue(shouldShowReminder(walletAddress, reminderKey));
  }, [walletAddress, reminderKey]);

  // Check on mount and when wallet changes
  useEffect(() => {
    checkStatus();

    // Set up periodic check for time-based reminders
    intervalRef.current = setInterval(checkStatus, checkIntervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkStatus, checkIntervalMs]);

  // Dismiss with a specific snooze type
  const dismiss = useCallback((type, customDate) => {
    if (!walletAddress) return;

    const opts = { type };

    if (type === 'custom' && customDate) {
      opts.until = customDate;
    }

    if (type === 'recurring') {
      opts.interval = customDate; // reuse param for interval name ('daily'|'weekly')
    }

    try {
      setReminder(walletAddress, reminderKey, opts);
    } catch (err) {
      console.warn('[useReminder] Failed to set reminder:', err.message);
    }
    setIsDue(false);
  }, [walletAddress, reminderKey]);

  // Force clear (used when action is completed, e.g. key registered)
  const clear = useCallback(() => {
    if (!walletAddress) return;
    clearReminder(walletAddress, reminderKey);
    setIsDue(false);
  }, [walletAddress, reminderKey]);



  // Available snooze options
  const snoozeOptions = [
    { value: 'tab', label: 'Remind me when I reopen this tab' },
    { value: 'session', label: 'Remind me when I restart the browser' },
    { value: 'custom', label: 'Remind me at a specific time...' },
    ...(!requiresAction
      ? [{ value: 'permanent', label: "Don't remind me again", warning: true }]
      : []),
  ];

  return {
    isDue,
    dismiss,
    clear,
    snoozeOptions,
  };
}
