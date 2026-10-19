import { jest } from "@jest/globals";
import { ZeroAddress } from "ethers";
import { mainnet, classic, polygon, bsc, base, sepolia } from "wagmi/chains";
import { citreaTestnet } from "../../src/utils/CitreaTestnet.jsx";
import {
  getChainName,
  getLinkChainMismatch,
  getNativeToken,
  resolveTokenDecimals,
} from "../../src/utils/paymentToken.js";

const chains = [mainnet, classic, polygon, bsc, base, sepolia, citreaTestnet];
const erc20Address = "0x1111111111111111111111111111111111111111";

describe("getNativeToken", () => {
  it.each(chains)("uses the configured native currency on $name", (chain) => {
    expect(getNativeToken(chain)).toEqual({
      ...chain.nativeCurrency,
      address: ZeroAddress,
      contract_address: ZeroAddress,
    });
  });

  it.each([
    ["ETH", mainnet],
    ["ETC", classic],
    ["POL", polygon],
    ["BNB", bsc],
    ["cBTC", citreaTestnet],
  ])("carries the %s symbol and decimals", (symbol, chain) => {
    expect(getNativeToken(chain)).toMatchObject({ symbol, decimals: 18 });
  });

  it("does not invent metadata for a chain with no native currency", () => {
    expect(getNativeToken({ id: 999, name: "Bare" })).toBeNull();
  });

  it("does not invent metadata for an unknown chain", () => {
    expect(getNativeToken(undefined)).toBeNull();
    expect(getNativeToken(null)).toBeNull();
  });
});

describe("resolveTokenDecimals", () => {
  it("answers from the native currency without an ERC-20 read", async () => {
    const readDecimals = jest.fn();
    expect(
      await resolveTokenDecimals(ZeroAddress, 6, { decimals: 9 }, readDecimals)
    ).toBe(9);
    expect(readDecimals).not.toHaveBeenCalled();
  });

  it("detects the zero address regardless of case", async () => {
    const readDecimals = jest.fn();
    for (const address of [ZeroAddress, ZeroAddress.toUpperCase()]) {
      expect(
        await resolveTokenDecimals(address, undefined, { decimals: 18 }, readDecimals)
      ).toBe(18);
    }
    expect(readDecimals).not.toHaveBeenCalled();
  });

  it("reports no decimals for a native payment on a chain without one", async () => {
    const readDecimals = jest.fn();
    expect(await resolveTokenDecimals(ZeroAddress, 18, undefined, readDecimals)).toBeNull();
    expect(await resolveTokenDecimals(ZeroAddress, 18, {}, readDecimals)).toBeNull();
    expect(readDecimals).not.toHaveBeenCalled();
  });

  it("prefers decimals already known for an ERC-20", async () => {
    const readDecimals = jest.fn();
    expect(
      await resolveTokenDecimals(erc20Address, 6, sepolia.nativeCurrency, readDecimals)
    ).toBe(6);
    expect(
      await resolveTokenDecimals(erc20Address, "6", sepolia.nativeCurrency, readDecimals)
    ).toBe(6);
    expect(
      await resolveTokenDecimals(erc20Address, 0, sepolia.nativeCurrency, readDecimals)
    ).toBe(0);
    expect(readDecimals).not.toHaveBeenCalled();
  });

  it("reads decimals from the ERC-20 when none are known", async () => {
    const readDecimals = jest.fn().mockResolvedValue(8);
    expect(
      await resolveTokenDecimals(erc20Address, undefined, sepolia.nativeCurrency, readDecimals)
    ).toBe(8);
    expect(
      await resolveTokenDecimals(erc20Address, null, sepolia.nativeCurrency, readDecimals)
    ).toBe(8);
    expect(
      await resolveTokenDecimals(erc20Address, "abc", sepolia.nativeCurrency, readDecimals)
    ).toBe(8);
    expect(readDecimals).toHaveBeenCalledTimes(3);
  });

  it("falls back to the ERC-20 read when no address is given", async () => {
    const readDecimals = jest.fn().mockResolvedValue(18);
    expect(
      await resolveTokenDecimals(undefined, undefined, sepolia.nativeCurrency, readDecimals)
    ).toBe(18);
    expect(readDecimals).toHaveBeenCalledTimes(1);
  });
});

describe("getLinkChainMismatch", () => {
  it("honours a link that pins no chain", () => {
    expect(getLinkChainMismatch(null, mainnet.id)).toBeNull();
    expect(getLinkChainMismatch(undefined, mainnet.id)).toBeNull();
    expect(getLinkChainMismatch("", mainnet.id)).toBeNull();
  });

  it("honours a link pinned to the chain in use", () => {
    expect(getLinkChainMismatch(String(sepolia.id), sepolia.id)).toBeNull();
    expect(getLinkChainMismatch(String(sepolia.id), String(sepolia.id))).toBeNull();
  });

  it("reports the chain a link asks for when it is a different one", () => {
    expect(getLinkChainMismatch(String(sepolia.id), mainnet.id)).toEqual({
      chain: sepolia.id,
    });
    expect(getLinkChainMismatch("999", mainnet.id)).toEqual({ chain: 999 });
  });

  it("reports an unusable chain parameter as-is", () => {
    expect(getLinkChainMismatch("mainnet", mainnet.id)).toEqual({ chain: "mainnet" });
    expect(getLinkChainMismatch("1.5", mainnet.id)).toEqual({ chain: "1.5" });
  });
});

describe("getChainName", () => {
  it.each(chains)("names $name from the configured chains", (chain) => {
    expect(getChainName(chains, chain.id)).toBe(chain.name);
    expect(getChainName(chains, String(chain.id))).toBe(chain.name);
  });

  it("falls back to the chain id when the chain is not configured", () => {
    expect(getChainName(chains, 999)).toBe("999");
    expect(getChainName([], 999)).toBe("999");
    expect(getChainName(undefined, 999)).toBe("999");
  });

  it("falls back to an unusable chain parameter unchanged", () => {
    expect(getChainName(chains, "mainnet")).toBe("mainnet");
  });
});
