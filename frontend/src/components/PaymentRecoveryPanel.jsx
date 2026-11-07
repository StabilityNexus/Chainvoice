import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";
import {
  getChainConfig,
  getTransactionExplorerUrl,
} from "../utils/chainConfig.js";
import {
  TRANSACTION_OPERATION,
  TRANSACTION_STATUS,
} from "../services/transactionRecovery/transactionRecovery.js";

const STATUS_LABELS = {
  [TRANSACTION_STATUS.PENDING]: {
    label: "Pending",
    color: "warning",
  },
  [TRANSACTION_STATUS.UNRESOLVED]: {
    label: "Unresolved",
    color: "default",
  },
};

function TransactionRow({ transaction }) {
  const chain = getChainConfig(transaction.chainId);
  const explorerUrl = getTransactionExplorerUrl(
    transaction.chainId,
    transaction.hash
  );
  const status = STATUS_LABELS[transaction.status] || {
    label: transaction.status,
    color: "default",
  };
  const isApproval =
    transaction.operationType === TRANSACTION_OPERATION.APPROVAL;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        gap: 1,
        bgcolor: "white",
        p: 1.5,
        borderRadius: 1,
        border: "1px solid rgba(245, 158, 11, 0.25)",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
        <Chip
          size="small"
          label={isApproval ? "Token approval" : "Payment"}
          color={isApproval ? "info" : "primary"}
          variant="outlined"
        />
        <Chip size="small" label={status.label} color={status.color} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
          {transaction.invoiceIds.length === 1 ? "Invoice" : "Invoices"}{" "}
          {transaction.invoiceIds
            .map((invoiceId) => `#${invoiceId}`)
            .join(", ")}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" sx={{ color: "#64748b" }}>
          {chain?.name || `Chain ${transaction.chainId}`} ·{" "}
          {new Date(transaction.submittedAt).toLocaleString()}
        </Typography>
        {explorerUrl ? (
          <Button
            component="a"
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            endIcon={<OpenInNewIcon fontSize="small" />}
            sx={{ minWidth: "auto", textTransform: "none" }}
          >
            Explorer
          </Button>
        ) : (
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", color: "#64748b" }}
          >
            {`${transaction.hash.slice(0, 10)}...${transaction.hash.slice(-6)}`}
          </Typography>
        )}
      </Box>

      {transaction.lastError && (
        <Typography
          variant="caption"
          sx={{ color: "#64748b", flexBasis: "100%" }}
        >
          Last check: {transaction.lastError}
        </Typography>
      )}
    </Box>
  );
}

/**
 * Shows locally stored payments/approvals that are still unresolved.
 * These records are informational only; the invoice's on-chain state is the
 * source of truth and recovery never submits another transaction.
 */
export default function PaymentRecoveryPanel({
  transactions = [],
  isRefreshing = false,
  onRefresh,
}) {
  if (transactions.length === 0) return null;

  return (
    <Paper
      sx={{
        mb: 3,
        p: 2,
        bgcolor: "rgba(245, 158, 11, 0.08)",
        border: "1px solid rgba(245, 158, 11, 0.35)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <SyncProblemIcon sx={{ color: "warning.main", mt: 0.25 }} />
          <Box>
            <Typography variant="h6" sx={{ color: "#1e293b" }}>
              Pending payments
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Saved on this device. Chainvoice checks the original chain and
              never resubmits automatically.
            </Typography>
          </Box>
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={isRefreshing}
          sx={{ whiteSpace: "nowrap" }}
        >
          {isRefreshing ? "Checking..." : "Check again"}
        </Button>
      </Box>

      <Stack spacing={1}>
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.key} transaction={transaction} />
        ))}
      </Stack>
    </Paper>
  );
}
