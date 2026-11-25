import { describe, expect, test } from "@jest/globals";
import { JsonRpcProvider } from "ethers";
import { chainConfig } from "../../src/utils/chainConfig.js";
import { getLinkChainMismatch } from "../../src/utils/paymentToken.js";
import {
  CHAIN_ID_TO_PUBLIC_RPC,
  getTokenChainId,
  getTokenReadProvider,
} from "../../src/utils/tokenReadProvider.js";

describe("getTokenChainId", () => {
  test("reads on the connected wallet's chain, even when an invoice link names another", () => {
    expect(getTokenChainId(11155111, "8453")).toBe(11155111);
  });

  test("reads on the invoice link's chain before a wallet is connected", () => {
    expect(getTokenChainId(undefined, "8453")).toBe(8453);
  });

  test("reads a link chain the same way as the link chain check", () => {
    expect(getTokenChainId(undefined, "0x2105")).toBe(8453);
    for (const linkChain of ["8453abc", "8453.5"]) {
      expect(getTokenChainId(undefined, linkChain)).toBe(1);
      expect(getLinkChainMismatch(linkChain, 1)).toEqual({ chain: linkChain });
    }
  });

  test("falls back to Ethereum mainnet, like the token list, with no usable chain", () => {
    for (const linkChain of [undefined, null, "", "abc", "0", "-1"]) {
      expect(getTokenChainId(undefined, linkChain)).toBe(1);
    }
  });
});

describe("getTokenReadProvider", () => {
  test("reads the given chain through its public RPC, pinned to that chain", () => {
    const provider = getTokenReadProvider(11155111);

    expect(provider).toBeInstanceOf(JsonRpcProvider);
    expect(provider._getConnection().url).toBe(CHAIN_ID_TO_PUBLIC_RPC[11155111]);
    // Pinned when built (staticNetwork), so no eth_chainId call is made.
    expect(provider._network.chainId).toBe(11155111n);
    provider.destroy();
  });

  test("accepts a chain id given as a string", () => {
    const provider = getTokenReadProvider("137");

    expect(provider._getConnection().url).toBe(CHAIN_ID_TO_PUBLIC_RPC[137]);
    expect(provider._network.chainId).toBe(137n);
    provider.destroy();
  });

  test("returns null for a chain with no public RPC", () => {
    for (const chainId of [undefined, null, "", 0, -1, "abc", 1.5, 31337]) {
      expect(getTokenReadProvider(chainId)).toBeNull();
    }
  });

  test("has a public RPC for every chain the app is configured for", () => {
    for (const chain of chainConfig) {
      expect(CHAIN_ID_TO_PUBLIC_RPC[chain.id]).toMatch(/^https:\/\//);
    }
  });
});
