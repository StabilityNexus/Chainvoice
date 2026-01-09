// src/utils/wagmiChainHelpers.js
import { config } from '../App';

export function getWagmiChainById(chainId) {
  if (!config || !config.chains) return undefined;
  return config.chains.find(chain => chain.id === Number(chainId));
}

export function getWagmiChainName(chainId) {
  const chain = getWagmiChainById(chainId);
  return chain?.name || undefined;
}

export function getWagmiChainInfo(chainId) {
  return getWagmiChainById(chainId) || {};
}
