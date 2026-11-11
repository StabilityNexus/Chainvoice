
import { jest } from "@jest/globals";

const mockState = {
  values: [],
  effects: [],
  stateIndex: 0,
  effectIndex: 0,
};

jest.unstable_mockModule("react", () => ({
  useState: (initialValue) => {
    const index = mockState.stateIndex++;

    if (!(index in mockState.values)) {
      mockState.values[index] = initialValue;
    }

    const setValue = (value) => {
      mockState.values[index] =
        typeof value === "function"
          ? value(mockState.values[index])
          : value;
    };

    return [mockState.values[index], setValue];
  },

  useEffect: (callback) => {
    const index = mockState.effectIndex++;
    mockState.effects[index] = callback;
  },
}));

const { isTestnet, useTokenList } = await import(
  "../../src/hooks/useTokenList.js"
);

describe("isTestnet", () => {
  it.each([11155111, 5, 5115])(
    "treats chain %i as a testnet",
    (chainId) => {
      expect(isTestnet(chainId)).toBe(true);
    }
  );

  it.each([1, 61, 137, 56, 8453])(
    "treats chain %i as a mainnet",
    (chainId) => {
      expect(isTestnet(chainId)).toBe(false);
    }
  );
});

describe("useTokenList", () => {
  beforeEach(() => {
    mockState.values = [];
    mockState.effects = [];
    mockState.stateIndex = 0;
    mockState.effectIndex = 0;

    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not allow an outdated request to overwrite tokens after switching networks", async () => {
    const pendingRequests = {};

    globalThis.fetch.mockImplementation((url) => {
      const chain = url.includes("ethereum-tokens")
        ? "ethereum"
        : "polygon";

      return new Promise((resolve) => {
        pendingRequests[chain] = resolve;
      });
    });

    const useTokenListForTest = (chainId) => {
      mockState.stateIndex = 0;
      mockState.effectIndex = 0;

      const result = useTokenList(chainId);
      const cleanup = mockState.effects[0]();

      return { result, cleanup };
    };

    // Start Ethereum request.
    const ethereum = useTokenListForTest(1);

    // Switch to Polygon.
    ethereum.cleanup();

    useTokenListForTest(137);

    // Resolve Polygon first.
    pendingRequests.polygon({
      ok: true,
      json: async () => [
        {
          address: "0xPolygon",
          symbol: "POL",
          name: "Polygon Token",
          image: "polygon.png",
        },
      ],
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockState.values[0]).toEqual([
      expect.objectContaining({
        contract_address: "0xPolygon",
        symbol: "POL",
      }),
    ]);

    // Resolve the outdated Ethereum request.
    pendingRequests.ethereum({
      ok: true,
      json: async () => [
        {
          address: "0xEthereum",
          symbol: "ETH",
          name: "Ethereum Token",
          image: "ethereum.png",
        },
      ],
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Polygon tokens must remain in the current state.
    expect(mockState.values[0]).toEqual([
      expect.objectContaining({
        contract_address: "0xPolygon",
        symbol: "POL",
      }),
    ]);
  });
});
