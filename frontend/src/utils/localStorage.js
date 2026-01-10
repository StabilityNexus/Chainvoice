/**
 * Utility functions for sessionStorage operations with TTL and PII protection
 * Uses sessionStorage (session-only, cleared on tab close) with TTL expiry
 */

const STORAGE_KEYS = {
  CREATE_INVOICE: 'chainvoice_create_invoice',
  CREATE_INVOICES_BATCH: 'chainvoice_create_invoices_batch',
};

// Default TTL: 24 hours (in milliseconds)
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

/**
 * Get storage instance (sessionStorage for session-only storage)
 */
const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
};

/**
 * Safe sessionStorage getter with TTL expiry check
 * Automatically deletes expired entries on read
 * Session-only: cleared when browser tab closes
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const storage = getStorage();
    if (!storage) return defaultValue;

    const item = storage.getItem(key);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);

    // Check if entry has TTL and if it's expired
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      // Entry expired, delete it
      storage.removeItem(key);
      return defaultValue;
    }

    // Return the actual data (without TTL metadata)
    return parsed.data !== undefined ? parsed.data : parsed;
  } catch (error) {
    console.error(`Error reading from sessionStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Safe sessionStorage setter with TTL
 * Wraps data with expiry timestamp
 * Session-only: cleared when browser tab closes
 */
export const saveToStorage = (key, value, ttl = DEFAULT_TTL) => {
  try {
    const storage = getStorage();
    if (!storage) return;

    const expiresAt = Date.now() + ttl;
    const dataToStore = {
      data: value,
      expiresAt,
      createdAt: Date.now(),
    };

    storage.setItem(key, JSON.stringify(dataToStore));
  } catch (error) {
    console.error(`Error saving to sessionStorage (${key}):`, error);
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.warn('sessionStorage quota exceeded. Clearing old data...');
      clearStorage(key);
      // Try to clean up expired entries
      cleanupExpiredEntries();
    }
  }
};

/**
 * Clear specific key from sessionStorage
 */
export const clearStorage = (key) => {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing sessionStorage (${key}):`, error);
  }
};

/**
 * Cleanup expired entries from sessionStorage
 */
const cleanupExpiredEntries = () => {
  try {
    const storage = getStorage();
    if (!storage) return;

    const keysToRemove = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith('chainvoice_')) {
        try {
          const item = storage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
              keysToRemove.push(key);
            }
          }
        } catch (e) {
          // Invalid entry, remove it
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
  } catch (error) {
    console.error('Error cleaning up expired entries:', error);
  }
};

// Maximum number of invoice rows to persist (to prevent quota issues)
const MAX_PERSISTED_INVOICES = 10;

/**
 * Remove PII (emails, names, addresses, countries) from data object before saving
 * Only keeps essential non-PII data needed for form restoration
 */
export const sanitizeDataForStorage = (data) => {
  if (!data || typeof data !== 'object') return data;

  const sanitized = { ...data };

  // Remove top-level PII fields
  delete sanitized.userEmail;
  delete sanitized.clientEmail;
  delete sanitized.userFname;
  delete sanitized.userLname;
  delete sanitized.userCountry;
  delete sanitized.userCity;
  delete sanitized.userPostalcode;
  delete sanitized.clientFname;
  delete sanitized.clientLname;
  delete sanitized.clientCountry;
  delete sanitized.clientCity;
  delete sanitized.clientPostalcode;

  // Handle nested userInfo object (for batch invoices)
  if (sanitized.userInfo && typeof sanitized.userInfo === 'object') {
    sanitized.userInfo = { ...sanitized.userInfo };
    // Remove all PII from userInfo - only keep non-PII fields if any
    delete sanitized.userInfo.userEmail;
    delete sanitized.userInfo.userFname;
    delete sanitized.userInfo.userLname;
    delete sanitized.userInfo.userCountry;
    delete sanitized.userInfo.userCity;
    delete sanitized.userInfo.userPostalcode;
  }

  // Handle invoiceRows array (for batch invoices)
  if (sanitized.invoiceRows && Array.isArray(sanitized.invoiceRows)) {
    // Limit batch size to prevent quota issues
    const limitedRows = sanitized.invoiceRows.slice(0, MAX_PERSISTED_INVOICES);
    
    sanitized.invoiceRows = limitedRows.map((row) => {
      const sanitizedRow = { ...row };
      // Remove all client PII - only keep essential non-PII data
      delete sanitizedRow.clientEmail;
      delete sanitizedRow.clientFname;
      delete sanitizedRow.clientLname;
      delete sanitizedRow.clientCountry;
      delete sanitizedRow.clientCity;
      delete sanitizedRow.clientPostalcode;
      // Keep: clientAddress (needed for functionality), itemData, totalAmountDue
      return sanitizedRow;
    });
  }

  return sanitized;
};

/**
 * Get maximum number of invoices that can be persisted
 */
export const getMaxPersistedInvoices = () => MAX_PERSISTED_INVOICES;

/**
 * Storage keys
 */
export const StorageKeys = STORAGE_KEYS;

// Cleanup expired entries on module load
if (typeof window !== 'undefined') {
  cleanupExpiredEntries();
}

