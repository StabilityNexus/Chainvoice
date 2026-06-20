import { createEncoder, createDecoder } from '@waku/message-encryption/ecies';
import { wakuService } from './wakuService.js';

/**
 * Get the Waku content topic for invoice messages on a given chain.
 * Content topics are namespaced per chain to avoid cross-chain collisions.
 *
 * @param {number} chainId
 * @returns {string}
 */
export function getContentTopic(chainId) {
  return `/chainvoice/1/invoice-${chainId}/proto`;
}

/**
 * Send encrypted invoice data over the Waku network.
 *
 * The sender encrypts the invoice payload with the receiver's ECIES public key
 * and pushes it to the Waku relay network via LightPush.
 *
 * @param {Object} invoiceData - the plaintext invoice data object
 * @param {Uint8Array} receiverPublicKey - receiver's Waku ECIES public key
 * @param {number} chainId - chain ID for content topic routing
 * @param {number|string} invoiceId - on-chain invoice ID for message correlation
 * @returns {Promise<Object>} - LightPush result
 */
export async function sendEncryptedInvoice(
  invoiceData,
  receiverPublicKey,
  chainId,
  invoiceId
) {
  const node = await wakuService.initialize();
  const contentTopic = getContentTopic(chainId);

  // Wrap invoice with metadata for the receiver
  const message = {
    type: 'invoice',
    invoiceId: invoiceId.toString(),
    chainId: chainId,
    timestamp: Date.now(),
    data: invoiceData,
  };

  const encoder = createEncoder({
    contentTopic,
    publicKey: receiverPublicKey,
  });

  const payload = new TextEncoder().encode(
    JSON.stringify(message, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  );

  const result = await node.lightPush.send(encoder, { payload });
  if (import.meta.env.DEV) console.log('[WakuInvoiceMessaging] Invoice sent via Waku:', result);
  return result;
}

/**
 * Subscribe to incoming invoice messages (encrypted for this user).
 *
 * Uses Waku Filter protocol to receive real-time messages that can be
 * decrypted with the provided private key.
 *
 * @param {Uint8Array} privateKey - the user's Waku private key for decryption
 * @param {number} chainId - chain ID for content topic routing
 * @param {function} onMessage - callback(decodedMessage) called for each invoice
 * @returns {Promise<function>} - unsubscribe function
 */
export async function subscribeToInvoices(privateKey, chainId, onMessage) {
  const node = await wakuService.initialize();
  const contentTopic = getContentTopic(chainId);

  const decoder = createDecoder(contentTopic, privateKey);

  let unsubscribe;
  try {
    unsubscribe = await node.filter.subscribe([decoder], async (wakuMessage) => {
      try {
        if (!wakuMessage.payload) return;
        const text = new TextDecoder().decode(wakuMessage.payload);
        const parsed = JSON.parse(text);
        if (import.meta.env.DEV) console.log('[WakuInvoiceMessaging] Received invoice message:', parsed);
        await onMessage(parsed);
      } catch (err) {
        console.warn(
          '[WakuInvoiceMessaging] Failed to parse incoming message:',
          err.message
        );
      }
    });
  } catch (err) {
    // Stream creation failures (peer disconnects, timeouts) are non-fatal
    console.warn(
      '[WakuInvoiceMessaging] Filter subscription failed (will work without real-time updates):',
      err.message
    );
    // Return a no-op unsubscribe so callers don't break
    return () => {};
  }

  console.log(
    '[WakuInvoiceMessaging] Subscribed to invoices on chain',
    chainId
  );
  return unsubscribe;
}

/**
 * Query the Waku Store for historical invoice messages.
 *
 * Used when the user opens the app and needs to retrieve messages
 * that were sent while they were offline.
 *
 * @param {Uint8Array} privateKey - the user's Waku private key for decryption
 * @param {number} chainId - chain ID for content topic routing
 * @returns {Promise<Array>} - array of decoded invoice message objects
 */
export async function queryStoredInvoices(privateKey, chainId) {
  const node = await wakuService.initialize();
  const contentTopic = getContentTopic(chainId);

  const decoder = createDecoder(contentTopic, privateKey);
  const messages = [];

  for await (const msgPromises of node.store.queryGenerator([decoder])) {
    for (const promise of msgPromises) {
      try {
        const msg = await promise;
        if (msg?.payload) {
          const text = new TextDecoder().decode(msg.payload);
          const parsed = JSON.parse(text);
          messages.push(parsed);
        }
      } catch (err) {
        console.warn(
          '[WakuInvoiceMessaging] Failed to process stored message:',
          err.message
        );
      }
    }
  }

  console.log(
    `[WakuInvoiceMessaging] Found ${messages.length} stored invoices for chain ${chainId}`
  );
  return messages;
}
