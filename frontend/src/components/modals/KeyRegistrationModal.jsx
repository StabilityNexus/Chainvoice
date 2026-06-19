import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useWakuKeys } from '@/hooks/useWakuKeys';
import { useReminder } from '@/hooks/useReminder';
import { useAccount } from 'wagmi';
import { DIALOG_HEADER_STYLE, DROPDOWN_STYLE } from './modalStyles';
import { InfoCard, RememberCheckbox, ErrorBox } from './ModalComponents';
import {
  Shield,
  Zap,
  Coins,
  AlertTriangle,
  KeyRound,
  LockKeyhole,
  ChevronDown,
  Clock,
  CalendarClock,
  Loader2,
  X,
} from 'lucide-react';

const REMINDER_KEY = 'key_registration';

/**
 * Key Registration / Unlock modal.
 * Replaces the old WakuKeyRegistration banner.
 *
 * - First-time: detailed info → register
 * - Returning (cache cleared): simpler unlock flow
 * - Blocks invoice creation until registered
 */
export default function KeyRegistrationModal() {
  const { address, isConnected } = useAccount();
  const {
    isRegistered,
    hasKeys,
    isLoading,
    error,
    rememberSession,
    setRememberSession,
    deriveAndRegister,
  } = useWakuKeys();

  const { isDue, dismiss, snoozeOptions } = useReminder(
    REMINDER_KEY,
    address,
    { requiresAction: true }
  );

  const [showSnooze, setShowSnooze] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  // Determine if modal should be open
  const needsRegistration = isConnected && !isRegistered;
  const needsUnlock = isConnected && isRegistered && !hasKeys;

  useEffect(() => {
    if (needsRegistration && isDue) {
      setInternalOpen(true);
    } else if (needsUnlock && isDue) {
      setInternalOpen(true);
    } else if (!needsRegistration && !needsUnlock) {
      setInternalOpen(false);
    }
  }, [needsRegistration, needsUnlock, isDue]);

  // Close after successful registration/unlock
  useEffect(() => {
    if (isRegistered && hasKeys) {
      setInternalOpen(false);
    }
  }, [isRegistered, hasKeys]);

  const handleRegister = useCallback(async () => {
    try {
      await deriveAndRegister(rememberSession);
    } catch {
      // Error is handled by useWakuKeys
    }
  }, [deriveAndRegister, rememberSession]);

  const handleSnooze = useCallback(
    (type) => {
      if (type === 'custom') {
        setShowDatePicker(true);
        return;
      }
      dismiss(type);
      setInternalOpen(false);
      setShowSnooze(false);
    },
    [dismiss]
  );

  const handleCustomDateConfirm = useCallback(() => {
    if (!customDate) return;
    dismiss('custom', customDate);
    setInternalOpen(false);
    setShowSnooze(false);
    setShowDatePicker(false);
    setCustomDate('');
  }, [customDate, dismiss]);

  // Public method to open from outside (e.g., CreateInvoice gate)
  const openModal = useCallback(() => setInternalOpen(true), []);

  // Don't render if not connected
  if (!isConnected) return null;

  // Everything is good — no modal needed
  if (isRegistered && hasKeys) return null;

  const isUnlockMode = isRegistered;

  // Minimum datetime for the picker (now)
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);
  const maxDateTime = new Date(
    now.getTime() + 365 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <>
      {/* The modal */}
      <Dialog open={internalOpen} onOpenChange={(open) => {
        // Only allow closing if registered or via snooze
        if (!open && !isRegistered) {
          // Don't close — must snooze or register
          return;
        }
        if (!open && isRegistered && !hasKeys) {
          // Unlock can be dismissed freely
          setInternalOpen(false);
        }
      }}>
        <DialogContent
          className="sm:max-w-[520px] p-0 overflow-hidden gap-0"
          onPointerDownOutside={(e) => {
            // Prevent closing by clicking outside for registration
            if (!isRegistered) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (!isRegistered) e.preventDefault();
          }}
        >
          {/* Header gradient bar */}
          <div style={DIALOG_HEADER_STYLE.green}>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 44,
                    height: 44,
                    background: 'linear-gradient(135deg, #22c55e, #10b981)',
                  }}
                >
                  {isUnlockMode ? (
                    <LockKeyhole className="w-5 h-5 text-white" />
                  ) : (
                    <KeyRound className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-gray-900">
                    {isUnlockMode
                      ? 'Unlock Your Invoices'
                      : 'Secure Your Invoices'}
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-0.5 text-gray-500">
                    {isUnlockMode
                      ? 'Sign a message to access your encrypted invoices'
                      : 'Set up end-to-end encryption for your invoices'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Body */}
          <div style={{ padding: '20px 24px 24px' }}>
            {isUnlockMode ? (
              /* ============ UNLOCK MODE ============ */
              <div className="space-y-4">
                <p className="text-sm text-gray-700" style={{ lineHeight: 1.6 }}>
                  Your account is already set up. Just sign to unlock your dashboard.{' '}
                  <span className="text-green-600 font-semibold">
                    No gas fee required.
                  </span>
                </p>

                {/* Remember checkbox */}
                <RememberCheckbox
                  checked={rememberSession}
                  onChange={setRememberSession}
                />

                {/* Error */}
                {error && <ErrorBox message={error} />}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isLoading
                        ? 'rgba(34, 197, 94, 0.3)'
                        : 'linear-gradient(135deg, #22c55e, #10b981)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) e.target.style.background = 'linear-gradient(135deg, #16a34a, #059669)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) e.target.style.background = 'linear-gradient(135deg, #22c55e, #10b981)';
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LockKeyhole className="w-4 h-4" />
                    )}
                    {isLoading ? 'Unlocking...' : 'Unlock Key'}
                  </button>
                  <button
                    onClick={() => setInternalOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Later
                  </button>
                </div>
              </div>
            ) : (
              /* ============ REGISTRATION MODE ============ */
              <div className="space-y-4">
                {/* Info cards */}
                <div className="grid grid-cols-1 gap-2.5">
                  <InfoCard
                    icon={<Shield className="w-4 h-4" />}
                    iconColor="#22c55e"
                    title="Why encryption?"
                    desc="Invoices contain sensitive financial data. Encryption ensures only you and your client can read them."
                  />
                  <InfoCard
                    icon={<Zap className="w-4 h-4" />}
                    iconColor="#facc15"
                    title="How does it work?"
                    desc="Sign a message with your wallet to generate your unique key. Same wallet always produces the same key."
                  />
                  <InfoCard
                    icon={<Coins className="w-4 h-4" />}
                    iconColor="#60a5fa"
                    title="What does it cost?"
                    desc="A one-time gas fee (~$0.01). After that, unlocking is always free — just a signature."
                  />
                  <InfoCard
                    icon={<AlertTriangle className="w-4 h-4" />}
                    iconColor="#f87171"
                    title="What if I skip?"
                    desc="You won't be able to send or receive encrypted invoices. Others cannot send invoices to you."
                  />
                </div>

                {/* Acknowledge checkbox */}
                <label
                  className="flex items-start gap-2.5 cursor-pointer rounded-lg p-3 transition-colors"
                  style={{
                    backgroundColor: acknowledged ? 'rgba(34, 197, 94, 0.06)' : '#f9fafb',
                    border: `1px solid ${acknowledged ? 'rgba(34, 197, 94, 0.25)' : '#e5e7eb'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded"
                    style={{ accentColor: '#22c55e', width: 16, height: 16 }}
                  />
                  <span className="text-gray-700" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                    I understand that encryption is required to send and receive invoices on Chainvoice
                  </span>
                </label>

                {/* Remember checkbox */}
                <RememberCheckbox
                  checked={rememberSession}
                  onChange={setRememberSession}
                />

                {/* Error */}
                {error && <ErrorBox message={error} />}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleRegister}
                    disabled={isLoading || !acknowledged}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background:
                        isLoading || !acknowledged
                          ? 'rgba(34, 197, 94, 0.25)'
                          : 'linear-gradient(135deg, #22c55e, #10b981)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading && acknowledged)
                        e.target.style.background = 'linear-gradient(135deg, #16a34a, #059669)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading && acknowledged)
                        e.target.style.background = 'linear-gradient(135deg, #22c55e, #10b981)';
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    {isLoading ? 'Registering...' : 'Register Key'}
                  </button>

                  {/* Snooze dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSnooze(!showSnooze)}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Later
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {showSnooze && (
                      <div
                        className="absolute right-0 bottom-full mb-2 w-64 rounded-lg shadow-xl z-50 overflow-hidden"
                        style={DROPDOWN_STYLE}
                      >
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                          Remind me later
                        </div>
                        {snoozeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleSnooze(opt.value)}
                            className={`w-full text-left px-3 py-2.5 text-sm transition-colors duration-150 flex items-center gap-2 border-b border-gray-50 hover:bg-gray-50 ${
                              opt.warning ? 'text-red-500' : 'text-gray-700'
                            }`}
                          >
                            {opt.value === 'tab' && (
                              <Clock className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                            )}
                            {opt.value === 'session' && (
                              <X className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                            )}
                            {opt.value === 'custom' && (
                              <CalendarClock className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                            )}
                            {opt.label}
                          </button>
                        ))}

                        {/* Custom date picker inline */}
                        {showDatePicker && (
                          <div className="p-3 border-t border-gray-100">
                            <label className="block text-xs mb-1.5 text-gray-500">
                              Remind me at:
                            </label>
                            <input
                              type="datetime-local"
                              value={customDate}
                              onChange={(e) => setCustomDate(e.target.value)}
                              min={minDateTime}
                              max={maxDateTime}
                              className="w-full rounded-md px-2.5 py-1.5 text-sm bg-white border border-gray-200 text-gray-800"
                            />
                            {customDate && (
                              <p className="mt-1 text-xs text-green-600">
                                {getRelativeTime(customDate)}
                              </p>
                            )}
                            <button
                              onClick={handleCustomDateConfirm}
                              disabled={!customDate}
                              className="mt-2 w-full py-1.5 rounded-md text-xs font-semibold text-white transition-opacity disabled:opacity-40"
                              style={{
                                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                              }}
                            >
                              Confirm
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Expose openModal via a hidden render — parent can call via ref if needed */}
      <KeyRegistrationGate
        isRegistered={isRegistered}
        hasKeys={hasKeys}
        isConnected={isConnected}
        onOpenModal={openModal}
      />
    </>
  );
}

/**
 * Hidden component that exposes the "registration gate" logic.
 * It sets a CSS custom property and a global flag that CreateInvoice can check.
 */
function KeyRegistrationGate({ isRegistered, hasKeys, isConnected, onOpenModal }) {
  useEffect(() => {
    // Expose the openModal function globally for CreateInvoice to use
    window.__chainvoiceKeyRegistration = {
      isRegistered,
      hasKeys,
      isConnected,
      openModal: onOpenModal,
    };
    return () => {
      delete window.__chainvoiceKeyRegistration;
    };
  }, [isRegistered, hasKeys, isConnected, onOpenModal]);

  return null;
}

/** Format a relative time string from a datetime-local value */
function getRelativeTime(dateString) {
  const target = new Date(dateString).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return 'That time has already passed';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return `That's in ${days} day${days > 1 ? 's' : ''}${remainingHours > 0 ? `, ${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`;
  }
  if (hours > 0) {
    return `That's in ${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? `, ${minutes} min` : ''}`;
  }
  return `That's in ${minutes} minute${minutes > 1 ? 's' : ''}`;
}
