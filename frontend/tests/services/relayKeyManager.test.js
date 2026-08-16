import { jest } from "@jest/globals";
import { ethers } from "ethers";
import {
  deriveRelayKeyPair,
  clearCachedKeys,
  hasCachedKeys,
  fetchPublicKeyFromChain,
  registerPublicKeyOnChain,
  hexToBytes,
  bytesToHex,
  DERIVATION_MESSAGE,
} from "../../src/services/relay/relayKeyManager.js";

const ADDRESS = "0x69fF0f180e74112cF707DdDEC729095631c4B809";

/** Minimal sessionStorage stand-in; jsdom is not configured for these tests. */
function installSessionStorage() {
  const store = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    _store: store,
  };
  return store;
}

/** A signer that records how many times it was asked to sign. */
function makeSigner() {
  const wallet = new ethers.Wallet(
    ethers.keccak256(ethers.toUtf8Bytes("test-wallet"))
  );
  const signMessage = jest.fn((msg) => wallet.signMessage(msg));
  return { signMessage };
}

let store;
beforeEach(() => {
  store = installSessionStorage();
  clearCachedKeys(ADDRESS);
});

describe("deriveRelayKeyPair", () => {
  it("derives a 65-byte uncompressed key the contract will accept", async () => {
    // The registry rejects anything that is not 65 bytes starting 0x04.
    const { publicKey } = await deriveRelayKeyPair(makeSigner(), ADDRESS);
    expect(publicKey).toHaveLength(65);
    expect(publicKey[0]).toBe(0x04);
  });

  it("derives the same keypair for the same wallet", async () => {
    const a = await deriveRelayKeyPair(makeSigner(), ADDRESS);
    clearCachedKeys(ADDRESS);
    const b = await deriveRelayKeyPair(makeSigner(), ADDRESS);
    expect(bytesToHex(a.publicKey)).toBe(bytesToHex(b.publicKey));
  });

  it("signs exactly once, then serves from the memory cache", async () => {
    const signer = makeSigner();
    await deriveRelayKeyPair(signer, ADDRESS);
    await deriveRelayKeyPair(signer, ADDRESS);
    expect(signer.signMessage).toHaveBeenCalledTimes(1);
  });

  it("signs the documented derivation message", async () => {
    const signer = makeSigner();
    await deriveRelayKeyPair(signer, ADDRESS);
    expect(signer.signMessage).toHaveBeenCalledWith(DERIVATION_MESSAGE);
  });

  it("treats addresses case-insensitively", async () => {
    const signer = makeSigner();
    await deriveRelayKeyPair(signer, ADDRESS);
    await deriveRelayKeyPair(signer, ADDRESS.toLowerCase());
    expect(signer.signMessage).toHaveBeenCalledTimes(1);
  });
});

describe("session persistence", () => {
  // Regression: keys used to be memory-only by default, so a page reload lost
  // the private key. Anything gated on key availability — notably relay
  // polling — then never restarted, and the inbox silently stopped working.

  it("survives a reload when rememberSession is set", async () => {
    await deriveRelayKeyPair(makeSigner(), ADDRESS, true);

    // Simulate a reload: module memory is gone, sessionStorage is not.
    jest.resetModules();
    const reloaded = await import("../../src/services/relay/relayKeyManager.js");

    expect(reloaded.hasCachedKeys(ADDRESS)).toBe(true);
  });

  it("does not survive a reload when rememberSession is not set", async () => {
    await deriveRelayKeyPair(makeSigner(), ADDRESS, false);

    jest.resetModules();
    const reloaded = await import("../../src/services/relay/relayKeyManager.js");

    expect(reloaded.hasCachedKeys(ADDRESS)).toBe(false);
  });

  it("restores the identical key from session cache without signing again", async () => {
    const original = await deriveRelayKeyPair(makeSigner(), ADDRESS, true);

    jest.resetModules();
    const reloaded = await import("../../src/services/relay/relayKeyManager.js");

    const signer = makeSigner();
    const restored = await reloaded.deriveRelayKeyPair(signer, ADDRESS, true);

    expect(signer.signMessage).not.toHaveBeenCalled();
    expect(bytesToHex(restored.privateKey)).toBe(bytesToHex(original.privateKey));
    expect(bytesToHex(restored.publicKey)).toBe(bytesToHex(original.publicKey));
  });

  it("keys the session entry by address so accounts do not collide", async () => {
    const other = "0x6F7458D1c14F4153A4092Af4f3A521111Bc04C59";
    await deriveRelayKeyPair(makeSigner(), ADDRESS, true);

    expect(hasCachedKeys(ADDRESS)).toBe(true);
    expect([...store.keys()].some((k) => k.includes(ADDRESS.toLowerCase()))).toBe(true);
    expect([...store.keys()].some((k) => k.includes(other.toLowerCase()))).toBe(false);
  });

  it("clearCachedKeys wipes both memory and session", async () => {
    await deriveRelayKeyPair(makeSigner(), ADDRESS, true);
    expect(hasCachedKeys(ADDRESS)).toBe(true);

    clearCachedKeys(ADDRESS);

    expect(hasCachedKeys(ADDRESS)).toBe(false);
    expect(store.size).toBe(0);
  });

  it("ignores a corrupted session entry rather than throwing", async () => {
    await deriveRelayKeyPair(makeSigner(), ADDRESS, true);
    const key = [...store.keys()][0];
    store.set(key, "not json");

    jest.resetModules();
    const reloaded = await import("../../src/services/relay/relayKeyManager.js");
    expect(reloaded.hasCachedKeys(ADDRESS)).toBe(false);
  });
});

describe("fetchPublicKeyFromChain", () => {
  // This decides whether the sender encrypts a payload or falls back to the
  // on-chain summary, so every "unregistered" shape has to be recognised.
  const contractReturning = (value) => ({
    getWakuPublicKey: jest.fn().mockResolvedValue(value),
  });

  it.each(["0x", "0x0", ""])(
    "treats %p as unregistered",
    async (value) => {
      expect(
        await fetchPublicKeyFromChain(contractReturning(value), ADDRESS)
      ).toBeNull();
    }
  );

  it.each([null, undefined])("treats %p as unregistered", async (value) => {
    expect(
      await fetchPublicKeyFromChain(contractReturning(value), ADDRESS)
    ).toBeNull();
  });

  it("returns the key bytes when one is registered", async () => {
    const { publicKey } = await deriveRelayKeyPair(makeSigner(), ADDRESS);
    const hex = bytesToHex(publicKey);

    const result = await fetchPublicKeyFromChain(contractReturning(hex), ADDRESS);

    expect(result).toEqual(publicKey);
    expect(result).toHaveLength(65);
  });

  it.each([
    ["too short", "0x04aabbcc"],
    ["wrong prefix", "0x03" + "11".repeat(64)],
    ["too long", "0x04" + "11".repeat(70)],
  ])("throws on a malformed registry key (%s)", async (_label, value) => {
    await expect(
      fetchPublicKeyFromChain(contractReturning(value), ADDRESS)
    ).rejects.toThrow(/malformed public key/i);
  });

  it("looks up the address it was given", async () => {
    const contract = contractReturning("0x");
    await fetchPublicKeyFromChain(contract, ADDRESS);
    expect(contract.getWakuPublicKey).toHaveBeenCalledWith(ADDRESS);
  });
});

describe("registerPublicKeyOnChain", () => {
  it("submits the key as hex and waits for the receipt", async () => {
    const { publicKey } = await deriveRelayKeyPair(makeSigner(), ADDRESS);
    const wait = jest.fn().mockResolvedValue({ status: 1 });
    const contract = {
      registerWakuPublicKey: jest.fn().mockResolvedValue({ wait }),
    };

    const receipt = await registerPublicKeyOnChain(contract, publicKey);

    expect(contract.registerWakuPublicKey).toHaveBeenCalledWith(bytesToHex(publicKey));
    expect(wait).toHaveBeenCalled();
    expect(receipt).toEqual({ status: 1 });
  });

  it("submits a 65-byte 0x04-prefixed key, as the contract requires", async () => {
    const { publicKey } = await deriveRelayKeyPair(makeSigner(), ADDRESS);
    const contract = {
      registerWakuPublicKey: jest
        .fn()
        .mockResolvedValue({ wait: jest.fn().mockResolvedValue({}) }),
    };

    await registerPublicKeyOnChain(contract, publicKey);

    const submitted = contract.registerWakuPublicKey.mock.calls[0][0];
    expect(submitted).toMatch(/^0x04[0-9a-f]{128}$/);
  });
});

describe("malformed cache entries", () => {
  // The corrupted entry has to survive into the read path. clearCachedKeys
  // cannot be used to reset here: it calls sessionStorage.removeItem, which
  // deletes the entry before the assertion, so the test would pass on
  // "nothing stored" rather than on the size checks rejecting it.
  const corruptThenReload = async (value) => {
    const key = [...store.keys()][0];
    store.set(key, JSON.stringify(value));
    jest.resetModules();
    return import("../../src/services/relay/relayKeyManager.js");
  };

  it("rejects a truncated private key", async () => {
    const { publicKey } = await deriveRelayKeyPair(makeSigner(), ADDRESS, true);
    const reloaded = await corruptThenReload({
      privateKey: "0xdeadbeef",
      publicKey: bytesToHex(publicKey),
    });
    expect(reloaded.hasCachedKeys(ADDRESS)).toBe(false);
  });

  it("rejects a truncated public key", async () => {
    const { privateKey } = await deriveRelayKeyPair(makeSigner(), ADDRESS, true);
    const reloaded = await corruptThenReload({
      privateKey: bytesToHex(privateKey),
      publicKey: "0x04aabb",
    });
    expect(reloaded.hasCachedKeys(ADDRESS)).toBe(false);
  });

  it("rejects a public key without the uncompressed prefix", async () => {
    const { privateKey, publicKey } = await deriveRelayKeyPair(
      makeSigner(),
      ADDRESS,
      true
    );
    const wrongPrefix = new Uint8Array(publicKey);
    wrongPrefix[0] = 0x03;
    const reloaded = await corruptThenReload({
      privateKey: bytesToHex(privateKey),
      publicKey: bytesToHex(wrongPrefix),
    });
    expect(reloaded.hasCachedKeys(ADDRESS)).toBe(false);
  });

  it("accepts a well-formed entry, proving the checks are not blanket-rejecting", async () => {
    const { privateKey, publicKey } = await deriveRelayKeyPair(
      makeSigner(),
      ADDRESS,
      true
    );
    const reloaded = await corruptThenReload({
      privateKey: bytesToHex(privateKey),
      publicKey: bytesToHex(publicKey),
    });
    expect(reloaded.hasCachedKeys(ADDRESS)).toBe(true);
  });

  it("drops the bad entry so the next call re-derives", async () => {
    await deriveRelayKeyPair(makeSigner(), ADDRESS, true);
    const reloaded = await corruptThenReload({
      privateKey: "0xdeadbeef",
      publicKey: "0x04aabb",
    });

    expect(reloaded.getCachedKeyPair(ADDRESS)).toBeNull();
    expect(store.size).toBe(0);
  });
});

describe("concurrent derivation", () => {
  it("shares one signature prompt between concurrent callers", async () => {
    // Two components can ask for the key at once; the in-flight promise is
    // shared so the user is not asked to sign twice.
    let complete;
    const signMessage = jest.fn(
      () => new Promise((resolve) => { complete = resolve; })
    );
    const wallet = new ethers.Wallet(
      ethers.keccak256(ethers.toUtf8Bytes("test-wallet"))
    );

    const first = deriveRelayKeyPair({ signMessage }, ADDRESS, true);
    const second = deriveRelayKeyPair({ signMessage }, ADDRESS, true);
    complete(await wallet.signMessage(DERIVATION_MESSAGE));
    const [a, b] = await Promise.all([first, second]);

    expect(signMessage).toHaveBeenCalledTimes(1);
    expect(bytesToHex(a.privateKey)).toBe(bytesToHex(b.privateKey));
  });
});

describe("clearing during an in-flight derivation", () => {
  /** A signer whose signature can be completed on demand. */
  function deferredSigner() {
    let complete;
    const signMessage = jest.fn(
      () => new Promise((resolve) => { complete = resolve; })
    );
    const wallet = new ethers.Wallet(
      ethers.keccak256(ethers.toUtf8Bytes("test-wallet"))
    );
    return {
      signer: { signMessage },
      finish: async () => complete(await wallet.signMessage(DERIVATION_MESSAGE)),
    };
  }

  it("does not restore the key after it was cleared", async () => {
    // Disconnecting while a signature prompt is still open must not have the
    // key written back once the user finally signs.
    const { signer, finish } = deferredSigner();

    const pending = deriveRelayKeyPair(signer, ADDRESS, true);
    clearCachedKeys(ADDRESS);
    await finish();
    await pending;

    expect(hasCachedKeys(ADDRESS)).toBe(false);
    expect(store.size).toBe(0);
  });

  it("still returns the derived pair to its caller", async () => {
    const { signer, finish } = deferredSigner();

    const pending = deriveRelayKeyPair(signer, ADDRESS, true);
    clearCachedKeys(ADDRESS);
    await finish();

    const keyPair = await pending;
    expect(keyPair.publicKey).toHaveLength(65);
  });

  it("caches normally when nothing cleared it", async () => {
    const { signer, finish } = deferredSigner();

    const pending = deriveRelayKeyPair(signer, ADDRESS, true);
    await finish();
    await pending;

    expect(hasCachedKeys(ADDRESS)).toBe(true);
  });
});

describe("hex helpers", () => {
  it("round-trips bytes", () => {
    const bytes = new Uint8Array([0x04, 0x00, 0xff, 0x7f]);
    expect(hexToBytes(bytesToHex(bytes))).toEqual(bytes);
  });

  it("accepts hex with or without the 0x prefix", () => {
    expect(hexToBytes("0x04ff")).toEqual(hexToBytes("04ff"));
  });

  it("rejects malformed hex", () => {
    expect(() => hexToBytes("0xabc")).toThrow(/odd length/i);
    expect(() => hexToBytes("0xzz")).toThrow(/non-hex/i);
  });
});
