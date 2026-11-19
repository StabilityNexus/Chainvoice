import { JsonRpcProvider } from "ethers";
import { chainConfig } from "../../utils/chainConfig.js";

const providers = new Map();

/**
 * Read-only provider for a stored transaction's original chain.
 * Created from the app's configured RPC list, not the wallet's current chain.
 */
export function getRecoveryProvider(chainId) {
  const normalizedChainId = Number(chainId);
  if (!Number.isSafeInteger(normalizedChainId)) return null;

  if (providers.has(normalizedChainId)) return providers.get(normalizedChainId);

  const chain = chainConfig.find((item) => item.id === normalizedChainId);
  const rpcUrl = chain?.rpcUrls?.default?.http?.[0];
  if (!rpcUrl) return null;

  try {
    const provider = new JsonRpcProvider(rpcUrl, normalizedChainId, {
      staticNetwork: true,
    });
    providers.set(normalizedChainId, provider);
    return provider;
  } catch (error) {
    console.warn("[transactionRecovery] Could not create RPC provider:", error);
    return null;
  }
}
