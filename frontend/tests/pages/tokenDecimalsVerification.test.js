import { describe, expect, it, jest } from "@jest/globals";
import { parseUnits } from "ethers";
import {
  validateTokenDecimals,
  verifyTokenContract,
} from "../../src/utils/paymentToken.js";

describe("validateTokenDecimals", () => {
  it.each([0, 18, 80])("accepts %s decimals", (decimals) => {
    expect(validateTokenDecimals(decimals)).toBe(decimals);
  });

  it.each([81, -1, 1.5, null, "", "abc"])(
    "rejects invalid decimals: %p",
    (decimals) => {
      expect(() => validateTokenDecimals(decimals)).toThrow();
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

  it("uses six verified decimals for amount conversion", async () => {
    const setVerifiedToken = jest.fn();
    const setTokenVerificationState = jest.fn();

    const contract = {
      symbol: jest.fn().mockResolvedValue("USDC"),
      name: jest.fn().mockResolvedValue("USD Coin"),
      decimals: jest.fn().mockResolvedValue(6),
    };

    const token = await verifyTokenContract({
      contract,
      address,
      isCurrent: () => true,
      setVerifiedToken,
      setTokenVerificationState,
    });

    expect(token.decimals).toBe(6);
    expect(setVerifiedToken).toHaveBeenCalledWith(token);
    expect(setTokenVerificationState).toHaveBeenLastCalledWith("success");
    expect(parseUnits("1.25", token.decimals)).toBe(1250000n);
  });
});