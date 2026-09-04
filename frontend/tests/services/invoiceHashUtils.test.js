import {
  computeInvoiceHash,
  verifyInvoiceHash,
  stableStringify,
} from "../../src/services/relay/invoiceHashUtils.js";

const invoice = {
  amountDue: "125.5",
  paymentToken: { address: "0xabc", symbol: "USDC", decimals: 6 },
  user: { fname: "Ada", email: "ada@example.com" },
  client: { fname: "Bob", email: "bob@example.com" },
  items: [{ description: "Consulting", qty: "2", unitPrice: "50" }],
};

describe("stableStringify", () => {
  it("is insensitive to key insertion order", () => {
    const a = { x: 1, y: { p: 2, q: 3 } };
    const b = { y: { q: 3, p: 2 }, x: 1 };
    expect(stableStringify(a)).toBe(stableStringify(b));
  });

  it("preserves array order", () => {
    expect(stableStringify([1, 2])).not.toBe(stableStringify([2, 1]));
  });

  it("serialises bigints as strings", () => {
    expect(stableStringify({ n: 10n })).toBe('{"n":"10"}');
  });

  it("serialises dates as ISO strings", () => {
    const date = new Date("2024-01-15T00:00:00.000Z");
    expect(stableStringify({ d: date })).toBe('{"d":"2024-01-15T00:00:00.000Z"}');
  });

  it("omits undefined values", () => {
    expect(stableStringify({ a: 1, b: undefined })).toBe('{"a":1}');
  });

  // The payload travels to the receiver as JSON, so anything stableStringify
  // renders differently to JSON.stringify makes the two sides compute
  // different hashes and silently fails verification.
  describe("agrees with JSON.stringify on array edge cases", () => {
    it("renders an undefined entry as null", () => {
      expect(stableStringify([undefined])).toBe(JSON.stringify([undefined]));
      expect(stableStringify([undefined])).toBe("[null]");
    });

    it("does not collide [undefined] with []", () => {
      expect(stableStringify([undefined])).not.toBe(stableStringify([]));
    });

    it("renders sparse holes as null", () => {
      const sparse = new Array(2);
      sparse[1] = 1;
      expect(stableStringify(sparse)).toBe(JSON.stringify(sparse));
      expect(stableStringify(sparse)).toBe("[null,1]");
    });

    it("renders a trailing hole as null", () => {
      const sparse = new Array(2);
      sparse[0] = 1;
      expect(stableStringify(sparse)).toBe(JSON.stringify(sparse));
    });

    it("renders nulls the same either way", () => {
      expect(stableStringify([null, 1])).toBe(JSON.stringify([null, 1]));
    });
  });
});

describe("computeInvoiceHash", () => {
  it("returns a 32-byte hex hash", () => {
    expect(computeInvoiceHash(invoice)).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("is deterministic across key orderings", () => {
    const reordered = {
      items: invoice.items,
      client: invoice.client,
      user: invoice.user,
      paymentToken: invoice.paymentToken,
      amountDue: invoice.amountDue,
    };
    expect(computeInvoiceHash(reordered)).toBe(computeInvoiceHash(invoice));
  });

  it("changes when any field changes", () => {
    const tampered = { ...invoice, amountDue: "125.6" };
    expect(computeInvoiceHash(tampered)).not.toBe(computeInvoiceHash(invoice));
  });

  it("changes when a nested field changes", () => {
    const tampered = {
      ...invoice,
      client: { ...invoice.client, email: "mallory@example.com" },
    };
    expect(computeInvoiceHash(tampered)).not.toBe(computeInvoiceHash(invoice));
  });
});

describe("sender/receiver hash contract", () => {
  // The sender hashes an in-memory object; the receiver hashes what comes back
  // out of the relay's JSON. Anything that survives one but not the other makes
  // the two sides disagree and silently fails verification, so assert over the
  // round trip rather than over stableStringify alone.
  const overTheWire = (value) =>
    JSON.parse(
      JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v))
    );

  it("survives Date fields becoming ISO strings", () => {
    const payload = {
      issueDate: new Date("2026-08-06T07:00:00.000Z"),
      dueDate: new Date("2026-09-01T10:30:00.000Z"),
    };
    expect(typeof overTheWire(payload).issueDate).toBe("string");
    expect(computeInvoiceHash(overTheWire(payload))).toBe(
      computeInvoiceHash(payload)
    );
  });

  it("survives bigints becoming strings", () => {
    const payload = { amountWei: 10n ** 18n };
    expect(computeInvoiceHash(overTheWire(payload))).toBe(
      computeInvoiceHash(payload)
    );
  });

  it("survives undefined array entries becoming null", () => {
    const payload = { items: [{ qty: "1" }, undefined] };
    expect(computeInvoiceHash(overTheWire(payload))).toBe(
      computeInvoiceHash(payload)
    );
  });

  it("survives undefined object values being dropped", () => {
    const payload = { user: { fname: "Ada", lname: undefined } };
    expect(computeInvoiceHash(overTheWire(payload))).toBe(
      computeInvoiceHash(payload)
    );
  });

  it("survives a full invoice payload round trip", () => {
    expect(computeInvoiceHash(overTheWire(invoice))).toBe(
      computeInvoiceHash(invoice)
    );
  });
});

describe("verifyInvoiceHash", () => {
  it("accepts matching data", () => {
    expect(verifyInvoiceHash(invoice, computeInvoiceHash(invoice))).toBe(true);
  });

  it("is case-insensitive on the expected hash", () => {
    const upper = computeInvoiceHash(invoice).toUpperCase().replace("0X", "0x");
    expect(verifyInvoiceHash(invoice, upper)).toBe(true);
  });

  it("rejects tampered data", () => {
    const expected = computeInvoiceHash(invoice);
    expect(verifyInvoiceHash({ ...invoice, amountDue: "999" }, expected)).toBe(false);
  });

  it("rejects a missing hash", () => {
    expect(verifyInvoiceHash(invoice, undefined)).toBe(false);
    expect(verifyInvoiceHash(invoice, "")).toBe(false);
  });
});
