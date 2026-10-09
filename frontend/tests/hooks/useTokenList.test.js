import { isTestnet } from "../../src/hooks/useTokenList.js";

describe("isTestnet", () => {
  it.each([11155111, 5, 5115])("treats chain %i as a testnet", (chainId) => {
    expect(isTestnet(chainId)).toBe(true);
  });

  it.each([1, 61, 137, 56, 8453])("treats chain %i as a mainnet", (chainId) => {
    expect(isTestnet(chainId)).toBe(false);
  });
});
