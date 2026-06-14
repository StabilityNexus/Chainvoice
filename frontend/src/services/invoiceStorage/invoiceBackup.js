import {
  exportDB,
  importDB,
} from '../../lib/aossie-idb-backup/index.js';
import { DB_NAME } from './invoiceDB.js';

/**
 * Download a JS object as a JSON file.
 */
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Read a File object as parsed JSON.
 */
function readFileAsJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch (e) {
        reject(new Error('Failed to parse backup file as JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Export all local invoice data as a downloadable JSON backup file.
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
  if (!backupData || !backupData.databaseName) {
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
