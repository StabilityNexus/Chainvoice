import { ethers } from "ethers";
import {
  buildChainInvoice,
  createTokenMetadataReader,
  isInvoicePayable,
  sumBaseUnits,
} from "../../src/utils/chainInvoice.js";
import { computeInvoiceHash } from "../../src/services/relay/invoiceHashUtils.js";
import { ERC20_ABI } from "../../src/contractsABI/ERC20_ABI.js";

const SENDER = "0x1111111111111111111111111111111111111111";
const RECIPIENT = "0x2222222222222222222222222222222222222222";
const USDC = "0x3333333333333333333333333333333333333333";

const usdcToken = { address: USDC, symbol: "USDC", name: "USD Coin", decimals: 6, logo: "usdc.png" };
const nativeToken = { address: ethers.ZeroAddress, symbol: "ETH", name: "Ether", decimals: 18 };

const makePayload = (overrides = {}) => ({
  amountDue: "125.5",
  paymentToken: { address: USDC, symbol: "USDC", decimals: 6 },
  user: { address: SENDER, fname: "Ada" },
  client: { address: RECIPIENT, fname: "Bob" },
  issueDate: "2026-10-01",
  dueDate: "2026-10-31",
  items: [{ description: "Consulting", qty: "1", unitPrice: "125.5" }],
  ...overrides,
});

/** An `InvoiceDetails` tuple as the contract returns it. */
const makeRaw = ({
  id = 7n,
  from = SENDER,
  to = RECIPIENT,
  amountDue = 125_500_000n,
  token = USDC,
  isPaid = false,
  isCancelled = false,
  payload = makePayload(),
} = {}) => [id, from, to, amountDue, token, isPaid, isCancelled, computeInvoiceHash(payload)];

describe("buildChainInvoice", () => {
  test("shows a payload that matches the on-chain record", () => {
    const payload = makePayload();
    const invoice = buildChainInvoice(makeRaw({ payload }), payload, usdcToken);

    expect(invoice).toMatchObject({
      id: 7n,
      amountDue: "125.5",
      amountDueBaseUnits: "125500000",
      issueDate: "2026-10-01",
      items: payload.items,
      isPaid: false,
      isCancelled: false,
      _onChainOnly: false,
      _hashMismatch: false,
      _payloadMismatch: null,
    });
    expect(isInvoicePayable(invoice)).toBe(true);
  });

  test("takes token metadata from the token, not the payload", () => {
    const payload = makePayload({
      paymentToken: { address: USDC, symbol: "USDT", name: "Tether", decimals: 6 },
    });
    const invoice = buildChainInvoice(makeRaw({ payload }), payload, usdcToken);

    expect(invoice.paymentToken).toEqual({
      address: USDC,
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logo: "usdc.png",
    });
  });

  test("takes status from the chain even if the payload claims otherwise", () => {
    const payload = makePayload({ isPaid: true, _onChainOnly: true, _payloadMismatch: "x" });
    const invoice = buildChainInvoice(makeRaw({ payload }), payload, usdcToken);

    expect(invoice.isPaid).toBe(false);
    expect(invoice._onChainOnly).toBe(false);
    expect(invoice._payloadMismatch).toBeNull();
  });

  test("builds a payable stub from on-chain values when no payload is stored", () => {
    const invoice = buildChainInvoice(makeRaw(), undefined, usdcToken);

    expect(invoice).toMatchObject({
      amountDue: "125.5",
      amountDueBaseUnits: "125500000",
      user: { address: SENDER },
      client: { address: RECIPIENT },
      issueDate: null,
      dueDate: null,
      _onChainOnly: true,
      _hashMismatch: false,
      _payloadMismatch: null,
    });
    expect(invoice.items).toBeUndefined();
    expect(isInvoicePayable(invoice)).toBe(true);
  });

  test("lowercases stub addresses", () => {
    const raw = makeRaw({ from: "0xAbCdEf0000000000000000000000000000000001" });
    const invoice = buildChainInvoice(raw, undefined, usdcToken);
    expect(invoice.user.address).toBe("0xabcdef0000000000000000000000000000000001");
  });

  test("ignores a payload that is not the one the sender committed to", () => {
    const raw = makeRaw();
    const planted = makePayload({ amountDue: "1" });
    const invoice = buildChainInvoice(raw, planted, usdcToken);

    expect(invoice).toMatchObject({
      amountDue: "125.5",
      _onChainOnly: true,
      _hashMismatch: true,
      _payloadMismatch: null,
    });
    expect(invoice.items).toBeUndefined();
    // Anyone could have stored it, so it must not block a genuine invoice.
    expect(isInvoicePayable(invoice)).toBe(true);
  });

  test.each([
    ["amount", { amountDue: "1" }],
    ["sender", { user: { address: RECIPIENT } }],
    ["recipient", { client: { address: SENDER } }],
    ["payment token", { paymentToken: { address: ethers.ZeroAddress, decimals: 18 } }],
  ])("flags a committed payload that misstates the %s", (field, overrides) => {
    const payload = makePayload(overrides);
    // The hash matches: the sender committed to this contradictory payload.
    const raw = makeRaw({ payload });
    const invoice = buildChainInvoice(raw, payload, usdcToken);

    expect(invoice).toMatchObject({
      amountDue: "125.5",
      _onChainOnly: true,
      _hashMismatch: false,
      _payloadMismatch: field,
    });
    expect(invoice.items).toBeUndefined();
    expect(isInvoicePayable(invoice)).toBe(false);
  });

  test("flags a payload whose decimals differ from the token contract's", () => {
    // Self-consistent at 18 decimals, but the token has 6, so the contract
    // charges 10^12 USDC rather than the 1 USDC the payload shows.
    const payload = makePayload({
      amountDue: "1",
      paymentToken: { address: USDC, symbol: "USDC", decimals: 18 },
    });
    const raw = makeRaw({ payload, amountDue: 10n ** 18n });
    const invoice = buildChainInvoice(raw, payload, usdcToken);

    expect(invoice).toMatchObject({
      amountDue: "1000000000000.0",
      amountDueBaseUnits: "1000000000000000000",
      _payloadMismatch: "token decimals",
    });
    expect(invoice.paymentToken.decimals).toBe(6);
    expect(isInvoicePayable(invoice)).toBe(false);
  });

  test("returns null when an ERC-20's decimals could not be read", () => {
    const payload = makePayload();
    expect(
      buildChainInvoice(makeRaw({ payload }), payload, { ...usdcToken, decimals: null })
    ).toBeNull();
  });

  test("handles a token with zero decimals", () => {
    const token = { ...usdcToken, decimals: 0 };
    const invoice = buildChainInvoice(makeRaw({ amountDue: 42n }), undefined, token);
    expect(invoice.amountDue).toBe("42");
    expect(invoice.paymentToken.decimals).toBe(0);
  });

  test("formats native-currency stubs with the native decimals", () => {
    const raw = makeRaw({ token: ethers.ZeroAddress, amountDue: 15n * 10n ** 17n });
    const invoice = buildChainInvoice(raw, undefined, nativeToken);
    expect(invoice.amountDue).toBe("1.5");
    expect(invoice.paymentToken.symbol).toBe("ETH");
  });
});

describe("isInvoicePayable", () => {
  const payable = { isPaid: false, isCancelled: false, _payloadMismatch: null };

  test.each([
    ["an open invoice", payable, true],
    ["a paid invoice", { ...payable, isPaid: true }, false],
    ["a cancelled invoice", { ...payable, isCancelled: true }, false],
    ["a mismatched invoice", { ...payable, _payloadMismatch: "amount" }, false],
    ["a missing invoice", undefined, false],
  ])("%s", (_label, invoice, expected) => {
    expect(isInvoicePayable(invoice)).toBe(expected);
  });
});

describe("sumBaseUnits", () => {
  test("sums exactly, beyond the range of a float", () => {
    const invoices = [
      { amountDueBaseUnits: "9007199254740993" },
      { amountDueBaseUnits: "1" },
    ];
    expect(sumBaseUnits(invoices)).toBe(9007199254740994n);
  });

  test("returns 0n for no invoices", () => {
    expect(sumBaseUnits([])).toBe(0n);
  });
});

describe("createTokenMetadataReader", () => {
  const iface = new ethers.Interface(ERC20_ABI);

  /** A runner that answers ERC-20 view calls and records them. */
  const fakeRunner = (responses) => {
    const calls = [];
    return {
      calls,
      call: async (tx) => {
        const { name } = iface.parseTransaction({ data: tx.data });
        calls.push(name);
        const response = responses[name];
        if (response instanceof Error) throw response;
        return iface.encodeFunctionResult(name, [response]);
      },
    };
  };

  test("reads decimals from the contract even for a listed token", async () => {
    const runner = fakeRunner({ decimals: 6 });
    const read = createTokenMetadataReader({
      runner,
      tokens: [{ contract_address: USDC, symbol: "USDC", name: "USD Coin", decimals: 18, image: "usdc.png" }],
    });

    await expect(read(USDC)).resolves.toEqual({
      address: USDC,
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logo: "usdc.png",
    });
    expect(runner.calls).toEqual(["decimals"]);
  });

  test("reads symbol and name from an unlisted token", async () => {
    const runner = fakeRunner({ decimals: 8, symbol: "WBTC", name: "Wrapped BTC" });
    const read = createTokenMetadataReader({ runner, fallbackLogo: "generic.png" });

    await expect(read(USDC)).resolves.toEqual({
      address: USDC,
      symbol: "WBTC",
      name: "Wrapped BTC",
      decimals: 8,
      logo: "generic.png",
    });
  });

  test("reports null decimals when the contract cannot be read", async () => {
    const failure = new Error("execution reverted");
    const runner = fakeRunner({ decimals: failure, symbol: failure, name: failure });
    const read = createTokenMetadataReader({ runner });

    await expect(read(USDC)).resolves.toMatchObject({
      decimals: null,
      symbol: "UNKNOWN",
      name: "Unknown Token",
    });
  });

  test("reads each token once, whatever the address casing", async () => {
    const runner = fakeRunner({ decimals: 6, symbol: "USDC", name: "USD Coin" });
    const read = createTokenMetadataReader({ runner });
    const mixedCase = "0xAbCdEf0000000000000000000000000000000001";

    await read(mixedCase);
    await read(mixedCase.toLowerCase());
    expect(runner.calls.filter((name) => name === "decimals")).toHaveLength(1);
  });

  test("describes the native currency without calling a contract", async () => {
    const runner = fakeRunner({});
    const read = createTokenMetadataReader({
      runner,
      nativeCurrency: { symbol: "ETC", name: "Ethereum Classic", decimals: 18 },
    });

    await expect(read(ethers.ZeroAddress)).resolves.toMatchObject({
      symbol: "ETC",
      name: "Ethereum Classic",
      decimals: 18,
    });
    expect(runner.calls).toEqual([]);
  });
});
