import { ethers } from 'ethers';

/**
 * Message the user signs to derive their messaging keypair.
 *
 * Treat this as a wire-compatibility constant: the derived public key is
 * what users register on-chain, and a different message derives a different
 * key, silently breaking decryption for anyone who registered under the old
 * one. It may only change alongside a contract redeployment, which clears
 * the registry and forces everyone to re-register anyway. Bump the version
 * suffix if that ever happens again.
 */
const DERIVATION_MESSAGE = 'ChainVoice Messaging Key Derivation v2';
// Versioned with the derivation message. Without this, a tab still holding a
// key derived from the v1 message would have it served straight from the
// session cache — and register that stale key on the redeployed registry,
// where it would never match the v2 key the same wallet derives after a
// reload. Bumping the prefix alongside DERIVATION_MESSAGE makes old records
// unreadable rather than silently wrong.
const KEY_STORAGE_PREFIX = 'chainvoice_relay_keys_v2_';

/** secp256k1 key sizes, as the on-chain registry validates them. */
const PRIVATE_KEY_BYTES = 32;
const PUBLIC_KEY_BYTES = 65;
const UNCOMPRESSED_PREFIX = 0x04;

/** In-memory cache for derived keys (keyed by lowercase address). */
const memoryCache = new Map();

/**
 * Derivations currently awaiting a signature, keyed by lowercase address.
 *
 * The cache is only populated once signMessage resolves, so two callers racing
 * before that both miss it and both open a wallet prompt. Sharing the in-flight
 * promise means the second caller waits on the first signature instead.
 */
const inFlightDerivations = new Map();

/**
 * Bumped whenever an address is cleared. A derivation captures the value it
 * started with and refuses to write its result if it no longer matches, so a
 * signature still pending at the moment of a disconnect cannot restore the key
 * afterwards.
 */
const cacheGenerations = new Map();

function currentGeneration(cacheKey) {
  return cacheGenerations.get(cacheKey) ?? 0;
}

/**
 * Convert hex string to Uint8Array.
 * @param {string} hex
 * @returns {Uint8Array}
 */
function hexToBytes(hex) {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (cleanHex.length % 2 !== 0) throw new Error('Invalid hex string: odd length');
  if (!/^[0-9a-fA-F]*$/.test(cleanHex)) throw new Error('Invalid hex string: non-hex characters');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string (0x-prefixed).
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function bytesToHex(bytes) {
  return '0x' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Derive an ECIES keypair from a wallet signature.
 *
 * The user signs a deterministic message, and we use keccak256 of the
 * signature as the 32-byte private key for secp256k1. This ensures the
 * same wallet always derives the same key pair, so the key never has to
 * be stored anywhere durable.
 *
 * @param {import('ethers').Signer} signer - ethers v6 signer
 * @param {string} address - wallet address
 * @param {boolean} [rememberSession=false] - if true, cache keys in sessionStorage; if false, keep in memory only
 * @returns {Promise<{privateKey: Uint8Array, publicKey: Uint8Array}>}
 */
export async function deriveRelayKeyPair(signer, address, rememberSession = false) {
  // Check in-memory cache first (avoids re-derivation within the same page session)
  const memCached = getMemoryCachedKeys(address);
  if (memCached) return memCached;

  // Then check sessionStorage
  const sessionCached = getSessionCachedKeys(address);
  if (sessionCached) {
    // Populate memory cache so subsequent lookups are instant
    setMemoryCachedKeys(address, sessionCached);
    return sessionCached;
  }

  // Join an in-flight derivation for this address rather than starting a
  // second one, so concurrent callers never produce two signature prompts.
  const cacheKey = address.toLowerCase();
  const pending = inFlightDerivations.get(cacheKey);
  if (pending) return pending;

  const startedAtGeneration = currentGeneration(cacheKey);
  const derivation = (async () => {
    // Sign deterministic message to derive keys
    const signature = await signer.signMessage(DERIVATION_MESSAGE);

    // Use keccak256 of the raw signature bytes as the private key (32 bytes)
    const privateKeyHex = ethers.keccak256(signature);
    const privateKey = hexToBytes(privateKeyHex);

    // Derive uncompressed public key (65 bytes: 0x04 + x + y)
    const signingKey = new ethers.SigningKey(privateKeyHex);
    const publicKey = hexToBytes(signingKey.publicKey);

    const keyPair = { privateKey, publicKey };

    // The key was cleared while this signature was pending — the account was
    // switched or disconnected. Hand the value back to whoever asked, but do
    // not resurrect it in any cache.
    if (currentGeneration(cacheKey) !== startedAtGeneration) {
      return keyPair;
    }

    // Always store in memory cache
    setMemoryCachedKeys(address, keyPair);

    // Optionally persist to sessionStorage
    if (rememberSession) {
      cacheKeysToSession(address, privateKey, publicKey);
    }

    return keyPair;
  })();

  inFlightDerivations.set(cacheKey, derivation);
  try {
    return await derivation;
  } finally {
    inFlightDerivations.delete(cacheKey);
  }
}

/**
 * Store a key pair in the in-memory cache.
 * @param {string} address
 * @param {{privateKey: Uint8Array, publicKey: Uint8Array}} keyPair
 */
function setMemoryCachedKeys(address, keyPair) {
  memoryCache.set(address.toLowerCase(), keyPair);
}

/**
 * Retrieve a key pair from the in-memory cache.
 * @param {string} address
 * @returns {{privateKey: Uint8Array, publicKey: Uint8Array}|null}
 */
function getMemoryCachedKeys(address) {
  return memoryCache.get(address.toLowerCase()) || null;
}

/**
 * Cache derived keys in sessionStorage for the current session.
 * @param {string} address
 * @param {Uint8Array} privateKey
 * @param {Uint8Array} publicKey
 */
function cacheKeysToSession(address, privateKey, publicKey) {
  try {
    const data = {
      privateKey: bytesToHex(privateKey),
      publicKey: bytesToHex(publicKey),
    };
    sessionStorage.setItem(
      KEY_STORAGE_PREFIX + address.toLowerCase(),
      JSON.stringify(data)
    );
  } catch (e) {
    console.warn('[RelayKeyManager] Failed to cache keys:', e);
  }
}

/**
 * Retrieve cached keys from sessionStorage.
 * @param {string} address
 * @returns {{privateKey: Uint8Array, publicKey: Uint8Array}|null}
 */
function getSessionCachedKeys(address) {
  try {
    const raw = sessionStorage.getItem(
      KEY_STORAGE_PREFIX + address.toLowerCase()
    );
    if (!raw) return null;
    const data = JSON.parse(raw);
    const privateKey = hexToBytes(data.privateKey);
    const publicKey = hexToBytes(data.publicKey);

    // A truncated entry still parses as valid hex, and a wrong-sized key fails
    // every decryption silently — tryDecryptPayload swallows the error, so the
    // inbox would just stop working with nothing in the console. Treat it as a
    // miss and drop it so the next call re-derives.
    if (
      privateKey.length !== PRIVATE_KEY_BYTES ||
      publicKey.length !== PUBLIC_KEY_BYTES ||
      publicKey[0] !== UNCOMPRESSED_PREFIX
    ) {
      console.warn('[RelayKeyManager] Discarding malformed cached key');
      sessionStorage.removeItem(KEY_STORAGE_PREFIX + address.toLowerCase());
      return null;
    }

    return { privateKey, publicKey };
  } catch {
    return null;
  }
}

/**
 * Clear cached keys for a given address from both memory and sessionStorage.
 * @param {string} address
 */
export function clearCachedKeys(address) {
  if (!address) return;
  const key = address.toLowerCase();
  memoryCache.delete(key);
  inFlightDerivations.delete(key);
  cacheGenerations.set(key, currentGeneration(key) + 1);
  try {
    sessionStorage.removeItem(KEY_STORAGE_PREFIX + key);
  } catch {
    // Ignore errors (e.g. SSR environments)
  }
}

/**
 * Read an already-derived key pair without ever signing.
 *
 * Deriving needs a wallet signature, so callers that only want to restore an
 * existing session — a page reload, say — must not fall through to
 * derivation: that would pop an unexplained signature prompt on load. This
 * returns null instead when nothing is cached.
 *
 * @param {string} address
 * @returns {{privateKey: Uint8Array, publicKey: Uint8Array}|null}
 */
export function getCachedKeyPair(address) {
  if (!address) return null;

  const memCached = getMemoryCachedKeys(address);
  if (memCached) return memCached;

  const sessionCached = getSessionCachedKeys(address);
  if (sessionCached) {
    // Promote to the memory cache so later reads skip the parse.
    setMemoryCachedKeys(address, sessionCached);
    return sessionCached;
  }

  return null;
}

/**
 * Check if the keys are already cached in memory or session storage.
 * @param {string} address
 * @returns {boolean}
 */
export function hasCachedKeys(address) {
  return getCachedKeyPair(address) !== null;
}

/**
 * Register the user's messaging public key on-chain.
 *
 * @param {import('ethers').Contract} contract - Chainvoice contract instance
 * @param {Uint8Array} publicKey - the user's public key
 * @returns {Promise<import('ethers').TransactionReceipt>}
 */
export async function registerPublicKeyOnChain(contract, publicKey) {
  const tx = await contract.registerPublicKey(bytesToHex(publicKey));
  return await tx.wait();
}

/**
 * Fetch a user's messaging public key from the on-chain registry.
 *
 * @param {import('ethers').Contract} contract - Chainvoice contract instance
 * @param {string} userAddress - the address to look up
 * @returns {Promise<Uint8Array|null>} - the public key bytes, or null if not registered
 */
export async function fetchPublicKeyFromChain(contract, userAddress) {
  const keyHex = await contract.getPublicKey(userAddress);
  if (!keyHex || keyHex === '0x' || keyHex === '0x0' || keyHex.length <= 2) {
    return null;
  }

  const publicKey = hexToBytes(keyHex);
  // The current contract enforces this on registration, but an older or
  // misconfigured deployment need not. Failing here beats handing a malformed
  // key to eciesjs and surfacing its internal error instead.
  if (
    publicKey.length !== PUBLIC_KEY_BYTES ||
    publicKey[0] !== UNCOMPRESSED_PREFIX
  ) {
    throw new Error(
      `Registry returned a malformed public key for ${userAddress}: expected ${PUBLIC_KEY_BYTES} bytes starting 0x04, got ${publicKey.length} bytes`
    );
  }
  return publicKey;
}

export { hexToBytes, bytesToHex, DERIVATION_MESSAGE };
