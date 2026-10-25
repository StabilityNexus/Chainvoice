import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copyButton";

/**
 * A custom token read from its contract. Reading it proves only that the
 * address is an ERC-20: anyone can deploy one called "USD Coin", so the
 * address, not the name, is what the user has to check.
 */
export default function CustomTokenDetails({ token }) {
  const { t } = useTranslation("customToken");

  return (
    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <p className="font-medium text-amber-900">
              {token.name} ({token.symbol})
            </p>
            <Badge className="bg-amber-100 text-amber-800 text-xs">
              {t("unlisted")}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-amber-800 font-mono break-all">
              {token.address}
            </span>
            <CopyButton textToCopy={token.address} />
          </div>
          <p className="text-xs text-amber-800">
            {t("decimals", { decimals: String(token.decimals) })}
          </p>
          <p className="text-xs text-amber-800 mt-1">{t("checkAddress")}</p>
        </div>
      </div>
    </div>
  );
}
