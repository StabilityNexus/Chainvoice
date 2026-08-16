import { ethers } from "ethers";
import {
  computeInvoiceHash,
  verifyInvoiceHash,
} from "../../src/services/relay/invoiceHashUtils.js";
import {
  encryptPayload,
  decryptPayload,
} from "../../src/services/relay/invoiceCrypto.js";

/**
 * The sender commits keccak256(payload) on-chain and ships the payload over
 * the relay. The receiver only trusts the payload if it re-hashes to that
 * commitment — so anything the transport does to the object's shape
 * (Date coercion, bigint stringification, key reordering) breaks delivery.
 * These tests pin that invariant.
 */

const receiverKey = ethers.keccak256(ethers.toUtf8Bytes("receiver"));
const receiverPub = new ethers.SigningKey(receiverKey).publicKey;

/** Mirrors the object CreateInvoice.jsx builds, Date instances included. */
function buildInvoicePayload() {
  return {
    amountDue: "125.5",
    dueDate: new Date("2026-09-01T10:30:00.000Z"),
    issueDate: new Date("2026-08-06T07:00:00.000Z"),
    paymentToken: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      decimals: 18,
    },
    user: {
      address: "0x69fF0f180e74112cF707DdDEC729095631c4B809",
      fname: "Ada",
      lname: "",
      email: "ada@example.com",
      country: "IN",
      city: "Pune",
      postalcode: "411001",
    },
    client: {
      address: "0xF37B0B9f97e3B3a843d75Ef37F4eE8568590C900",
      fname: "Bob",
      lname: "Smith",
      email: "bob@example.com",
      country: "US",
      city: "Austin",
      postalcode: "73301",
    },
    items: [
      {
        id: "item-1",
        description: "Consulting",
        qty: "2",
        unitPrice: "50",
        discount: "10",
        discountType: "amount",
        tax: "10",
        taxType: "percentage",
        amount: "99",
      },
    ],
  };
}

describe("invoice hash survives a relay round trip", () => {
  it("re-hashes to the on-chain commitment after encrypt/decrypt", () => {
    const payload = buildInvoicePayload();

    // Sender: commit the hash on-chain, ship the payload encrypted.
    const onChainHash = computeInvoiceHash(payload);
    const ciphertext = encryptPayload(receiverPub, {
      type: "invoice",
      invoiceId: "7",
      chainId: 11155111,
      data: payload,
    });

    // Receiver: decrypt and verify against what the chain says.
    const { data } = decryptPayload(receiverKey, ciphertext);
    expect(verifyInvoiceHash(data, onChainHash)).toBe(true);
  });

  it("survives Date fields becoming ISO strings in transit", () => {
    const payload = buildInvoicePayload();
    // JSON has no Date type, so the receiver sees strings where the sender
    // had Date objects. stableStringify must render both identically.
    const overTheWire = JSON.parse(JSON.stringify(payload));

    expect(typeof overTheWire.dueDate).toBe("string");
    expect(overTheWire.dueDate).not.toBeInstanceOf(Date);
    expect(computeInvoiceHash(overTheWire)).toBe(computeInvoiceHash(payload));
  });

  it("rejects a payload the sender altered after committing", () => {
    const payload = buildInvoicePayload();
    const onChainHash = computeInvoiceHash(payload);

    // A malicious sender commits one amount on-chain and relays another.
    const swapped = { ...payload, amountDue: "1.0" };
    const ciphertext = encryptPayload(receiverPub, {
      type: "invoice",
      invoiceId: "7",
      chainId: 11155111,
      data: swapped,
    });

    const { data } = decryptPayload(receiverKey, ciphertext);
    expect(verifyInvoiceHash(data, onChainHash)).toBe(false);
  });

  it("rejects a payload with an item quietly added", () => {
    const payload = buildInvoicePayload();
    const onChainHash = computeInvoiceHash(payload);

    const padded = {
      ...payload,
      items: [...payload.items, { description: "Surprise fee", amount: "500" }],
    };
    expect(verifyInvoiceHash(padded, onChainHash)).toBe(false);
  });

  it("produces a bytes32-shaped hash the contract will accept", () => {
    // createInvoice reverts on a zero hash and takes exactly bytes32.
    const hash = computeInvoiceHash(buildInvoicePayload());
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(hash).not.toBe(ethers.ZeroHash);
  });
});
