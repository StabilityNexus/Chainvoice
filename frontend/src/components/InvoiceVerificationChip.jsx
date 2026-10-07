import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { useTranslation } from "../hooks/useTranslation";

/**
 * Explains why an invoice row shows only its on-chain facts.
 *
 * Renders nothing for an invoice whose payload matched the chain.
 *
 * @param {Object} props
 * @param {Object} props.invoice - an invoice from `buildChainInvoice`
 * @param {"received"|"sent"} props.variant - which page renders it; the
 *   wording differs because only the sender's device ever held the payload
 */
export default function InvoiceVerificationChip({ invoice, variant }) {
  const { t } = useTranslation("invoiceVerification");
  if (!invoice._onChainOnly) return null;

  let state = "pending";
  if (invoice._payloadMismatch) state = "mismatch";
  else if (invoice._hashMismatch) state = "unverified";
  const isError = state !== "pending";

  return (
    <Tooltip
      title={t(`${variant}.${state}Hint`, { field: invoice._payloadMismatch })}
    >
      <Chip
        icon={isError ? <ErrorIcon /> : <WarningIcon />}
        label={t(`${variant}.${state}`)}
        color={isError ? "error" : "default"}
        size="small"
        variant="outlined"
        sx={{ mt: 0.5 }}
      />
    </Tooltip>
  );
}
