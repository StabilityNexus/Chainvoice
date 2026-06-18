import { Info, AlertTriangle } from 'lucide-react';
import { CARD_STYLE, ERROR_STYLE } from './modalStyles';

/**
 * Reusable info card for light-themed modals.
 * Matches the ProductCatalog dialog styling from main branch.
 */
export function InfoCard({ icon, iconColor, title, desc }) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg p-3"
      style={CARD_STYLE}
    >
      <div
        className="flex items-center justify-center rounded-lg mt-0.5 flex-shrink-0"
        style={{
          width: 32,
          height: 32,
          backgroundColor: `${iconColor}15`,
          color: iconColor,
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {title}
        </p>
        <p className="text-xs mt-0.5 text-gray-600" style={{ lineHeight: 1.5 }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

/**
 * Reusable "Remember this signature" checkbox for light-themed modals.
 */
export function RememberCheckbox({ checked, onChange }) {
  return (
    <div className="rounded-lg p-3" style={CARD_STYLE}>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 rounded"
          style={{ accentColor: '#22c55e', width: 16, height: 16 }}
        />
        <div>
          <span className="text-sm text-gray-800">
            Remember this signature
          </span>
          <span
            className="ml-1.5 inline-flex items-center"
            title="The derived key will be cached in your browser's session storage for convenience. The key is cleared when you close this tab."
          >
            <Info
              className="w-3.5 h-3.5 inline text-gray-400"
            />
          </span>
          <p className="mt-1 text-xs text-gray-500" style={{ lineHeight: 1.4 }}>
            Your encryption key stays cached in this tab so you won&apos;t need
            to sign again. Automatically cleared when you close the tab.
          </p>
        </div>
      </label>
    </div>
  );
}

/**
 * Reusable inline error display for light-themed modals.
 */
export function ErrorBox({ message }) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2"
      style={ERROR_STYLE}
    >
      <AlertTriangle
        className="w-4 h-4 flex-shrink-0 text-red-500"
      />
      <span className="text-xs text-red-600">
        {message}
      </span>
    </div>
  );
}
