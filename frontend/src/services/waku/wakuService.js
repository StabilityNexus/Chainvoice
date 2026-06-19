import { createLightNode, waitForRemotePeer, Protocols } from '@waku/sdk';

const INIT_TIMEOUT_MS = 30_000; // 30 seconds max for initialization
const MAX_RETRIES = 2;

/**
 * Singleton service managing the Waku light node lifecycle.
 * Handles initialization, peer discovery, and graceful shutdown.
 */
class WakuService {
  constructor() {
    /** @type {import('@waku/sdk').LightNode|null} */
    this.node = null;
    /** @type {Promise|null} */
    this._initPromise = null;
    /** @type {boolean} */
    this._peerWarningShown = false;
  }

  /**
   * Initialize the Waku light node with timeout and retry.
   * Safe to call multiple times — returns existing node if already
   * initialized, or deduplicates concurrent init calls.
   * @returns {Promise<import('@waku/sdk').LightNode>}
   */
  async initialize() {
    if (this._initPromise) return this._initPromise;
    if (this.node) return this.node;

    this._initPromise = this._initWithRetry();
    return this._initPromise;
  }

  /** @private */
  async _initWithRetry() {
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const node = await this._initOnce(attempt);
        return node;
      } catch (err) {
        lastError = err;
        console.warn(
          `[WakuService] Attempt ${attempt}/${MAX_RETRIES} failed:`,
          err.message || err
        );
        // Clean up partial state before retrying
        if (this.node) {
          try { await this.node.stop(); } catch { /* ignore */ }
          this.node = null;
        }
        if (attempt < MAX_RETRIES) {
          // Brief pause before retry
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }
    this._initPromise = null;
    throw lastError;
  }

  /** @private */
  async _initOnce(attempt) {
    console.log(`[WakuService] Initializing light node (attempt ${attempt})...`);

    this.node = await createLightNode({ defaultBootstrap: true });
    await this.node.start();
    console.log('[WakuService] Waiting for remote peers...');

    // Race against a timeout so we don't hang forever
    await Promise.race([
      waitForRemotePeer(this.node, [
        Protocols.LightPush,
        Protocols.Filter,
        Protocols.Store,
      ]),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Peer discovery timed out')),
          INIT_TIMEOUT_MS
        )
      ),
    ]);

    console.log('[WakuService] Node ready.');
    return this.node;
  }

  /** @returns {import('@waku/sdk').LightNode|null} */
  getNode() {
    return this.node;
  }

  /** @returns {boolean} */
  isReady() {
    return this.node !== null;
  }

  /** Stop the Waku node and release resources. */
  async stop() {
    if (this.node) {
      try {
        await this.node.stop();
      } catch (err) {
        console.warn('[WakuService] Error stopping node:', err.message);
      }
      this.node = null;
      this._initPromise = null;
      this._peerWarningShown = false;
    }
  }
}

/** Shared singleton instance */
export const wakuService = new WakuService();

