import { ethers } from 'ethers';

const DERIVATION_MESSAGE = 'ChainVoice Waku Key Derivation v1';
const KEY_STORAGE_PREFIX = 'chainvoice_waku_keys_';

/** In-memory cache for derived keys (keyed by lowercase address). */
const memoryCache = new Map();

/**
 * Convert hex string to Uint8Array.
 * @param {string} hex
 * @returns {Uint8Array}
 */
function hexToBytes(hex) {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string (0x-prefixed).
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function bytesToHex(bytes) {
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Derive a Waku ECIES keypair from a wallet signature.
 *
 * The user signs a deterministic message, and we use keccak256 of the
 * signature as the 32-byte private key for secp256k1. This ensures the
 * same wallet always derives the same key pair.
 *
 * @param {import('ethers').Signer} signer - ethers v6 signer
 * @param {string} address - wallet address
 * @param {boolean} [rememberSession=true] - if true, cache keys in sessionStorage; if false, keep in memory only
 * @returns {Promise<{privateKey: Uint8Array, publicKey: Uint8Array}>}
 */
export async function deriveWakuKeyPair(signer, address, rememberSession = true) {
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

  // Sign deterministic message to derive keys
  const signature = await signer.signMessage(DERIVATION_MESSAGE);

  // Use keccak256 of the raw signature bytes as the private key (32 bytes)
  const privateKeyHex = ethers.keccak256(signature);
  const privateKey = hexToBytes(privateKeyHex);

  // Derive uncompressed public key (65 bytes: 0x04 + x + y)
  const signingKey = new ethers.SigningKey(privateKeyHex);
  const publicKeyHex = signingKey.publicKey;
  const publicKey = hexToBytes(publicKeyHex);

  const keyPair = { privateKey, publicKey };

  // Always store in memory cache
  setMemoryCachedKeys(address, keyPair);

  // Optionally persist to sessionStorage
  if (rememberSession) {
    cacheKeysToSession(address, privateKey, publicKey);
  }

  return keyPair;
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
    console.warn('[WakuKeyManager] Failed to cache keys:', e);
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
    return {
      privateKey: hexToBytes(data.privateKey),
      publicKey: hexToBytes(data.publicKey),
    };
  } catch {
    return null;
  }
}

/**
 * Clear cached keys for a given address from both memory and sessionStorage.
 * @param {string} address
 */
export function clearCachedKeys(address) {
  const key = address.toLowerCase();
  memoryCache.delete(key);
  try {
    sessionStorage.removeItem(KEY_STORAGE_PREFIX + key);
  } catch {
    // Ignore errors (e.g. SSR environments)
  }
}

/**
 * Register the user's Waku public key on-chain.
 *
 * @param {import('ethers').Contract} contract - Chainvoice contract instance
 * @param {Uint8Array} publicKey - the user's Waku public key
 * @returns {Promise<import('ethers').TransactionReceipt>}
 */
export async function registerPublicKeyOnChain(contract, publicKey) {
  const tx = await contract.registerWakuPublicKey(bytesToHex(publicKey));
  return await tx.wait();
}

/**
 * Fetch a user's Waku public key from the on-chain registry.
 *
 * @param {import('ethers').Contract} contract - Chainvoice contract instance
 * @param {string} userAddress - the address to look up
 * @returns {Promise<Uint8Array|null>} - the public key bytes, or null if not registered
 */
export async function fetchPublicKeyFromChain(contract, userAddress) {
  const keyHex = await contract.getWakuPublicKey(userAddress);
  if (!keyHex || keyHex === '0x' || keyHex === '0x0' || keyHex.length <= 2) {
    return null;
  }
  return hexToBytes(keyHex);
}

/**
 * Check if the keys are already cached in memory or session storage.
 * @param {string} address
 * @returns {boolean}
 */
export function hasCachedKeys(address) {
  if (!address) return false;
  if (getMemoryCachedKeys(address)) return true;
  if (getSessionCachedKeys(address)) return true;
  return false;
}

export { hexToBytes, bytesToHex, DERIVATION_MESSAGE };
