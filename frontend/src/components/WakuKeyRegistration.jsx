import { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useWakuKeys } from '@/hooks/useWakuKeys';

/**
 * Prompts the user to register their Waku public key on-chain if not yet done.
 * This is required before they can receive encrypted invoices.
 */
export default function WakuKeyRegistration() {
  const {
    isRegistered,
    isLoading,
    error,
    rememberSession,
    setRememberSession,
    deriveAndRegister,
  } = useWakuKeys();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || isRegistered) return null;

  return (
    <Collapse in={!isRegistered && !dismissed}>
      <Alert
        severity="info"
        icon={<VpnKeyIcon fontSize="inherit" />}
        sx={{
          mb: 2,
          backgroundColor: 'rgba(33, 150, 243, 0.08)',
          border: '1px solid rgba(33, 150, 243, 0.3)',
          '& .MuiAlert-message': { width: '100%' },
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, color: '#64b5f6' }}>
          🔑 Register Your Encryption Key
        </AlertTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ color: '#e0e0e0', fontSize: '0.875rem' }}>
            To receive encrypted invoices, you need to register your encryption
            key on-chain. This requires signing a message with your wallet and
            a small transaction.
          </span>

          <Tooltip
            title="If checked, the derived key will be cached in your browser's session storage for convenience. The key is cleared when you close this tab."
            arrow
            placement="right"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  size="small"
                  sx={{ color: '#90caf9', '&.Mui-checked': { color: '#90caf9' } }}
                />
              }
              label="Remember this signature until the end of this session"
              sx={{ color: '#e0e0e0', fontSize: '0.85rem', mt: 0.5 }}
            />
          </Tooltip>

          {error && (
            <span style={{ color: '#ef5350', fontSize: '0.8rem' }}>
              Error: {error}
            </span>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={
                isLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <CheckCircleIcon />
                )
              }
              onClick={() => deriveAndRegister(rememberSession)}
              disabled={isLoading}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
              }}
            >
              {isLoading ? 'Registering...' : 'Register Key'}
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => setDismissed(true)}
              sx={{ color: '#9ca3af' }}
            >
              Later
            </Button>
          </div>
        </div>
      </Alert>
    </Collapse>
  );
}
