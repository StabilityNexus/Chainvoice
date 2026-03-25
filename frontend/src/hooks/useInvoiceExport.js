import { useCallback } from "react";
import { toast } from "react-toastify";
import { downloadInvoiceCSV } from "@/utils/generateInvoiceCSV";
import { downloadInvoiceJSON } from "@/utils/generateInvoiceJSON";

/**
 * Shared hook for exporting a single invoice as CSV or JSON.
 * @param {Object|null} selectedInvoice - The invoice currently open in the drawer
 * @param {string|BigInt} fee - Network fee (wei)
 * @param {Function} onExportDone - Optional callback invoked after a successful export (e.g. close menu)
 */
export const useInvoiceExport = (selectedInvoice, fee, onExportDone) => {
  const handleExportCSV = useCallback(() => {
    if (!selectedInvoice) {
      toast.error("No invoice selected");
      return;
    }
    try {
      downloadInvoiceCSV(selectedInvoice, fee);
      toast.success("CSV downloaded successfully!");
    } catch (error) {
      console.error("Error generating CSV:", error);
      toast.error("Failed to generate CSV. Please try again.");
    }
    onExportDone?.();
  }, [selectedInvoice, fee, onExportDone]);

  const handleExportJSON = useCallback(() => {
    if (!selectedInvoice) {
      toast.error("No invoice selected");
      return;
    }
    try {
      downloadInvoiceJSON(selectedInvoice, fee);
      toast.success("JSON downloaded successfully!");
    } catch (error) {
      console.error("Error generating JSON:", error);
      toast.error("Failed to generate JSON. Please try again.");
    }
    onExportDone?.();
  }, [selectedInvoice, fee, onExportDone]);

  return { handleExportCSV, handleExportJSON };
};
