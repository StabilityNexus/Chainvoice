/**
 * Utility functions for localStorage operations with error handling
 */

const STORAGE_KEYS = {
  CREATE_INVOICE: 'chainvoice_create_invoice',
  CREATE_INVOICES_BATCH: 'chainvoice_create_invoices_batch',
};

/**
 * Safe localStorage getter
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Safe localStorage setter
 */
export const saveToStorage = (key, value) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Clearing old data...');
      clearStorage(key);
    }
  }
};

/**
 * Clear specific key from localStorage
 */
export const clearStorage = (key) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing localStorage (${key}):`, error);
  }
};

/**
 * Storage keys
 */
export const StorageKeys = STORAGE_KEYS;

