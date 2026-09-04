import { encrypt, decrypt } from 'eciesjs';

/**
 * End-to-end encryption for invoice payloads.
 *
 * The relay is a dumb mailbox: it stores an opaque base64 blob and never
 * sees plaintext. Confidentiality comes entirely from this module.
 *
 * Scheme: ECIES over secp256k1 (ephemeral ECDH -> HKDF-SHA256 -> AES-256-GCM),
 * the same primitive and the same 65-byte uncompressed public keys used by
 * the on-chain key registry, so registered keys keep working unchanged.
 */

/** Encode bytes as base64 without blowing the stack on large payloads. */
function bytesToBase64(bytes) {
  const CHUNK = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(
      null,
      bytes.subarray(i, i + CHUNK)
    );
  }
  return btoa(binary);
}

/** Decode a base64 string back into bytes. */
function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypt a JSON-serialisable value for a recipient's public key.
 *
 * @param {Uint8Array|string} publicKey - recipient's secp256k1 public key
 *   (65-byte uncompressed bytes, or 0x-prefixed hex)
 * @param {*} value - any JSON-serialisable value; bigints are stringified
 * @returns {string} base64 ciphertext, ready to hand to the relay
 */
export function encryptPayload(publicKey, value) {
  const json = JSON.stringify(value, (_, v) =>
    typeof v === 'bigint' ? v.toString() : v
  );
  const ciphertext = encrypt(publicKey, new TextEncoder().encode(json));
  return bytesToBase64(ciphertext);
}

/**
 * Decrypt a base64 ciphertext produced by {@link encryptPayload}.
 *
 * Throws if the payload was not encrypted for this key — callers polling a
 * public mailbox should treat a throw as "not for me" and move on.
 *
 * @param {Uint8Array|string} privateKey - recipient's 32-byte private key
 * @param {string} base64Ciphertext
 * @returns {*} the decrypted value
 */
export function decryptPayload(privateKey, base64Ciphertext) {
  const plaintext = decrypt(privateKey, base64ToBytes(base64Ciphertext));
  return JSON.parse(new TextDecoder().decode(plaintext));
}

/**
 * Attempt decryption, returning null instead of throwing.
 *
 * The relay mailbox is world-readable and world-writable, so a polling
 * client routinely encounters messages it cannot decrypt: junk from other
 * senders, or invoices encrypted to a key the user has since rotated.
 * Those are normal, not errors.
 *
 * @param {Uint8Array|string} privateKey
 * @param {string} base64Ciphertext
 * @returns {*|null}
 */
export function tryDecryptPayload(privateKey, base64Ciphertext) {
  try {
    return decryptPayload(privateKey, base64Ciphertext);
  } catch {
    return null;
  }
}

export { bytesToBase64, base64ToBytes };
