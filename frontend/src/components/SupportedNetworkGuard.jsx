import { useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { getDeployedChains, isChainDeployed } from "@/utils/chainConfig";

/**
 * Renders its children only on a chain with a Chainvoice contract. A wallet on
 * any other chain gets one explanation and a switch button per deployed chain,
 * instead of each page failing in its own way. Disconnected users pass through,
 * since every page already handles that case.
 */
export default function SupportedNetworkGuard({ children, className }) {
  // The wallet's own chain; useChainId() would fall back to a configured chain.
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending, variables, error } = useSwitchChain();
  const { t } = useTranslation("unsupportedNetwork");

  useEffect(() => {
    if (error) toast.error(t("switchFailed", { reason: error.message }));
  }, [error, t]);

  if (!isConnected || isChainDeployed(chainId)) return children;

  const deployedChains = getDeployedChains();

  return (
    <div className={cn("py-6", className)}>
      <div
        role="alert"
        className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
      >
        <h2 className="mb-2 text-xl font-bold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">
          {deployedChains.length > 0 ? t("description") : t("noDeployments")}
        </p>
        {deployedChains.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {deployedChains.map((chain) => (
              <Button
                key={chain.id}
                onClick={() => switchChain({ chainId: chain.id })}
                disabled={isPending}
              >
                {isPending && variables?.chainId === chain.id
                  ? t("switching")
                  : t("switchTo", { name: chain.name })}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
