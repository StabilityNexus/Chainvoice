import { ethers } from "ethers";
import {
  encryptPayload,
  decryptPayload,
  tryDecryptPayload,
  bytesToBase64,
  base64ToBytes,
} from "../../src/services/relay/invoiceCrypto.js";

/** Derive a keypair the same way relayKeyManager does, without a wallet. */
function keyPairFrom(seed) {
  const privateKeyHex = ethers.keccak256(ethers.toUtf8Bytes(seed));
  return {
    privateKey: privateKeyHex,
    publicKey: new ethers.SigningKey(privateKeyHex).publicKey,
  };
}

const receiver = keyPairFrom("receiver");
const stranger = keyPairFrom("stranger");

const envelope = {
  type: "invoice",
  invoiceId: "7",
  chainId: 11155111,
  data: { amountDue: "125.5", client: { email: "bob@example.com" } },
};

describe("base64 helpers", () => {
  it("round-trips arbitrary bytes", () => {
    const bytes = new Uint8Array([0, 1, 127, 128, 255, 42]);
    expect(Array.from(base64ToBytes(bytesToBase64(bytes)))).toEqual(
      Array.from(bytes)
    );
  });

  it("handles payloads larger than one chunk", () => {
    const bytes = new Uint8Array(100_000).map((_, i) => i % 256);
    expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes);
  });
});

describe("encryptPayload / decryptPayload", () => {
  it("round-trips an invoice envelope", () => {
    const ciphertext = encryptPayload(receiver.publicKey, envelope);
    expect(decryptPayload(receiver.privateKey, ciphertext)).toEqual(envelope);
  });

  it("produces base64 that does not leak plaintext", () => {
    const ciphertext = encryptPayload(receiver.publicKey, envelope);
    expect(ciphertext).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(ciphertext).not.toContain("bob@example.com");
  });

  it("is non-deterministic (fresh ephemeral key per message)", () => {
    const a = encryptPayload(receiver.publicKey, envelope);
    const b = encryptPayload(receiver.publicKey, envelope);
    expect(a).not.toBe(b);
  });

  it("serialises bigints rather than throwing", () => {
    const ciphertext = encryptPayload(receiver.publicKey, { amount: 10n });
    expect(decryptPayload(receiver.privateKey, ciphertext)).toEqual({
      amount: "10",
    });
  });

  it("rejects decryption with the wrong key", () => {
    const ciphertext = encryptPayload(receiver.publicKey, envelope);
    expect(() => decryptPayload(stranger.privateKey, ciphertext)).toThrow();
  });
});

describe("tryDecryptPayload", () => {
  it("returns the value when the key matches", () => {
    const ciphertext = encryptPayload(receiver.publicKey, envelope);
    expect(tryDecryptPayload(receiver.privateKey, ciphertext)).toEqual(envelope);
  });

  it("returns null for another recipient's message", () => {
    const ciphertext = encryptPayload(receiver.publicKey, envelope);
    expect(tryDecryptPayload(stranger.privateKey, ciphertext)).toBeNull();
  });

  it("returns null for junk in the mailbox", () => {
    expect(tryDecryptPayload(receiver.privateKey, "bm90LWNpcGhlcnRleHQ=")).toBeNull();
    expect(tryDecryptPayload(receiver.privateKey, "!!!not base64!!!")).toBeNull();
  });
});
