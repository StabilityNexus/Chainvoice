import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SecurityIcon from '@mui/icons-material/Security';
import { useInvoiceStorage } from '@/hooks/useInvoiceStorage';
import toast from 'react-hot-toast';

/**
 * Full backup/restore dialog with import and export capabilities.
 * Provides clear instructions similar to wallet seed phrase backup flows.
 *
 * @param {{ open: boolean, onClose: () => void }} props
 */
export default function InvoiceBackupDialog({ open, onClose }) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);
  const { exportBackup, importBackup, isExporting, isImporting } =
    useInvoiceStorage();

  useEffect(() => {
    if (open) setImportStatus(null);
  }, [open]);

  const handleExport = async () => {
    try {
      await exportBackup();
      toast.success('Backup exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export backup.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('importing');
      await importBackup(file);
      setImportStatus('success');
      toast.success('Backup imported successfully! Refresh to see updated data.');
    } catch (err) {
      console.error('Import failed:', err);
      setImportStatus('error');
      toast.error(err.message || 'Failed to import backup.');
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1a1f2e',
          color: '#e0e0e0',
          border: '1px solid #374151',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid #374151',
        }}
      >
        <SecurityIcon sx={{ color: '#22c55e' }} />
        <span>Invoice Data Backup</span>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 152, 0, 0.08)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
          }}
        >
          <Typography variant="body2">
            Your invoice data exists <strong>only on this device</strong>.
            Without a backup, your data cannot be recovered if lost.
          </Typography>
        </Alert>

        {/* Export Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#9ca3af' }}>
            EXPORT BACKUP
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5, color: '#d1d5db' }}>
            Download a copy of all your local invoice data as a JSON file. Store
            it securely — preferably in multiple locations.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={isExporting}
            fullWidth
            sx={{
              color: '#22c55e',
              borderColor: 'rgba(34, 197, 94, 0.5)',
              '&:hover': {
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
              },
            }}
          >
            {isExporting ? 'Exporting...' : 'Download Backup'}
          </Button>
        </Box>

        {/* Import Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#9ca3af' }}>
            RESTORE FROM BACKUP
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5, color: '#d1d5db' }}>
            Import a previously exported backup file. Existing data will be
            preserved — only new entries are added.
          </Typography>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            accept=".json"
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={handleImportClick}
            disabled={isImporting}
            fullWidth
            sx={{
              color: '#60a5fa',
              borderColor: 'rgba(96, 165, 250, 0.5)',
              '&:hover': {
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.08)',
              },
            }}
          >
            {isImporting ? 'Importing...' : 'Import Backup File'}
          </Button>

          {isImporting && <LinearProgress sx={{ mt: 1 }} />}

          {importStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Backup imported successfully!
            </Alert>
          )}
          {importStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Import failed. Please check the file and try again.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #374151', px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: '#9ca3af' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
