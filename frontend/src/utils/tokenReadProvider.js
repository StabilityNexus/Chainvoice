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
 * The chain to read tokens on: the connected wallet's chain, else the chain of an
 * invoice link, else Ethereum mainnet like the token list. The link chain is read
 * like getLinkChainMismatch reads it.
 */
export function getTokenChainId(connectedChainId, linkChain) {
  if (connectedChainId) return Number(connectedChainId);
  const fromLink = Number(linkChain);
  return Number.isInteger(fromLink) && fromLink > 0 ? fromLink : 1;
}

/**
 * A read-only provider for `chainId`, or null for a chain with no public RPC.
 * Never window.ethereum, which can be another wallet on another chain (#348).
 */
export function getTokenReadProvider(chainId) {
  const id = Number(chainId);
  const rpcUrl = CHAIN_ID_TO_PUBLIC_RPC[id];
  return rpcUrl ? new JsonRpcProvider(rpcUrl, id, { staticNetwork: true }) : null;
}
