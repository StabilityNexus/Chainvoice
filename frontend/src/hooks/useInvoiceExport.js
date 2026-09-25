import { useCallback } from "react";
import toast from "react-hot-toast";
import { downloadInvoiceCSV } from "@/utils/generateInvoiceCSV";
import { downloadInvoiceJSON } from "@/utils/generateInvoiceJSON";
import { exportInvoiceBatch } from "@/utils/invoiceBulkExport";

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

  const handleBulkExport = useCallback(
    async (invoices, format, mode = "single") => {
      if (!invoices?.length) {
        toast.error("Select at least one invoice");
        return;
      }

      try {
        toast.loading(`Generating ${format.toUpperCase()} export...`, {
          id: "bulk-export",
        });

        await exportInvoiceBatch(invoices, {
          format,
          mode,
          fee,
        });

        toast.success(
          `${invoices.length} invoice${invoices.length > 1 ? "s" : ""
          } exported successfully!`,
          { id: "bulk-export" }
        );

        onExportDone?.();
      } catch (error) {
        console.error("Bulk export failed:", error);

        toast.error(
          error?.message || "Failed to export invoices. Please try again.",
          { id: "bulk-export" }
        );
      }
    },
    [fee, onExportDone]
  );

  return {
    handleExportCSV,
    handleExportJSON,
    handleBulkExport,
  };
};