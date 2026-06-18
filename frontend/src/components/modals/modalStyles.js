/**
 * Shared modal/dialog styling constants for Chainvoice.
 * Matches the same light theme as ProductCatalogImport dialog (main branch).
 *
 * Usage:
 */

/** Dialog header gradient styles (subtle light-theme gradients) */
export const DIALOG_HEADER_STYLE = {
  green: {
    background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.04))',
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e5e7eb',
  },
  blue: {
    background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(139,92,246,0.04))',
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e5e7eb',
  },
  amber: {
    background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.04))',
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e5e7eb',
  },
};

/** Shared info card background for light modals */
export const CARD_STYLE = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
};

/** Shared error display style */
export const ERROR_STYLE = {
  backgroundColor: 'rgba(239, 68, 68, 0.06)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
};

/** Snooze dropdown container style */
export const DROPDOWN_STYLE = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};
