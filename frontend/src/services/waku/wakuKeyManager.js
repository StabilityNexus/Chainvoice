import { ethers } from 'ethers';

const DERIVATION_MESSAGE = 'ChainVoice Waku Key Derivation v1';
const KEY_STORAGE_PREFIX = 'chainvoice_waku_keys_';

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
 * @returns {Promise<{privateKey: Uint8Array, publicKey: Uint8Array}>}
 */
export async function deriveWakuKeyPair(signer, address) {
  // Check session storage first for cached keys
  const cached = getCachedKeys(address);
  if (cached) return cached;

  // Sign deterministic message to derive keys
  const signature = await signer.signMessage(DERIVATION_MESSAGE);

  // Use keccak256 of the raw signature bytes as the private key (32 bytes)
  const privateKeyHex = ethers.keccak256(signature);
  const privateKey = hexToBytes(privateKeyHex);

  // Derive uncompressed public key (65 bytes: 0x04 + x + y)
  const signingKey = new ethers.SigningKey(privateKeyHex);
  const publicKeyHex = signingKey.publicKey;
  const publicKey = hexToBytes(publicKeyHex);

  // Cache in sessionStorage (cleared on browser/tab close)
  cacheKeys(address, privateKey, publicKey);

  return { privateKey, publicKey };
}

/**
 * Cache derived keys in sessionStorage for the current session.
 * @param {string} address
 * @param {Uint8Array} privateKey
 * @param {Uint8Array} publicKey
 */
function cacheKeys(address, privateKey, publicKey) {
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
function getCachedKeys(address) {
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

export { hexToBytes, bytesToHex, DERIVATION_MESSAGE };
