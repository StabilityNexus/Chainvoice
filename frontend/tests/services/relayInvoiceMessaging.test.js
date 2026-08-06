import { jest } from "@jest/globals";
import { ethers } from "ethers";

// relayClient.js reads import.meta.env, which Jest cannot evaluate, and we want
// a fake transport anyway — so stub the whole module before importing the SUT.
const relayApi = {
  send: jest.fn(),
  receive: jest.fn(),
  poll: jest.fn(),
};

jest.unstable_mockModule("../../src/services/relay/relayClient.js", () => ({
  getRelayClient: () => relayApi,
  RELAY_PROXY_PATH: "/relay",
}));

const { encryptPayload, decryptPayload } = await import(
  "../../src/services/relay/invoiceCrypto.js"
);
const {
  sendEncryptedInvoice,
  fetchInvoiceMessages,
  pollInvoiceMessages,
  toMailboxAddress,
  DEFAULT_POLL_INTERVAL_MS,
} = await import("../../src/services/relay/relayInvoiceMessaging.js");

function keyPairFrom(seed) {
  const privateKey = ethers.keccak256(ethers.toUtf8Bytes(seed));
  return { privateKey, publicKey: new ethers.SigningKey(privateKey).publicKey };
}

const receiver = keyPairFrom("receiver");
const stranger = keyPairFrom("stranger");

const RECEIVER_ADDR = "0xF37B0B9f97e3B3a843d75Ef37F4eE8568590C900";
const SENDER_ADDR = "0x69fF0f180e74112cF707DdDEC729095631c4B809";
const CHAIN_ID = 11155111;

const invoiceData = { amountDue: "125.5", client: { email: "bob@example.com" } };

/** Build a relay message carrying an envelope encrypted for `publicKey`. */
function relayMessage(id, publicKey, overrides = {}) {
  const envelope = {
    type: "invoice",
    invoiceId: "7",
    chainId: CHAIN_ID,
    timestamp: 1,
    data: invoiceData,
    ...overrides,
  };
  return {
    id,
    to: toMailboxAddress(RECEIVER_ADDR),
    from: toMailboxAddress(SENDER_ADDR),
    payload: encryptPayload(publicKey, envelope),
  };
}

beforeEach(() => {
  relayApi.send.mockReset();
  relayApi.receive.mockReset();
  relayApi.poll.mockReset();
});

describe("toMailboxAddress", () => {
  it("lowercases addresses so relay lookups match", () => {
    // The relay matches `to` by exact string, so a checksummed address would
    // be invisible to a client polling the lowercase form.
    expect(toMailboxAddress(RECEIVER_ADDR)).toBe(RECEIVER_ADDR.toLowerCase());
  });

  it.each(["", null, undefined])("throws on a missing address (%p)", (value) => {
    expect(() => toMailboxAddress(value)).toThrow(/address is required/i);
  });
});

describe("sendEncryptedInvoice", () => {
  it("posts a ciphertext addressed to lowercased participants", async () => {
    relayApi.send.mockResolvedValue({ id: "msg-1" });

    await sendEncryptedInvoice({
      invoiceData,
      receiverPublicKey: receiver.publicKey,
      receiverAddress: RECEIVER_ADDR,
      senderAddress: SENDER_ADDR,
      chainId: CHAIN_ID,
      invoiceId: 7,
    });

    expect(relayApi.send).toHaveBeenCalledTimes(1);
    const sent = relayApi.send.mock.calls[0][0];
    expect(sent.to).toBe(RECEIVER_ADDR.toLowerCase());
    expect(sent.from).toBe(SENDER_ADDR.toLowerCase());
    expect(sent.payload).not.toContain("bob@example.com");

    // Assert the envelope the send path actually built, rather than trusting
    // the fixture to mirror it — the receiver's chain filter and dedupe key
    // both depend on these exact fields.
    const envelope = decryptPayload(receiver.privateKey, sent.payload);
    expect(envelope).toMatchObject({
      type: "invoice",
      invoiceId: "7",
      chainId: CHAIN_ID,
      data: invoiceData,
    });
    expect(typeof envelope.invoiceId).toBe("string");
    expect(typeof envelope.timestamp).toBe("number");
  });

  // A NaN chainId serialises to null and never matches the receiver's chain
  // filter, so the message would be accepted by the relay and silently
  // discarded forever while the sender is told it succeeded.
  it.each([undefined, null, "not-a-chain", NaN])(
    "refuses to build an envelope with chainId %p",
    async (chainId) => {
      await expect(
        sendEncryptedInvoice({
          invoiceData,
          receiverPublicKey: receiver.publicKey,
          receiverAddress: RECEIVER_ADDR,
          senderAddress: SENDER_ADDR,
          chainId,
          invoiceId: 7,
        })
      ).rejects.toThrow(/chainId/i);
      expect(relayApi.send).not.toHaveBeenCalled();
    }
  );

  it.each([undefined, null, ""])(
    "refuses to build an envelope with invoiceId %p",
    async (invoiceId) => {
      await expect(
        sendEncryptedInvoice({
          invoiceData,
          receiverPublicKey: receiver.publicKey,
          receiverAddress: RECEIVER_ADDR,
          senderAddress: SENDER_ADDR,
          chainId: CHAIN_ID,
          invoiceId,
        })
      ).rejects.toThrow(/invoiceId/i);
      expect(relayApi.send).not.toHaveBeenCalled();
    }
  );

  it("accepts invoice id 0", async () => {
    // Falsy but valid — the contract numbers the first invoice 0.
    relayApi.send.mockResolvedValue({ id: "msg-1" });
    await sendEncryptedInvoice({
      invoiceData,
      receiverPublicKey: receiver.publicKey,
      receiverAddress: RECEIVER_ADDR,
      senderAddress: SENDER_ADDR,
      chainId: CHAIN_ID,
      invoiceId: 0,
    });
    expect(relayApi.send).toHaveBeenCalledTimes(1);
  });

  it("refuses to send without a recipient key", async () => {
    await expect(
      sendEncryptedInvoice({
        invoiceData,
        receiverPublicKey: null,
        receiverAddress: RECEIVER_ADDR,
        senderAddress: SENDER_ADDR,
        chainId: CHAIN_ID,
        invoiceId: 7,
      })
    ).rejects.toThrow(/public key/i);
    expect(relayApi.send).not.toHaveBeenCalled();
  });
});

describe("fetchInvoiceMessages", () => {
  it("decrypts messages addressed to this key", async () => {
    relayApi.receive.mockResolvedValue([relayMessage("m1", receiver.publicKey)]);

    const result = await fetchInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
    });

    expect(result).toHaveLength(1);
    expect(result[0].messageId).toBe("m1");
    expect(result[0].envelope.data).toEqual(invoiceData);
  });

  it("queries the lowercased mailbox", async () => {
    relayApi.receive.mockResolvedValue([]);
    await fetchInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
    });
    expect(relayApi.receive).toHaveBeenCalledWith(RECEIVER_ADDR.toLowerCase());
  });

  it("skips messages it cannot decrypt", async () => {
    relayApi.receive.mockResolvedValue([
      relayMessage("m1", stranger.publicKey),
      { id: "m2", payload: "junk" },
      { id: "m3" },
      relayMessage("m4", receiver.publicKey),
    ]);

    const result = await fetchInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
    });

    expect(result.map((r) => r.messageId)).toEqual(["m4"]);
  });

  it("filters out other chains", async () => {
    relayApi.receive.mockResolvedValue([
      relayMessage("m1", receiver.publicKey, { chainId: 137 }),
      relayMessage("m2", receiver.publicKey),
    ]);

    const result = await fetchInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
    });

    expect(result.map((r) => r.messageId)).toEqual(["m2"]);
  });

  it("ignores envelopes of an unknown type or shape", async () => {
    relayApi.receive.mockResolvedValue([
      relayMessage("m1", receiver.publicKey, { type: "something-else" }),
      relayMessage("m2", receiver.publicKey, { data: undefined }),
      relayMessage("m3", receiver.publicKey, { invoiceId: undefined }),
    ]);

    const result = await fetchInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
    });

    expect(result).toEqual([]);
  });
});

describe("pollInvoiceMessages", () => {
  /** Capture the callback and options the SDK's poll() would receive. */
  function capturePoll() {
    let onMessages;
    let options;
    const stop = jest.fn();
    relayApi.poll.mockImplementation((address, cb, opts) => {
      onMessages = cb;
      options = opts;
      return stop;
    });
    return {
      pump: (msgs) => onMessages(msgs),
      stop,
      getOptions: () => options,
    };
  }

  it("forwards intervalMs to the SDK", () => {
    const { getOptions } = capturePoll();
    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice: jest.fn(),
      intervalMs: 5000,
    });
    expect(getOptions().intervalMs).toBe(5000);
  });

  it("defaults intervalMs when not given", () => {
    const { getOptions } = capturePoll();
    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice: jest.fn(),
    });
    expect(getOptions().intervalMs).toBe(DEFAULT_POLL_INTERVAL_MS);
  });

  it("delegates poll failures to onError", () => {
    const { getOptions } = capturePoll();
    const onError = jest.fn();
    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice: jest.fn(),
      onError,
    });

    const failure = new Error("relay unreachable");
    getOptions().onError(failure);

    expect(onError).toHaveBeenCalledWith(failure);
  });

  it("suppresses errors raised after stopping", () => {
    const { getOptions } = capturePoll();
    const onError = jest.fn();
    const stopPolling = pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice: jest.fn(),
      onError,
    });

    stopPolling();
    getOptions().onError(new Error("in flight when stopped"));

    expect(onError).not.toHaveBeenCalled();
  });

  it("emits each message only once across polls", async () => {
    const { pump } = capturePoll();
    const onInvoice = jest.fn();

    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
    });

    // The relay has no cursor, so every poll returns the whole mailbox.
    const batch = [relayMessage("m1", receiver.publicKey)];
    await pump(batch);
    await pump(batch);

    expect(onInvoice).toHaveBeenCalledTimes(1);
  });

  it("emits newly arrived messages on a later poll", async () => {
    const { pump } = capturePoll();
    const onInvoice = jest.fn();

    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
    });

    await pump([relayMessage("m1", receiver.publicKey)]);
    await pump([
      relayMessage("m1", receiver.publicKey),
      relayMessage("m2", receiver.publicKey),
    ]);

    expect(onInvoice).toHaveBeenCalledTimes(2);
    expect(onInvoice.mock.calls[1][0].messageId).toBe("m2");
  });

  it("honours knownMessageIds so stored invoices are not re-announced", async () => {
    const { pump } = capturePoll();
    const onInvoice = jest.fn();

    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
      knownMessageIds: ["m1"],
    });

    await pump([relayMessage("m1", receiver.publicKey)]);
    expect(onInvoice).not.toHaveBeenCalled();
  });

  it("stops emitting after the stop function is called", async () => {
    const { pump, stop } = capturePoll();
    const onInvoice = jest.fn();

    const stopPolling = pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
    });

    stopPolling();
    await pump([relayMessage("m1", receiver.publicKey)]);

    expect(stop).toHaveBeenCalled();
    expect(onInvoice).not.toHaveBeenCalled();
  });

  it("does not double-process when two polls overlap", async () => {
    // The SDK calls the poll callback without awaiting it before scheduling the
    // next tick, so two cycles can run concurrently over the same mailbox. The
    // messageId is claimed before the handler is awaited precisely so the
    // second cycle skips it; without that, this delivers twice.
    const { pump } = capturePoll();
    let releaseHandler;
    const handlerStarted = new Promise((resolve) => {
      releaseHandler = resolve;
    });
    const onInvoice = jest.fn(() => handlerStarted);

    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
    });

    const batch = [relayMessage("m1", receiver.publicKey)];
    // Start both cycles before letting the first handler finish.
    const first = pump(batch);
    const second = pump(batch);
    releaseHandler();
    await Promise.all([first, second]);

    expect(onInvoice).toHaveBeenCalledTimes(1);
  });

  it("retries a message whose handler threw", async () => {
    // A transient failure — a rejected IndexedDB write, say — must not bury
    // the invoice. The message stays unclaimed so the next poll re-delivers it.
    const { pump } = capturePoll();
    const onInvoice = jest
      .fn()
      .mockRejectedValueOnce(new Error("indexeddb blew up"))
      .mockResolvedValue(undefined);

    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
    });

    await pump([relayMessage("m1", receiver.publicKey)]);
    await pump([relayMessage("m1", receiver.publicKey)]);

    const delivered = onInvoice.mock.calls.map((c) => c[0].messageId);
    expect(delivered).toEqual(["m1", "m1"]);
  });

  it("does not re-deliver once the handler finally succeeds", async () => {
    const { pump } = capturePoll();
    const onInvoice = jest
      .fn()
      .mockRejectedValueOnce(new Error("transient"))
      .mockResolvedValue(undefined);

    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
    });

    const batch = [relayMessage("m1", receiver.publicKey)];
    await pump(batch); // fails, released
    await pump(batch); // succeeds, claimed
    await pump(batch); // already seen

    expect(onInvoice.mock.calls.map((c) => c[0].messageId)).toEqual(["m1", "m1"]);
  });

  it("stops mid-batch when the stop function is called from a handler", async () => {
    // pollInvoiceMessages re-checks `stopped` inside the message loop; without
    // that, the rest of the batch is still delivered after teardown.
    const { pump } = capturePoll();
    let stopPolling;
    const onInvoice = jest.fn(() => {
      stopPolling();
    });

    stopPolling = pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
    });

    await pump([
      relayMessage("m1", receiver.publicKey),
      relayMessage("m2", receiver.publicKey),
      relayMessage("m3", receiver.publicKey),
    ]);

    expect(onInvoice).toHaveBeenCalledTimes(1);
    expect(onInvoice.mock.calls[0][0].messageId).toBe("m1");
  });

  it("keeps processing later messages after one handler throws", async () => {
    const { pump } = capturePoll();
    const onInvoice = jest
      .fn()
      .mockRejectedValueOnce(new Error("indexeddb blew up"))
      .mockResolvedValue(undefined);

    pollInvoiceMessages({
      privateKey: receiver.privateKey,
      address: RECEIVER_ADDR,
      chainId: CHAIN_ID,
      onInvoice,
    });

    await pump([
      relayMessage("m1", receiver.publicKey),
      relayMessage("m2", receiver.publicKey),
    ]);

    expect(onInvoice.mock.calls.map((c) => c[0].messageId)).toEqual(["m1", "m2"]);
  });
});
