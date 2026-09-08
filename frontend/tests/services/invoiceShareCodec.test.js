import {
  encodeInvoiceShare,
  decodeInvoiceShare,
  describeShareSize,
  InvoiceShareError,
  TOKEN_PREFIX,
  SHARE_URL_MAX_CHARS,
  SHARE_QR_MAX_CHARS,
} from "../../src/services/share/invoiceShareCodec.js";
import {
  buildInvoiceShareUrl,
  parseInvoiceShareInput,
  decodeInvoiceShareInput,
} from "../../src/services/share/invoiceShareLink.js";
import { buildInvoiceShareFile } from "../../src/services/share/invoiceShareFile.js";
import {
  evaluateOnChainInvoice,
  VERIFY_OK,
  VERIFY_HASH_MISMATCH,
} from "../../src/services/share/invoiceShareMatch.js";
import { deflateSync } from "fflate";
import { bytesToBase64Url } from "../../src/services/relay/invoiceCrypto.js";
import {
  computeInvoiceHash,
  verifyInvoiceHash,
} from "../../src/services/relay/invoiceHashUtils.js";

const ORIGIN = "https://chainvoice.example";

/** A payload shaped exactly like the one CreateInvoice hashes. */
function makeInvoiceData(itemCount = 3) {
  return {
    amountDue: "1234.567891",
    dueDate: "2026-09-30",
    issueDate: "2026-08-31",
    paymentToken: {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      symbol: "USDC",
      decimals: 6,
    },
    user: {
      address: "0x1111111111111111111111111111111111111111",
      fname: "Bob",
      lname: "Builder",
      email: "bob@example.com",
      country: "United States",
      city: "San Francisco",
      postalcode: "94103",
    },
    client: {
      address: "0x2222222222222222222222222222222222222222",
      fname: "Alice",
      lname: "Anders",
      email: "alice@example.com",
      country: "Germany",
      city: "Berlin",
      postalcode: "10115",
    },
    items: Array.from({ length: itemCount }, (_, i) => ({
      name: `Line item ${i + 1}`,
      qty: String(i + 1),
      unitPrice: "120.50",
      amount: "361.50",
    })),
  };
}

const share = { invoiceId: "42", chainId: 11155111, invoiceData: makeInvoiceData() };

describe("encodeInvoiceShare / decodeInvoiceShare", () => {
  it("round-trips an invoice payload", () => {
    const decoded = decodeInvoiceShare(encodeInvoiceShare(share));
    expect(decoded.invoiceId).toBe("42");
    expect(decoded.chainId).toBe(11155111);
    expect(decoded.invoiceData).toEqual(share.invoiceData);
  });

  it("preserves the on-chain hash across the round trip", () => {
    // The whole trust model rests on this: the importer recomputes the hash
    // over what came out of the token and compares it to the chain, so the
    // payload has to survive encoding byte-identically as far as
    // stableStringify is concerned.
    const hash = computeInvoiceHash(share.invoiceData);
    const decoded = decodeInvoiceShare(encodeInvoiceShare(share));
    expect(verifyInvoiceHash(decoded.invoiceData, hash)).toBe(true);
  });

  it("emits a versioned token", () => {
    expect(encodeInvoiceShare(share).startsWith(TOKEN_PREFIX)).toBe(true);
  });

  it("accepts a bigint invoice id, as read from a contract", () => {
    const decoded = decodeInvoiceShare(
      encodeInvoiceShare({ ...share, invoiceId: 42n })
    );
    expect(decoded.invoiceId).toBe("42");
  });

  it("stringifies bigints inside the payload", () => {
    const decoded = decodeInvoiceShare(
      encodeInvoiceShare({
        ...share,
        invoiceData: { ...share.invoiceData, amountDue: 1234n },
      })
    );
    expect(decoded.invoiceData.amountDue).toBe("1234");
  });

  it("compresses well below the link budget for a typical invoice", () => {
    const url = buildInvoiceShareUrl(share, { origin: ORIGIN });
    expect(describeShareSize(url).fitsQr).toBe(true);
  });

  it("rejects a missing chain id", () => {
    expect(() => encodeInvoiceShare({ ...share, chainId: 0 })).toThrow(
      InvoiceShareError
    );
  });

  it("rejects a missing invoice id", () => {
    expect(() => encodeInvoiceShare({ ...share, invoiceId: "" })).toThrow(
      InvoiceShareError
    );
  });

  it("rejects a missing payload", () => {
    expect(() => encodeInvoiceShare({ ...share, invoiceData: null })).toThrow(
      InvoiceShareError
    );
  });
});

describe("decodeInvoiceShare failure modes", () => {
  const expectCode = (fn, code) => {
    try {
      fn();
      throw new Error("expected a throw");
    } catch (err) {
      expect(err).toBeInstanceOf(InvoiceShareError);
      expect(err.code).toBe(code);
    }
  };

  it("rejects an empty token", () => {
    expectCode(() => decodeInvoiceShare("   "), "EMPTY");
  });

  it("rejects a token with no recognised prefix", () => {
    expectCode(() => decodeInvoiceShare("https://example.com/x"), "UNKNOWN_FORMAT");
  });

  it("rejects a truncated token", () => {
    const token = encodeInvoiceShare(share);
    expectCode(() => decodeInvoiceShare(token.slice(0, token.length - 12)), "CORRUPT");
  });

  it("rejects a token whose payload has been edited", () => {
    // Flipping characters inside the base64url body breaks the DEFLATE stream
    // or the JSON inside it. The on-chain hash check is the real defence, but
    // a mangled token should fail here first with a clearer message.
    const token = encodeInvoiceShare(share);
    const mid = Math.floor(token.length / 2);
    const swapped =
      token.slice(0, mid) +
      (token[mid] === "A" ? "B" : "A") +
      token.slice(mid + 1);
    expect(() => decodeInvoiceShare(swapped)).toThrow(InvoiceShareError);
  });

  it("rejects a future format version", () => {
    // Built by hand rather than by bumping the constant: this asserts what an
    // older build does when handed a token from a newer one.
    const envelope = JSON.stringify({ v: 99, t: "invoice", id: "1", c: 1, d: {} });
    const token =
      TOKEN_PREFIX +
      bytesToBase64Url(deflateSync(new TextEncoder().encode(envelope)));
    expectCode(() => decodeInvoiceShare(token), "UNSUPPORTED_VERSION");
  });
});

describe("buildInvoiceShareUrl / parseInvoiceShareInput", () => {
  it("puts the token in the hash fragment, never on the path", () => {
    const url = buildInvoiceShareUrl(share, { origin: ORIGIN });
    const [beforeHash, afterHash] = url.split("#");
    expect(beforeHash).toBe(`${ORIGIN}/`);
    expect(afterHash).toContain("/dashboard/import?i=cv1.");
  });

  it("round-trips through a full URL", () => {
    const url = buildInvoiceShareUrl(share, { origin: ORIGIN });
    expect(decodeInvoiceShareInput(url).invoiceData).toEqual(share.invoiceData);
  });

  it("recovers a link that a chat client wrapped across lines", () => {
    const url = buildInvoiceShareUrl(share, { origin: ORIGIN });
    const mid = Math.floor(url.length / 2);
    const wrapped = `${url.slice(0, mid)}\n   ${url.slice(mid)}`;
    expect(decodeInvoiceShareInput(wrapped).invoiceId).toBe("42");
  });

  it("accepts a bare token", () => {
    expect(parseInvoiceShareInput(encodeInvoiceShare(share))).toBe(
      encodeInvoiceShare(share)
    );
  });

  it("accepts exported file contents", () => {
    const contents = JSON.stringify(
      buildInvoiceShareFile({ ...share, chainId: 11155111 })
    );
    expect(decodeInvoiceShareInput(contents).invoiceId).toBe("42");
  });

  it("rejects a link with no token in it", () => {
    expect(() => parseInvoiceShareInput(`${ORIGIN}/#/dashboard/import`)).toThrow(
      InvoiceShareError
    );
  });
});

describe("describeShareSize", () => {
  it("flags an invoice that fits a link but not a QR code", () => {
    const size = describeShareSize("x".repeat(SHARE_QR_MAX_CHARS + 1));
    expect(size.fitsUrl).toBe(true);
    expect(size.fitsQr).toBe(false);
  });

  it("flags an invoice too large for a link", () => {
    const size = describeShareSize("x".repeat(SHARE_URL_MAX_CHARS + 1));
    expect(size.fitsUrl).toBe(false);
    expect(size.fitsQr).toBe(false);
  });

  it("treats an empty url as fitting nothing", () => {
    expect(describeShareSize("")).toEqual({
      chars: 0,
      fitsUrl: false,
      fitsQr: false,
    });
  });
});

describe("evaluateOnChainInvoice", () => {
  /** An `InvoiceDetails` tuple shaped as ethers returns it from getInvoice. */
  const tuple = (hash) => [
    42n,
    "0x1111111111111111111111111111111111111111",
    "0x2222222222222222222222222222222222222222",
    10000000n,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    false,
    false,
    hash,
  ];

  it("accepts a payload that survived the share round trip", () => {
    // The branch the browser cannot reach without a funded on-chain invoice:
    // the token decodes, and its hash matches what the sender committed.
    const decoded = decodeInvoiceShare(encodeInvoiceShare(share));
    const result = evaluateOnChainInvoice(
      tuple(computeInvoiceHash(share.invoiceData)),
      decoded.invoiceData
    );
    expect(result.code).toBe(VERIFY_OK);
    expect(result.onChain.to).toBe("0x2222222222222222222222222222222222222222");
    expect(result.onChain.invoiceId).toBe("42");
  });

  it("rejects a payload edited after the sender committed it", () => {
    const tampered = {
      ...share.invoiceData,
      amountDue: "999999.00",
    };
    const result = evaluateOnChainInvoice(
      tuple(computeInvoiceHash(share.invoiceData)),
      tampered
    );
    expect(result.code).toBe(VERIFY_HASH_MISMATCH);
  });

  it("rejects an invoice with no commitment recorded", () => {
    const result = evaluateOnChainInvoice(tuple(""), share.invoiceData);
    expect(result.code).toBe(VERIFY_HASH_MISMATCH);
  });
});
