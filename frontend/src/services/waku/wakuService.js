import { createLightNode, waitForRemotePeer, Protocols } from '@waku/sdk';

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
  }

  /**
   * Initialize the Waku light node. Safe to call multiple times —
   * returns existing node if already initialized, or deduplicates
   * concurrent init calls.
   * @returns {Promise<import('@waku/sdk').LightNode>}
   */
  async initialize() {
    if (this.node) return this.node;
    if (this._initPromise) return this._initPromise;

    this._initPromise = (async () => {
      try {
        console.log('[WakuService] Initializing light node...');
        this.node = await createLightNode({ defaultBootstrap: true });
        await this.node.start();
        console.log('[WakuService] Waiting for remote peers...');
        await waitForRemotePeer(this.node, [
          Protocols.LightPush,
          Protocols.Filter,
          Protocols.Store,
        ]);
        console.log('[WakuService] Node ready.');
        return this.node;
      } catch (err) {
        console.error('[WakuService] Initialization failed:', err);
        this.node = null;
        this._initPromise = null;
        throw err;
      }
    })();

    return this._initPromise;
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
      await this.node.stop();
      this.node = null;
      this._initPromise = null;
    }
  }
}

/** Shared singleton instance */
export const wakuService = new WakuService();
