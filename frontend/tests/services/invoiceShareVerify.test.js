import { jest } from "@jest/globals";

const actualEthers = await import("ethers");
const { computeInvoiceHash } = await import(
  "../../src/services/relay/invoiceHashUtils.js"
);

const CHAIN_ID = 11155111;
const CHAINVOICE = "0x00000000000000000000000000000000000c0de1";
const SENDER = "0x1111111111111111111111111111111111111111";
const RECIPIENT = "0x2222222222222222222222222222222222222222";
const TOKEN = "0x3333333333333333333333333333333333333333";

// What the fake chain returns: the invoice record, the dev fee and the token.
const chain = { raw: null, devFee: null, token: null };

class FakeContract {
  constructor(address) {
    this.address = address.toLowerCase();
  }
  getInvoice() {
    return Promise.resolve(chain.raw);
  }
  devFee() {
    return chain.devFee();
  }
  decimals() {
    return chain.token.decimals();
  }
  symbol() {
    return Promise.resolve(chain.token.symbol);
  }
  name() {
    return Promise.resolve(chain.token.name);
  }
}

class FakeProvider {
  destroy() {}
}

jest.unstable_mockModule("ethers", () => ({
  ...actualEthers,
  ethers: {
    ...actualEthers.ethers,
    Contract: FakeContract,
    JsonRpcProvider: FakeProvider,
  },
}));

jest.unstable_mockModule("../../src/utils/chainConfig.js", () => ({
  chainConfig: [
    {
      id: CHAIN_ID,
      name: "Sepolia",
      nativeCurrency: { symbol: "ETH", name: "Ether", decimals: 18 },
      rpcUrls: { default: { http: ["https://rpc.invalid"] } },
    },
  ],
  getContractAddress: () => CHAINVOICE,
}));

const { verifyShareAgainstChain } = await import(
  "../../src/services/share/invoiceShareVerify.js"
);
const {
  VERIFY_FIELD_MISMATCH,
  VERIFY_HASH_MISMATCH,
  VERIFY_OK,
  VERIFY_UNREACHABLE,
} = await import("../../src/services/share/invoiceShareMatch.js");

const makePayload = (paymentToken) => ({
  amountDue: "125.5",
  paymentToken: { address: TOKEN, symbol: "USDC", decimals: 6, ...paymentToken },
  user: { address: SENDER, fname: "Ada" },
  client: { address: RECIPIENT, fname: "Bob" },
  issueDate: "2026-10-01",
  dueDate: "2026-10-31",
  items: [{ description: "Consulting", qty: "1", unitPrice: "125.5" }],
});

const makeRaw = (payload) => [
  7n,
  SENDER,
  RECIPIENT,
  125_500_000n,
  TOKEN,
  false,
  false,
  computeInvoiceHash(payload),
];

const verify = (invoiceData) =>
  verifyShareAgainstChain({ invoiceId: "7", chainId: CHAIN_ID, invoiceData });

beforeEach(() => {
  chain.devFee = jest.fn().mockResolvedValue(500_000_000_000_000n);
  chain.token = {
    decimals: jest.fn().mockResolvedValue(6n),
    symbol: "USDC",
    name: "USD Coin",
  };
});

describe("verifyShareAgainstChain", () => {
  test("shows the token contract's symbol, not the payload's", async () => {
    const payload = makePayload({ symbol: "USDT", name: "Tether" });
    chain.raw = makeRaw(payload);

    const result = await verify(payload);

    expect(result.code).toBe(VERIFY_OK);
    expect(result.invoice.paymentToken).toMatchObject({
      address: TOKEN,
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
    });
    expect(result.invoice.amountDue).toBe("125.5");
    expect(result.fee).toBe(500_000_000_000_000n);
  });

  test("still verifies when the dev fee can't be read", async () => {
    const payload = makePayload();
    chain.raw = makeRaw(payload);
    chain.devFee.mockRejectedValue(new Error("rpc down"));

    const result = await verify(payload);

    expect(result.code).toBe(VERIFY_OK);
    expect(result.fee).toBeNull();
  });

  test("rejects a payload whose decimals differ from the token's", async () => {
    // At 6 decimals the payload's "125.5" matches the on-chain amount, but the
    // token has 18, so the contract would charge 0.0000000001255 tokens.
    const payload = makePayload();
    chain.raw = makeRaw(payload);
    chain.token.decimals.mockResolvedValue(18n);

    const result = await verify(payload);

    expect(result).toMatchObject({
      code: VERIFY_FIELD_MISMATCH,
      mismatch: "token decimals",
    });
    expect(result.invoice).toBeUndefined();
  });

  test("reports the network as unreachable when decimals can't be read", async () => {
    const payload = makePayload();
    chain.raw = makeRaw(payload);
    chain.token.decimals.mockRejectedValue(new Error("rpc down"));

    const result = await verify(payload);

    expect(result.code).toBe(VERIFY_UNREACHABLE);
    expect(result.invoice).toBeUndefined();
  });

  test("does not read the token when the hash does not match", async () => {
    const payload = makePayload();
    chain.raw = makeRaw(payload);

    const result = await verify({ ...payload, amountDue: "1" });

    expect(result.code).toBe(VERIFY_HASH_MISMATCH);
    expect(chain.token.decimals).not.toHaveBeenCalled();
  });
});
