
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";

function formatAmount(amount, decimals) {
  return ethers.formatUnits(amount, decimals);
}

function Metric({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}

export default function InvoiceFinancialSummary({
  summary = [],
  loading = false,
  error = null,
}) {
  if (loading) {
    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CircularProgress size={20} />
          <Typography>Calculating financial summaryGǪ</Typography>
        </Stack>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Financial summary unavailable: {error}
      </Alert>
    );
  }

  const counts = summary.reduce(
    (result, group) => ({
      total: result.total + group.total,
      paid: result.paid + group.paid,
      outstanding: result.outstanding + group.outstanding,
      cancelled: result.cancelled + group.cancelled,
    }),
    { total: 0, paid: 0, outstanding: 0, cancelled: 0 }
  );

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }} elevation={1}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Financial Summary
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          py: 2,
        }}
      >
        <Metric label="Total invoices" value={counts.total} />
        <Metric label="Paid" value={counts.paid} />
        <Metric label="Outstanding" value={counts.outstanding} />
        <Metric label="Cancelled" value={counts.cancelled} />
      </Box>

      <Divider sx={{ my: 1 }} />

      {summary.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          No invoices found.
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {summary.map((group) => {
            const currency = group.symbol || "Token";

            return (
              <Box
                key={`${group.chainId}:${group.tokenAddress}`}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography fontWeight={600} gutterBottom>
                  {currency} -+ Chain {group.chainId}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {group.tokenAddress}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr 1fr",
                      md: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Metric
                    label="Total invoiced"
                    value={`${formatAmount(
                      group.totalBaseUnits,
                      group.decimals
                    )} ${currency}`}
                  />
                  <Metric
                    label="Paid amount"
                    value={`${formatAmount(
                      group.paidBaseUnits,
                      group.decimals
                    )} ${currency}`}
                  />
                  <Metric
                    label="Outstanding amount"
                    value={`${formatAmount(
                      group.outstandingBaseUnits,
                      group.decimals
                    )} ${currency}`}
                  />
                  <Metric
                    label="Cancelled amount"
                    value={`${formatAmount(
                      group.cancelledBaseUnits,
                      group.decimals
                    )} ${currency}`}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}
