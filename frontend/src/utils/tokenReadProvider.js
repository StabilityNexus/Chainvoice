import { JsonRpcProvider } from "ethers";

/** Public RPC URLs by chain ID, so tokens can be read without a wallet. */
export const CHAIN_ID_TO_PUBLIC_RPC = {
  1: "https://ethereum-rpc.publicnode.com",
  61: "https://etc.etcdesktop.com",
  137: "https://polygon-bor-rpc.publicnode.com",
  56: "https://bsc-dataseed.binance.org",
  8453: "https://mainnet.base.org",
  11155111: "https://ethereum-sepolia-rpc.publicnode.com",
  63: "https://0xrpc.io/mordor",
  80002: "https://polygon-amoy.drpc.org",
  5115: "https://rpc.testnet.citrea.xyz",
};

/**
 * A read-only provider pinned to `chainId`, or null for an unknown chain.
 * Never window.ethereum, which can be a different wallet or chain than the
 * one the app connected (#348).
 */
export function getTokenReadProvider(chainId) {
  const id = Number(chainId);
  const rpcUrl = CHAIN_ID_TO_PUBLIC_RPC[id];
  return rpcUrl ? new JsonRpcProvider(rpcUrl, id, { staticNetwork: true }) : null;
}

/** Thrown when a public RPC answers for a different chain than the one asked for. */
export class TokenRpcWrongNetworkError extends Error {
  constructor(expectedChainId, actualChainId) {
    super(`Token RPC serves chain ${actualChainId}, expected ${expectedChainId}`);
    this.name = "TokenRpcWrongNetworkError";
  }
}

/** getTokenReadProvider after checking the RPC's eth_chainId, which staticNetwork skips. */
export async function getCheckedTokenReadProvider(chainId) {
  const provider = getTokenReadProvider(chainId);
  if (!provider) return null;
  try {
    const servedChainId = BigInt(await provider.send("eth_chainId", []));
    if (servedChainId !== BigInt(Number(chainId))) {
      throw new TokenRpcWrongNetworkError(Number(chainId), servedChainId);
    }
    return provider;
  } catch (error) {
    provider.destroy();
    throw error;
  }
}
