import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useReminder } from '@/hooks/useReminder';
import { useInvoiceStorage } from '@/hooks/useInvoiceStorage';
import { useAccount } from 'wagmi';
import { getLocalInvoiceCount } from '@/services/invoiceStorage/invoiceBackup';
import { DIALOG_HEADER_STYLE } from './modalStyles';
import {
  Download,
  Clock,
  CalendarClock,
  CalendarDays,
  BellRing,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';

const REMINDER_KEY = 'backup_reminder';

/**
 * Backup reminder modal with scheduling options.
 * Replaces the InvoiceBackupBanner with a more interactive popup.
 */
export default function BackupReminderModal() {
  const { address } = useAccount();
  const { exportBackup, isExporting } = useInvoiceStorage();
  const { isDue, dismiss, snoozeOptions } = useReminder(
    REMINDER_KEY,
    address,
    { requiresAction: false }
  );

  const [invoiceCount, setInvoiceCount] = useState(0);
  useEffect(() => {
    if (address) {
      getLocalInvoiceCount().then(setInvoiceCount).catch(() => setInvoiceCount(0));
    }
  }, [address]);

  const [showSchedule, setShowSchedule] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [exportDone, setExportDone] = useState(false);

  const handleExport = useCallback(async () => {
    try {
      await exportBackup();
      setExportDone(true);
      // Auto-set a weekly recurring reminder after first backup
      dismiss('recurring', 'weekly');
      setTimeout(() => setExportDone(false), 3000);
    } catch (err) {
      console.warn('[BackupReminder] Export failed:', err.message);
    }
  }, [exportBackup, dismiss]);

  const handleSchedule = useCallback(
    (type, value) => {
      if (type === 'custom') {
        if (!value) return;
        dismiss('custom', value);
      } else if (type === 'recurring') {
        dismiss('recurring', value); // 'daily' or 'weekly'
      } else {
        dismiss(type);
      }
      setShowSchedule(false);
    },
    [dismiss]
  );

  // Don't show if not due or no wallet
  if (!isDue || !address || invoiceCount === 0) return null;

  const toLocalDateTimeValue = (date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
  };

  const now = new Date();
  const minDateTime = toLocalDateTimeValue(now);
  const maxDateTime = toLocalDateTimeValue(
    new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
  );

  return (
    <Dialog open={isDue} onOpenChange={(o) => {
      if (!o) dismiss('tab');
    }}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden gap-0">
        {/* Header */}
        <div style={DIALOG_HEADER_STYLE.amber}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 44,
                  height: 44,
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                }}
              >
                <BellRing className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Backup Your Invoices
                </DialogTitle>
                <DialogDescription className="text-sm mt-0.5 text-gray-500">
                  Your data is stored only on this device
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px' }}>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.6 }}>
            If you clear your browser data, switch devices, or reinstall your browser,{' '}
            <span className="text-amber-600 font-semibold">
              your invoices will be permanently lost
            </span>
            . Export a backup now to stay safe.
          </p>

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
            style={{
              background: exportDone
                ? 'linear-gradient(135deg, #22c55e, #10b981)'
                : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            }}
            onMouseEnter={(e) => {
              if (!isExporting && !exportDone)
                e.target.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            }}
            onMouseLeave={(e) => {
              if (!isExporting && !exportDone)
                e.target.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
            }}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : exportDone ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting
              ? 'Exporting...'
              : exportDone
                ? 'Backup Exported!'
                : 'Export Backup Now'}
          </button>

          {/* Schedule section */}
          <div className="mt-4">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Set up backup reminders
              </span>
              <span
                className="transition-transform duration-200"
                style={{ transform: showSchedule ? 'rotate(180deg)' : 'none' }}
              >
                ▾
              </span>
            </button>

            {showSchedule && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                {/* Recurring options */}
                <ScheduleOption
                  icon={<Clock className="w-3.5 h-3.5" />}
                  label="Remind me daily"
                  onClick={() => handleSchedule('recurring', 'daily')}
                />
                <ScheduleOption
                  icon={<CalendarDays className="w-3.5 h-3.5" />}
                  label="Remind me weekly"
                  onClick={() => handleSchedule('recurring', 'weekly')}
                />

                {/* Custom date */}
                <div className="p-3 border-t border-gray-100">
                  <label className="flex items-center gap-2 text-xs mb-1.5 text-gray-500">
                    <CalendarClock className="w-3.5 h-3.5" />
                    Remind me at a specific time
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="datetime-local"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={minDateTime}
                      max={maxDateTime}
                      className="flex-1 rounded-md px-2.5 py-1.5 text-sm bg-white border border-gray-200 text-gray-800"
                    />
                    <button
                      onClick={() => handleSchedule('custom', customDate)}
                      disabled={!customDate}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-opacity disabled:opacity-40"
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      }}
                    >
                      Set
                    </button>
                  </div>
                </div>

                {/* Dismiss permanently */}
                <ScheduleOption
                  icon={<X className="w-3.5 h-3.5" />}
                  label="Don't remind me again"
                  onClick={() => handleSchedule('permanent')}
                  warning
                  last
                />
              </div>
            )}
          </div>

          {/* Quick dismiss */}
          <button
            onClick={() => dismiss('tab')}
            className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Remind me later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScheduleOption({ icon, label, onClick, warning = false, last = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 hover:bg-gray-50 ${
        warning ? 'text-red-500' : 'text-gray-700'
      }`}
      style={{
        borderBottom: last ? 'none' : '1px solid #f3f4f6',
      }}
    >
      <span className={warning ? 'text-red-400' : 'text-gray-400'}>{icon}</span>
      {label}
    </button>
  );
}
