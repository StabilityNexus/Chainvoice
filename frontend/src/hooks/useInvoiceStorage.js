import { useState, useCallback } from 'react';
import {
  storeInvoice,
  getSentInvoices,
  getReceivedInvoices,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
} from '../services/invoiceStorage/invoiceDB.js';
import {
  exportInvoiceBackup,
  importInvoiceBackup,
} from '../services/invoiceStorage/invoiceBackup.js';

/**
 * React hook for interacting with local IndexedDB invoice storage.
 * Provides CRUD operations and backup/restore functionality.
 */
export function useInvoiceStorage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportInvoiceBackup();
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleImport = useCallback(async (file) => {
    setIsImporting(true);
    try {
      await importInvoiceBackup(file);
    } finally {
      setIsImporting(false);
    }
  }, []);

  return {
    storeInvoice,
    getSentInvoices,
    getReceivedInvoices,
    getAllInvoices,
    getInvoiceById,
    updateInvoiceStatus,
    exportBackup: handleExport,
    importBackup: handleImport,
    isExporting,
    isImporting,
  };
}
