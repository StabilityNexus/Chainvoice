import { describe, expect, it } from "@jest/globals";
import { parseUnits } from "ethers";
import { resolveTokenDecimals } from "../../src/utils/paymentToken.js";

describe("ERC-20 token decimals verification", () => {
  const address = "0x1111111111111111111111111111111111111111";

  it("rejects failed decimals reads instead of inventing a default", async () => {
    const readDecimals = async () => {
      throw new Error("decimals call failed");
    };

    await expect(
      resolveTokenDecimals(address, undefined, undefined, readDecimals)
    ).rejects.toThrow("decimals call failed");
  });

  it("uses the verified decimal count for amount conversion", async () => {
    const decimals = await resolveTokenDecimals(
      address,
      undefined,
      undefined,
      async () => 6
    );

    expect(decimals).toBe(6);
    expect(parseUnits("1.25", decimals)).toBe(1250000n);
  });

  it("rejects decimal counts unsupported by ethers.parseUnits", () => {
    expect(() => parseUnits("1", 81)).toThrow();
  });
});