import { RelayClient } from '@aossie-org/thrubox-client';

/** Path the Vite dev server proxies to the relay. Keep in sync with vite.config.js. */
export const RELAY_PROXY_PATH = '/relay';

const DEFAULT_RELAY_URL = 'http://localhost:3000';
const DEFAULT_TIMEOUT_MS = 15_000;
const RETRIES = 3;

let client = null;

/**
 * Request timeout, overridable via VITE_RELAY_TIMEOUT_MS.
 *
 * Worth raising on hosts that suspend idle instances: a cold start can take
 * the better part of a minute, and the SDK deliberately does not retry POSTs
 * (a retried send would duplicate the message), so one timed-out request is
 * one invoice that failed to reach its recipient.
 */
function resolveTimeout() {
  const raw = Number(import.meta.env.VITE_RELAY_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS;
}

/**
 * Work out which URL the browser should talk to.
 *
 * The relay serves no CORS headers, so a direct cross-origin request from the
 * browser fails its preflight. There are two ways around that, and both are
 * supported here:
 *
 * - Proxy it, so the browser never makes a cross-origin request at all. In
 *   development the Vite dev server does this at /relay. In production, set
 *   VITE_RELAY_URL to a path rather than a URL (e.g. "/relay") and let the
 *   host rewrite it — Vercel `rewrites`, Netlify `redirects`, nginx
 *   `proxy_pass`. No CORS needed.
 * - Address the relay directly with an absolute VITE_RELAY_URL, which
 *   requires the relay to serve CORS headers for your origin.
 *
 * @returns {string} absolute base URL for RelayClient
 */
function resolveBaseUrl() {
  const configured = (import.meta.env.VITE_RELAY_URL || '').trim();

  if (typeof window !== 'undefined') {
    if (import.meta.env.DEV) {
      return `${window.location.origin}${RELAY_PROXY_PATH}`;
    }
    // A path rather than a URL means "same origin, the host proxies it".
    if (configured.startsWith('/')) {
      return `${window.location.origin}${configured.replace(/\/+$/, '')}`;
    }
  }

  return configured || DEFAULT_RELAY_URL;
}

/**
 * Get the shared RelayClient instance, creating it on first use.
 * @returns {RelayClient}
 */
export function getRelayClient() {
  if (!client) {
    const apiKey = (import.meta.env.VITE_RELAY_API_KEY || '').trim();
    client = new RelayClient(resolveBaseUrl(), {
      ...(apiKey ? { apiKey } : {}),
      timeout: resolveTimeout(),
      retries: RETRIES,
    });
  }
  return client;
}

/** Drop the cached client. Only useful in tests. */
export function resetRelayClient() {
  client = null;
}

/**
 * Check whether the relay is reachable.
 * @returns {Promise<boolean>}
 */
export async function isRelayHealthy() {
  try {
    const health = await getRelayClient().health();
    return health?.status === 'ok';
  } catch (err) {
    console.warn('[RelayClient] Health check failed:', err);
    return false;
  }
}
