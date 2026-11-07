import { defineChain } from 'viem';
import {
  mainnet as wagmiMainnet,
  classic as wagmiClassic,
  polygon,
  polygonAmoy,
  bsc,
  base,
  sepolia,
} from 'wagmi/chains';
import { citreaTestnet } from './CitreaTestnet';

const mainnet = {
  ...wagmiMainnet,
  rpcUrls: {
    ...wagmiMainnet.rpcUrls,
    default: {
      http: ['https://cloudflare-eth.com', ...wagmiMainnet.rpcUrls.default.http],
    },
  },
};

// viem's entry still points at etc.rivet.link, which no longer answers, and at
// Blockscout's retired /etc/mainnet path. Wallets copy both when the app asks
// them to add the network, and the share-link check reads through the first RPC.
const classic = {
  ...wagmiClassic,
  rpcUrls: {
    ...wagmiClassic.rpcUrls,
    default: { http: ['https://etc.etcdesktop.com', 'https://0xrpc.io/etc'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://etc.blockscout.com' },
  },
};

// Ethereum Classic's testnet, missing from viem. Only the first RPC sends CORS
// headers, so it is the one the app reads through.
const mordor = defineChain({
  id: 63,
  name: 'Mordor Testnet',
  nativeCurrency: { name: 'Mordor Ether', symbol: 'METC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://0xrpc.io/mordor', 'https://geth-mordor.etc-network.info'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://etc-mordor.blockscout.com' },
  },
  testnet: true,
});

export const chainConfig = [
  mainnet,
  classic,
  polygon,
  bsc,
  base,
  sepolia,
  mordor,
  polygonAmoy,
  citreaTestnet,
];

/**
 * The Chainvoice contract configured for a chain, or null when the app is not
 * deployed there.
 *
 * @param {number|string} chainId
 * @param {Record<string, string>} [env] - defaults to the build's env
 * @returns {string|null}
 */
export function getContractAddress(chainId, env = import.meta.env) {
  if (chainId === undefined || chainId === null || chainId === '') return null;
  return env?.[`VITE_CONTRACT_ADDRESS_${Number(chainId)}`] || null;
}

export function isChainDeployed(chainId, env = import.meta.env) {
  return getContractAddress(chainId, env) !== null;
}

/**
 * The chains the user can actually use: those with a contract in this build.
 *
 * @param {Array<{id: number}>} [chains]
 * @param {Record<string, string>} [env]
 */
export function getDeployedChains(chains = chainConfig, env = import.meta.env) {
  return chains.filter((chain) => isChainDeployed(chain.id, env));
}

/**
 * The configured chain definition for a chain id.
 *
 * @param {number|string} chainId
 * @param {Array} [chains]
 */
export function getChainConfig(chainId, chains = chainConfig) {
  const normalizedChainId = Number(chainId);
  if (!Number.isSafeInteger(normalizedChainId)) return null;
  return chains.find((chain) => chain.id === normalizedChainId) || null;
}

/**
 * Explorer URL for a transaction, built from the configured chain metadata.
 *
 * @param {number|string} chainId
 * @param {string} hash
 * @param {Array} [chains]
 * @returns {string|null} null when the chain or explorer is unknown
 */
export function getTransactionExplorerUrl(chainId, hash, chains = chainConfig) {
  if (typeof hash !== "string" || !hash) return null;
  const chain = getChainConfig(chainId, chains);
  const explorerUrl = chain?.blockExplorers?.default?.url;
  if (!explorerUrl) return null;
  return `${explorerUrl.replace(/\/+$/, "")}/tx/${hash}`;
}
