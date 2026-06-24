import {
  exportDB,
  importDB,
  downloadJSON,
  readFileAsJSON,
} from '@aossie-org/idb-backup';
import { DB_NAME } from './invoiceDB.js';

/**
 * Export all local invoice data as a downloadable JSON backup file.
 * Uses @aossie-org/idb-backup for type-safe IndexedDB export.
 * @returns {Promise<Object>} the backup data object
 */
export async function exportInvoiceBackup() {
  const backup = await exportDB({ dbName: DB_NAME });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  downloadJSON(backup, `chainvoice-backup-${timestamp}.json`);
  return backup;
}

/**
 * Import invoice data from a backup JSON file.
 * Uses 'merge' strategy to avoid overwriting existing data.
 *
 * @param {File} file - the uploaded backup file
 */
export async function importInvoiceBackup(file) {
  const backupData = await readFileAsJSON(file);

  // Validate it's a valid backup
  if (!backupData || backupData.databaseName !== DB_NAME) {
    throw new Error(
      'Invalid backup file format. Please select a valid ChainVoice backup.'
    );
  }

  await importDB({
    dbName: DB_NAME,
    backupData,
    strategy: 'merge',
  });
}

/**
 * Get the count of locally stored invoices (for UI display).
 * @returns {Promise<number>}
 */
export async function getLocalInvoiceCount() {
  try {
    const { getAllInvoices } = await import('./invoiceDB.js');
    const all = await getAllInvoices();
    return all.length;
  } catch {
    return 0;
  }
}
