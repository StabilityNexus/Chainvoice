
import { useState, useEffect } from "react";

// Cache object to store tokens by chainId
const tokenCache = {};

// Add testnet chain IDs
const TESTNET_CHAIN_IDS = new Set([11155111, 5, 63, 80002, 5115]);

// Helper function to check if a chain is testnet
export const isTestnet = (chainId) => TESTNET_CHAIN_IDS.has(chainId);

export const ChainIdToName = {
  1: "ethereum",
  61: "ethereum-classic",
  137: "polygon-pos",
  56: "bsc",
  8453: "base",
  11155111: "sepolia",
};

export function useTokenList(chainId) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const fetchTokens = async () => {
      // Return cached tokens if available
      if (tokenCache[chainId]) {
        if (isActive) {
          setTokens(tokenCache[chainId]);
          setError(null);
          setLoading(false);
        }
        return;
      }

      if (isActive) {
        setLoading(true);
        setError(null);
      }

      // Check if chain is testnet
      if (isTestnet(chainId)) {
        if (isActive) {
          setError(
            "Please manually input the token's contract address instead."
          );
          setLoading(false);
        }
        return;
      }

      // Check if chain is supported
      if (!ChainIdToName[chainId]) {
        if (isActive) {
          setError(`Chain ID ${chainId} is not supported yet`);
          setLoading(false);
        }
        return;
      }

      try {
        const dataUrl = `https://raw.githubusercontent.com/StabilityNexus/TokenList/main/${ChainIdToName[chainId]}-tokens.json`;

        const response = await fetch(dataUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tokens: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform data to match expected format
        const transformedData = data.map((token) => ({
          contract_address: token.contract_address || token.address,
          symbol: token.symbol,
          name: token.name,
          image:
            token.image ||
            token.logo ||
            `${import.meta.env.BASE_URL}tokenImages/generic.png`,
        }));

        // Cache tokens for this chain, even if its request is outdated
        tokenCache[chainId] = transformedData;

        // Only the active request can update React state
        if (isActive) {
          setTokens(transformedData);
        }
      } catch (error) {
        if (isActive) {
          console.error("Token fetch error:", error);

          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch tokens"
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchTokens();

    // Prevent outdated requests from updating the current state
    return () => {
      isActive = false;
    };
  }, [chainId]);

  return { tokens, loading, error };
}
