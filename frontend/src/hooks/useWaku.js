import { useState, useEffect, useRef } from 'react';
import { wakuService } from '../services/waku/wakuService.js';

/**
 * React hook wrapping the Waku service for use in components.
 * Initializes the Waku light node on mount. Safe to use in multiple
 * components — the singleton ensures only one node is created.
 *
 * @returns {{ isReady: boolean, error: Error|null, node: object|null }}
 */
export function useWaku() {
  const [isReady, setIsReady] = useState(wakuService.isReady());
  const [error, setError] = useState(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    if (wakuService.isReady()) {
      setIsReady(true);
      return;
    }

    wakuService
      .initialize()
      .then(() => {
        setIsReady(true);
        setError(null);
      })
      .catch((err) => {
        console.error('[useWaku] Failed to initialize:', err);
        setError(err);
        initRef.current = false;
      });
  }, []);

  return { isReady, error, node: wakuService.getNode() };
}
