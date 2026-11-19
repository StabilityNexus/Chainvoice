import { describe, expect, it, jest } from "@jest/globals";
import { parseUnits } from "ethers";
import {
  validateTokenDecimals,
  verifyTokenContract,
} from "../../src/utils/paymentToken.js";
import { TokenRpcUnavailableError } from "../../src/utils/tokenReadProvider.js";

describe("validateTokenDecimals", () => {
  it.each([0, 18, 80])(
    "accepts %s numeric decimals",
    (decimals) => {
      expect(validateTokenDecimals(decimals)).toBe(decimals);
    }
  );

  it.each([
    [0n, 0],
    [18n, 18],
    [80n, 80],
  ])(
    "accepts bigint decimals %s and returns %i",
    (decimals, expected) => {
      expect(validateTokenDecimals(decimals)).toBe(expected);
    }
  );

  it.each([81, -1, 1.5, null, "", "abc"])(
    "rejects invalid decimals: %p",
    (decimals) => {
      expect(() => validateTokenDecimals(decimals)).toThrow();
    }
  );

  it.each([81n, -1n])(
    "rejects unsupported bigint decimals: %s",
    (decimals) => {
      expect(() => validateTokenDecimals(decimals)).toThrow(
        "Unsupported ERC-20 decimals value"
      );
    }
  );
});

describe("ERC-20 token verification", () => {
  const address = "0x1111111111111111111111111111111111111111";

  it("clears the previously verified token when decimals() fails", async () => {
    const setVerifiedToken = jest.fn();
    const setTokenVerificationState = jest.fn();

    const contract = {
      symbol: jest.fn().mockResolvedValue("TKN"),
      name: jest.fn().mockResolvedValue("Test Token"),
      decimals: jest
        .fn()
        .mockRejectedValue(new Error("decimals call failed")),
    };

    await expect(
      verifyTokenContract({
        contract,
        address,
        isCurrent: () => true,
        setVerifiedToken,
        setTokenVerificationState,
      })
    ).rejects.toThrow("decimals call failed");

    expect(setVerifiedToken).toHaveBeenLastCalledWith(null);
    expect(setTokenVerificationState).toHaveBeenLastCalledWith("error");
  });

  it("passes an RPC failure on symbol through instead of calling it a bad token", async () => {
    const setVerifiedToken = jest.fn();
    const setTokenVerificationState = jest.fn();
    const rpcDown = new TokenRpcUnavailableError(1, new Error("limit exceeded"));

    const contract = {
      symbol: jest.fn().mockRejectedValue(rpcDown),
      name: jest.fn().mockResolvedValue("USD Coin"),
      decimals: jest.fn().mockResolvedValue(6n),
    };

    await expect(
      verifyTokenContract({
        contract,
        address,
        isCurrent: () => true,
        setVerifiedToken,
        setTokenVerificationState,
      })
    ).rejects.toBe(rpcDown);
    expect(setVerifiedToken).not.toHaveBeenCalledWith(expect.objectContaining({ symbol: "UNKNOWN" }));
  });

  it("still treats a token without a symbol as a bad token", async () => {
    const setVerifiedToken = jest.fn();
    const setTokenVerificationState = jest.fn();

    const contract = {
      symbol: jest.fn().mockRejectedValue(new Error("execution reverted")),
      name: jest.fn().mockResolvedValue("No Symbol"),
      decimals: jest.fn().mockResolvedValue(18n),
    };

    await expect(
      verifyTokenContract({
        contract,
        address,
        isCurrent: () => true,
        setVerifiedToken,
        setTokenVerificationState,
      })
    ).rejects.toThrow("Unable to read a valid token symbol");
    expect(setTokenVerificationState).toHaveBeenLastCalledWith("error");
  });

  it("normalizes bigint decimals for amount conversion", async () => {
    const setVerifiedToken = jest.fn();
    const setTokenVerificationState = jest.fn();

    const contract = {
      symbol: jest.fn().mockResolvedValue("USDC"),
      name: jest.fn().mockResolvedValue("USD Coin"),
      // ethers v6 returns bigint for uint values.
      decimals: jest.fn().mockResolvedValue(6n),
    };

    const token = await verifyTokenContract({
      contract,
      address,
      isCurrent: () => true,
      setVerifiedToken,
      setTokenVerificationState,
    });

    expect(token.decimals).toBe(6);
    expect(typeof token.decimals).toBe("number");
    expect(setVerifiedToken).toHaveBeenCalledWith(token);
    expect(setTokenVerificationState).toHaveBeenLastCalledWith("success");
    expect(parseUnits("1.25", token.decimals)).toBe(1250000n);
  });
});