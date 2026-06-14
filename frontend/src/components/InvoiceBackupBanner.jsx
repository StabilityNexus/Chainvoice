import { useState } from 'react';
import { Alert, AlertTitle, Button, Collapse, IconButton } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useInvoiceStorage } from '@/hooks/useInvoiceStorage';

/**
 * A prominent warning banner encouraging users to back up their local invoice data.
 * Similar to seed phrase backup warnings in crypto wallets.
 */
export default function InvoiceBackupBanner() {
  const [open, setOpen] = useState(true);
  const { exportBackup, isExporting } = useInvoiceStorage();

  // Check if user has dismissed this recently
  const dismissKey = 'chainvoice_backup_banner_dismissed';
  const isDismissed = () => {
    try {
      const ts = localStorage.getItem(dismissKey);
      if (!ts) return false;
      // Show again after 24 hours
      return Date.now() - parseInt(ts) < 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  };

  if (!open || isDismissed()) return null;

  const handleDismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(dismissKey, Date.now().toString());
    } catch {}
  };

  return (
    <Collapse in={open}>
      <Alert
        severity="warning"
        icon={<WarningAmberIcon fontSize="inherit" />}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleDismiss}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          mb: 2,
          backgroundColor: 'rgba(255, 152, 0, 0.08)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          '& .MuiAlert-message': { width: '100%' },
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, color: '#ffb74d' }}>
          ⚠️ Invoice Data Stored Locally Only
        </AlertTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ color: '#e0e0e0', fontSize: '0.875rem' }}>
            Your invoice data is stored only on this device. If you clear your
            browser data, switch devices, or reinstall your browser,{' '}
            <strong>your invoices will be permanently lost</strong>.
          </span>
          <span style={{ color: '#bdbdbd', fontSize: '0.8rem' }}>
            Please export a backup regularly — treat it like your wallet seed
            phrase.
          </span>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={exportBackup}
            disabled={isExporting}
            sx={{
              alignSelf: 'flex-start',
              mt: 0.5,
              color: '#ffb74d',
              borderColor: 'rgba(255, 152, 0, 0.5)',
              '&:hover': {
                borderColor: '#ffb74d',
                backgroundColor: 'rgba(255, 152, 0, 0.08)',
              },
            }}
          >
            {isExporting ? 'Exporting...' : 'Export Backup Now'}
          </Button>
        </div>
      </Alert>
    </Collapse>
  );
}
