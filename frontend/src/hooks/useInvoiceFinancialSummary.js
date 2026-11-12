
import { useEffect, useState } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import { ChainvoiceABI } from "@/contractsABI/ChainvoiceABI";
import { createTokenMetadataReader } from "@/utils/chainInvoice";
import { summarizeInvoices } from "@/utils/invoiceFinancialSummary";
import { getWagmiChainInfo } from "@/utils/wagmiChainHelpers";
import { fetchAllInvoicePages } from "@/utils/fetchAllInvoicePages";

export function useInvoiceFinancialSummary({
  address,
  chainId,
  chain,
  tokens,
  refreshTrigger,
  invoiceType,
}) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address || !chainId) {
      setSummary([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadSummary() {
      setLoading(true);
      setError(null);

      try {
        const chainInfo = getWagmiChainInfo(chainId);
        const rpcUrl =
          chainInfo?.rpcUrls?.default?.http?.[0] ??
          chain?.rpcUrls?.default?.http?.[0];

        if (!rpcUrl) {
          throw new Error(
            `No RPC URL configured for chain ${chainId}.`
          );
        }

        const contractAddress =
          import.meta.env[`VITE_CONTRACT_ADDRESS_${chainId}`];

        if (!contractAddress) {
          throw new Error("Unsupported network.");
        }

        const provider = new JsonRpcProvider(rpcUrl);

        const contract = new Contract(
          contractAddress,
          ChainvoiceABI,
          provider
        );

        const readToken = createTokenMetadataReader({
          runner: provider,
          tokens,
          nativeCurrency:
            chainInfo?.nativeCurrency ?? chain?.nativeCurrency,
          fallbackLogo: `${
            import.meta.env.BASE_URL
          }tokenImages/generic.png`,
        });

        const view =
          invoiceType === "sent"
            ? contract.getSentInvoices.bind(contract)
            : contract.getReceivedInvoices.bind(contract);

        const allInvoices = await fetchAllInvoicePages(
          view,
          address
        );

        const normalizedInvoices = [];

        for (const raw of allInvoices) {
          const token = await readToken(raw[4]);

          if (
            !Number.isInteger(token.decimals) ||
            token.decimals < 0 ||
            token.decimals > 255
          ) {
            throw new Error(
              `Token decimals are unavailable for ${raw[4]} on chain ${chainId}.`
            );
          }

          normalizedInvoices.push({
            id: raw[0].toString(),
            chainId,
            amountDueBaseUnits: raw[3].toString(),
            paymentToken: {
              address: raw[4],
              symbol: token.symbol,
              decimals: token.decimals,
            },
            isPaid: raw[5],
            isCancelled: raw[6],
          });
        }

        const result = summarizeInvoices(normalizedInvoices);

        if (!cancelled) {
          setSummary(result);
        }
      } catch (err) {
        console.error("Financial summary error:", err);

        if (!cancelled) {
          setSummary([]);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to calculate the financial summary."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [
    address,
    chainId,
    chain,
    tokens,
    refreshTrigger,
    invoiceType,
  ]);

  return { summary, loading, error };
}
