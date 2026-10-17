import { useRef } from "react";
import { Download, Upload, Loader2, DatabaseBackup } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoiceStorage } from "@/hooks/useInvoiceStorage";
import toast from "react-hot-toast";

export default function InvoiceBackupSettings() {
  const fileInputRef = useRef(null);
  const { exportBackup, importBackup, isExporting, isImporting } =
    useInvoiceStorage();

  const handleExport = async () => {
    try {
      await exportBackup();
      toast.success("Invoice backup exported successfully.");
    } catch (error) {
      console.error("Failed to export invoice backup:", error);
      toast.error("Failed to export invoice backup.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      await importBackup(file);
      toast.success("Invoice backup imported successfully.");
    } catch (error) {
      console.error("Failed to import invoice backup:", error);
      toast.error(error?.message || "Failed to import invoice backup.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <DatabaseBackup className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">
          Invoice Backup
        </h3>
      </div>

      <p className="text-sm text-muted-foreground mb-5">
        Back up your locally stored invoices or restore them on another
        browser or device.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={handleExport}
          disabled={isExporting || isImporting}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export Backup
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={handleImportClick}
          disabled={isExporting || isImporting}
          variant="outline"
          className="text-foreground border-border hover:bg-accent"
        >
          {isImporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Import Backup
            </>
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}