import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Database,
  HardDrive,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { DIALOG_HEADER_STYLE } from './modalStyles';
import { InfoCard } from './ModalComponents';

const STORAGE_KEY = 'cv_indexeddb_info_acknowledged';

/**
 * First-visit modal explaining IndexedDB local storage.
 * Shows once per browser (tracked in localStorage).
 */
export default function IndexedDBInfoModal() {
  const [open, setOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    try {
      const shown = localStorage.getItem(STORAGE_KEY);
      if (!shown) {
        // Short delay so it doesn't flash immediately on mount
        const timer = setTimeout(() => setOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage not available — skip
    }
  }, []);

  const handleConfirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch { /* ignore */ }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {
      // Only allow closing via the button
      if (o === false && !acknowledged) return;
      // Let the button's onClick handler manage the close
    }}>
      <DialogContent
        className="sm:max-w-[520px] p-0 overflow-hidden gap-0"
        onPointerDownOutside={(e) => {
          if (!acknowledged) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!acknowledged) e.preventDefault();
        }}
      >
        {/* Header */}
        <div style={DIALOG_HEADER_STYLE.blue}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 44,
                  height: 44,
                  background: 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
                }}
              >
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  How Your Data Is Stored
                </DialogTitle>
                <DialogDescription className="text-sm mt-0.5 text-gray-500">
                  Important information about your invoice data
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div className="space-y-2.5">
            <InfoCard
              icon={<Database className="w-4 h-4" />}
              iconColor="#60a5fa"
              title="What is IndexedDB?"
              desc="Your invoice data is stored locally in your browser using IndexedDB — a secure, built-in database that works offline."
            />
            <InfoCard
              icon={<HardDrive className="w-4 h-4" />}
              iconColor="#a78bfa"
              title="What's stored?"
              desc="Invoice details, payment history, Waku message cache, and product catalogs. All encrypted data stays on your device."
            />
            <InfoCard
              icon={<ShieldCheck className="w-4 h-4" />}
              iconColor="#4ade80"
              title="Why local storage?"
              desc="Your data never leaves your device. No centralized server can access, censor, or lose your invoices."
            />
            <InfoCard
              icon={<AlertTriangle className="w-4 h-4" />}
              iconColor="#f87171"
              title="Important warning"
              desc="If you clear browser data, switch devices, or reinstall your browser, your invoices will be permanently lost. Regular backups are essential."
            />
          </div>

          {/* Acknowledge checkbox */}
          <label
            className="flex items-start gap-2.5 cursor-pointer rounded-lg p-3 mt-4 transition-colors"
            style={{
              backgroundColor: acknowledged ? 'rgba(96, 165, 250, 0.06)' : '#f9fafb',
              border: `1px solid ${acknowledged ? 'rgba(96, 165, 250, 0.25)' : '#e5e7eb'}`,
            }}
          >
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 rounded"
              style={{ accentColor: '#60a5fa', width: 16, height: 16 }}
            />
            <span className="text-gray-700" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
              I understand my data is stored locally and I am responsible for creating backups
            </span>
          </label>

          {/* Action */}
          <button
            onClick={handleConfirm}
            disabled={!acknowledged}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:
                !acknowledged
                  ? 'rgba(96, 165, 250, 0.25)'
                  : 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
            }}
            onMouseEnter={(e) => {
              if (acknowledged) e.target.style.background = 'linear-gradient(135deg, #3b82f6, #7c3aed)';
            }}
            onMouseLeave={(e) => {
              if (acknowledged) e.target.style.background = 'linear-gradient(135deg, #60a5fa, #8b5cf6)';
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Got it!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
