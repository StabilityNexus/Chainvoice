import { getRelayClient } from './relayClient.js';
import { encryptPayload, tryDecryptPayload } from './invoiceCrypto.js';

const DEFAULT_POLL_INTERVAL_MS = 15_000;
const ENVELOPE_TYPE = 'invoice';

/**
 * Normalise an address for relay addressing.
 *
 * The relay looks messages up by exact string match, so a message sent to a
 * checksummed address is invisible to a client polling the lowercase form.
 * Every address crossing the relay boundary goes through here.
 *
 * @param {string} address
 * @returns {string}
 */
export function toMailboxAddress(address) {
  if (!address) throw new Error('Relay address is required');
  return address.toLowerCase();
}

/**
 * Build the envelope that gets encrypted and handed to the relay.
 *
 * @param {Object} invoiceData - plaintext invoice payload
 * @param {number|string} chainId
 * @param {number|string} invoiceId
 * @returns {Object}
 */
function buildEnvelope(invoiceData, chainId, invoiceId) {
  // Fail loudly here rather than shipping a broken envelope. A non-numeric
  // chainId becomes NaN, JSON-serialises to null, and never matches the
  // receiver's `Number(envelope.chainId) !== Number(chainId)` check — the
  // message would be encrypted, accepted by the relay, and silently ignored
  // forever, with the sender told it succeeded.
  // Positive check rather than just finite: Number(null) and Number('') are
  // both 0, which is finite but not a real chain.
  const numericChainId = Number(chainId);
  if (!Number.isFinite(numericChainId) || numericChainId <= 0) {
    throw new Error(`Invalid chainId for relay envelope: ${chainId}`);
  }
  if (invoiceId === null || invoiceId === undefined || invoiceId === '') {
    throw new Error('Invalid invoiceId for relay envelope');
  }

  return {
    type: ENVELOPE_TYPE,
    invoiceId: invoiceId.toString(),
    chainId: numericChainId,
    timestamp: Date.now(),
    data: invoiceData,
  };
}

/**
 * Encrypt an invoice for its recipient and post it to the relay.
 *
 * `invoiceData` must be exactly the object that was hashed into the
 * on-chain `invoiceDataHash`. The receiver recomputes the hash over what
 * arrives here and rejects it on mismatch, so any field added, dropped or
 * reordered on the way in will fail verification on the way out.
 *
 * @param {Object} params
 * @param {Object} params.invoiceData - plaintext invoice payload (as hashed)
 * @param {Uint8Array|string} params.receiverPublicKey - from the on-chain registry
 * @param {string} params.receiverAddress - recipient wallet address
 * @param {string} params.senderAddress - sender wallet address
 * @param {number|string} params.chainId
 * @param {number|string} params.invoiceId - on-chain invoice ID
 * @returns {Promise<import('@aossie-org/thrubox-client').Message>}
 */
export async function sendEncryptedInvoice({
  invoiceData,
  receiverPublicKey,
  receiverAddress,
  senderAddress,
  chainId,
  invoiceId,
}) {
  if (!receiverPublicKey) {
    throw new Error('Recipient has not registered a public key');
  }

  const envelope = buildEnvelope(invoiceData, chainId, invoiceId);
  const payload = encryptPayload(receiverPublicKey, envelope);

  return getRelayClient().send({
    to: toMailboxAddress(receiverAddress),
    from: toMailboxAddress(senderAddress),
    payload,
  });
}

/**
 * Decrypt the relay messages that belong to this user on this chain.
 *
 * Undecryptable messages are skipped: the mailbox is public, so anyone can
 * drop anything into it, and that is expected rather than exceptional.
 *
 * Nothing returned here is authenticated. The relay does not verify who
 * posted a message, and the envelope carries no sender signature — decrypting
 * successfully only proves the sender knew the recipient's public key, which
 * is published on-chain. Anyone can therefore deliver a well-formed envelope
 * claiming any sender and any contents.
 *
 * Callers must treat `claimedFrom` and `envelope.data` as untrusted until
 * `envelope.data` has been checked against the on-chain `invoiceDataHash` for
 * `envelope.invoiceId` (see verifyInvoiceHash). That check is what makes the
 * payload trustworthy, and it needs a chain read this module does not perform.
 *
 * @param {Array} messages - raw relay messages
 * @param {Uint8Array|string} privateKey
 * @param {number|string} chainId
 * @returns {Array<{messageId: string, claimedFrom: string, envelope: Object}>}
 */
function decodeMessages(messages, privateKey, chainId) {
  const decoded = [];
  for (const message of messages) {
    if (!message?.payload) continue;

    const envelope = tryDecryptPayload(privateKey, message.payload);
    if (!envelope) continue;

    if (envelope.type !== ENVELOPE_TYPE) continue;
    if (Number(envelope.chainId) !== Number(chainId)) continue;
    if (!envelope.invoiceId || !envelope.data) continue;

    decoded.push({
      messageId: message.id,
      // Relay metadata, set by whoever posted the message. Unverified.
      claimedFrom: message.from,
      envelope,
    });
  }
  return decoded;
}

/**
 * Fetch and decrypt every invoice currently waiting in the user's mailbox.
 *
 * Replaces the Waku Store query: the relay retains messages for its
 * configured TTL, so this is how a client catches up after being offline.
 *
 * @param {Object} params
 * @param {Uint8Array|string} params.privateKey
 * @param {string} params.address - the user's wallet address
 * @param {number|string} params.chainId
 * @returns {Promise<Array<{messageId: string, claimedFrom: string, envelope: Object}>>}
 */
export async function fetchInvoiceMessages({ privateKey, address, chainId }) {
  const messages = await getRelayClient().receive(toMailboxAddress(address));
  return decodeMessages(messages, privateKey, chainId);
}

/**
 * Poll the relay for new invoices.
 *
 * The relay has no cursor — every poll returns the full mailbox — so this
 * tracks the message IDs it has already surfaced and only invokes
 * `onInvoice` for ones it has not seen. Messages are deliberately left on
 * the relay until they expire, so a second device can still pick them up.
 *
 * @param {Object} params
 * @param {Uint8Array|string} params.privateKey
 * @param {string} params.address - the user's wallet address
 * @param {number|string} params.chainId
 * @param {(item: {messageId: string, claimedFrom: string, envelope: Object}) => void|Promise<void>} params.onInvoice
 * @param {(error: Error) => void} [params.onError]
 * @param {number} [params.intervalMs]
 * @param {Iterable<string>} [params.knownMessageIds] - IDs to treat as already seen
 * @returns {() => void} stop function
 */
export function pollInvoiceMessages({
  privateKey,
  address,
  chainId,
  onInvoice,
  onError,
  intervalMs = DEFAULT_POLL_INTERVAL_MS,
  knownMessageIds = [],
}) {
  const seen = new Set(knownMessageIds);
  let stopped = false;

  const stopPolling = getRelayClient().poll(
    toMailboxAddress(address),
    async (messages) => {
      if (stopped) return;
      for (const item of decodeMessages(messages, privateKey, chainId)) {
        if (stopped) return;
        if (seen.has(item.messageId)) continue;

        // Claim before awaiting, release if the handler fails. The SDK does
        // not await this callback before scheduling the next poll, so two
        // polls can overlap: claiming up front stops both from processing the
        // same message, and releasing on failure stops a transient error —
        // a failed IndexedDB write, say — from burying the invoice for good.
        seen.add(item.messageId);
        try {
          await onInvoice(item);
        } catch (err) {
          seen.delete(item.messageId);
          console.warn('[RelayInvoiceMessaging] onInvoice handler failed, will retry:', err);
        }
      }
    },
    {
      intervalMs,
      onError: (err) => {
        if (stopped) return;
        if (onError) onError(err);
        else console.warn('[RelayInvoiceMessaging] Poll failed:', err);
      },
    }
  );

  return () => {
    stopped = true;
    stopPolling();
  };
}

export { DEFAULT_POLL_INTERVAL_MS };
