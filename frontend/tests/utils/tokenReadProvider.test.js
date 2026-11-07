import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { JsonRpcProvider } from "ethers";
import { chainConfig } from "../../src/utils/chainConfig.js";
import {
  CHAIN_ID_TO_PUBLIC_RPC,
  getTokenReadProvider,
} from "../../src/utils/tokenReadProvider.js";

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
});
