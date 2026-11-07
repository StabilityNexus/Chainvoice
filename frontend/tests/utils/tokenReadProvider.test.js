import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import { JsonRpcProvider } from "ethers";
import { chainConfig } from "../../src/utils/chainConfig.js";
import {
  CHAIN_ID_TO_PUBLIC_RPC,
  getCheckedTokenReadProvider,
  getTokenReadProvider,
  TokenRpcWrongNetworkError,
} from "../../src/utils/tokenReadProvider.js";

const en = JSON.parse(
  readFileSync(new URL("../../src/locales/en.json", import.meta.url), "utf8")
);

function injectOtherWallet() {
  const request = jest.fn();
  globalThis.window = { ethereum: { request } };
  return request;
}

describe("getTokenReadProvider", () => {
  afterEach(() => {
    delete globalThis.window;
  });

  test("pins the given chain and ignores an injected wallet", async () => {
    const otherWallet = injectOtherWallet();
    const provider = getTokenReadProvider(11155111);

    expect(provider).toBeInstanceOf(JsonRpcProvider);
    expect(provider._getConnection().url).toBe(CHAIN_ID_TO_PUBLIC_RPC[11155111]);
    expect((await provider.getNetwork()).chainId).toBe(11155111n);
    expect(otherWallet).not.toHaveBeenCalled();
    provider.destroy();
  });

  test("reads a chain id given as a string with no wallet", async () => {
    expect(globalThis.window).toBeUndefined();
    const provider = getTokenReadProvider("137");

    expect(provider._getConnection().url).toBe(CHAIN_ID_TO_PUBLIC_RPC[137]);
    expect((await provider.getNetwork()).chainId).toBe(137n);
    provider.destroy();
  });

  test("returns nothing for a chain with no RPC even with an injected wallet", () => {
    const otherWallet = injectOtherWallet();

    for (const chainId of [undefined, null, "", 0, -1, "abc", 1.5, 31337]) {
      expect(getTokenReadProvider(chainId)).toBeNull();
    }
    expect(otherWallet).not.toHaveBeenCalled();
  });

  test("has a public RPC for every chain the app is configured for", () => {
    for (const chain of chainConfig) {
      expect(CHAIN_ID_TO_PUBLIC_RPC[chain.id]).toMatch(/^https:\/\//);
    }
  });

  test("en.json has the token messages both pages show", () => {
    expect(en.createInvoice.tokenNetworkUnsupported).toEqual(expect.any(String));
    expect(en.batchInvoice.errors.connectToVerify).toEqual(expect.any(String));
    expect(en.batchInvoice.errors.tokenVerifyFailed).toEqual(expect.any(String));
    expect(en.createInvoice.tokenRpcWrongNetwork).toEqual(expect.any(String));
    expect(en.batchInvoice.errors.tokenRpcWrongNetwork).toEqual(expect.any(String));
  });
});

describe("getCheckedTokenReadProvider", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function stubChainIdAnswer(answer) {
    return jest.spyOn(JsonRpcProvider.prototype, "send").mockImplementation(answer);
  }

  test("returns the provider when the RPC serves the chain it was asked for", async () => {
    const send = stubChainIdAnswer(async () => "0xaa36a7");

    const provider = await getCheckedTokenReadProvider("11155111");

    expect(send).toHaveBeenCalledWith("eth_chainId", []);
    expect(provider).toBeInstanceOf(JsonRpcProvider);
    provider.destroy();
  });

  test("rejects with TokenRpcWrongNetworkError when the RPC serves another chain", async () => {
    stubChainIdAnswer(async () => "0x1");

    await expect(getCheckedTokenReadProvider(11155111)).rejects.toBeInstanceOf(
      TokenRpcWrongNetworkError
    );
  });

  test("passes an RPC failure through without calling it a wrong network", async () => {
    const down = new Error("connect ECONNREFUSED");
    stubChainIdAnswer(async () => {
      throw down;
    });

    await expect(getCheckedTokenReadProvider(137)).rejects.toBe(down);
  });

  test("returns null for a chain with no RPC without calling the network", async () => {
    const send = stubChainIdAnswer(async () => "0x1");

    await expect(getCheckedTokenReadProvider(31337)).resolves.toBeNull();
    expect(send).not.toHaveBeenCalled();
  });
});
