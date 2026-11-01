import {
  chainConfig,
  getContractAddress,
  getDeployedChains,
  isChainDeployed,
} from "../../src/utils/chainConfig.js";

const SEPOLIA_ADDRESS = "0x6E5Ac5C2c10b4eD34909CFf0DF776832504E9677";
const ETC_ADDRESS = "0x0000000000000000000000000000000000000061";

describe("Ethereum Classic chain config", () => {
  const classic = chainConfig.find((chain) => chain.id === 61);

  it("reads through a live RPC instead of viem's retired etc.rivet.link", () => {
    const rpcs = classic.rpcUrls.default.http;
    expect(rpcs[0]).toBe("https://etc.etcdesktop.com");
    expect(rpcs).not.toContain("https://etc.rivet.link");
  });

  it("points wallets at the current Blockscout explorer", () => {
    expect(classic.blockExplorers.default.url).toBe("https://etc.blockscout.com");
  });

  it("keeps the rest of viem's chain definition", () => {
    expect(classic.name).toBe("Ethereum Classic");
    expect(classic.nativeCurrency.symbol).toBe("ETC");
  });
});

describe("testnets", () => {
  it("includes Mordor with its native coin and explorer", () => {
    const mordor = chainConfig.find((chain) => chain.id === 63);
    expect(mordor.nativeCurrency.symbol).toBe("METC");
    expect(mordor.rpcUrls.default.http[0]).toBe("https://0xrpc.io/mordor");
    expect(mordor.blockExplorers.default.url).toBe("https://etc-mordor.blockscout.com");
    expect(mordor.testnet).toBe(true);
  });

  it("includes Polygon Amoy", () => {
    const amoy = chainConfig.find((chain) => chain.id === 80002);
    expect(amoy.nativeCurrency.symbol).toBe("POL");
    expect(amoy.testnet).toBe(true);
  });
});

describe("getContractAddress", () => {
  const env = { VITE_CONTRACT_ADDRESS_11155111: SEPOLIA_ADDRESS };

  it("returns the address configured for the chain", () => {
    expect(getContractAddress(11155111, env)).toBe(SEPOLIA_ADDRESS);
    expect(getContractAddress("11155111", env)).toBe(SEPOLIA_ADDRESS);
  });

  it("returns null for a chain without a deployment", () => {
    expect(getContractAddress(1, env)).toBeNull();
    expect(getContractAddress(61, { VITE_CONTRACT_ADDRESS_61: "" })).toBeNull();
  });

  it("returns null when no chain is known", () => {
    expect(getContractAddress(undefined, env)).toBeNull();
    expect(getContractAddress(null, env)).toBeNull();
    expect(getContractAddress("", env)).toBeNull();
  });
});

describe("deployed chains", () => {
  const env = {
    VITE_CONTRACT_ADDRESS_11155111: SEPOLIA_ADDRESS,
    VITE_CONTRACT_ADDRESS_61: ETC_ADDRESS,
    VITE_CONTRACT_ADDRESS_80002: ETC_ADDRESS,
  };

  it("reports whether a chain has a contract", () => {
    expect(isChainDeployed(61, env)).toBe(true);
    expect(isChainDeployed(1, env)).toBe(false);
    expect(isChainDeployed(undefined, env)).toBe(false);
  });

  it("keeps only the chains with a contract, in config order", () => {
    expect(getDeployedChains(chainConfig, env).map((chain) => chain.id)).toEqual([
      61, 11155111, 80002,
    ]);
  });

  it("is empty when the build has no contract configured", () => {
    expect(getDeployedChains(chainConfig, {})).toEqual([]);
  });
});
