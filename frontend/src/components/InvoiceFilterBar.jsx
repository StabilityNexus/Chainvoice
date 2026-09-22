import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { useTranslation } from "../hooks/useTranslation";

/**
 * Filter bar component for invoice tables (Sent/Received).
 *
 * @param {Object} props
 * @param {Object} props.filters - Current filter values ({ status, fromDate, toDate, token, minAmount, maxAmount })
 * @param {Function} props.setFilter - Callback to set a specific filter
 * @param {Array<Object>} props.availableTokens - Available token objects in loaded invoices
 * @param {Function} props.clearFilters - Callback to clear all active filters
 * @param {boolean} props.hasActiveFilters - Whether any filter is currently applied
 * @param {number} props.totalCount - Count of filtered invoices
 * @param {number} props.rawCount - Total count of invoices before filtering
 */
export default function InvoiceFilterBar({
  filters,
  setFilter,
  availableTokens = [],
  clearFilters,
  hasActiveFilters,
  totalCount = 0,
  rawCount = 0,
}) {
  const { t } = useTranslation("filterBar");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: "hsl(var(--card))",
        borderRadius: "12px",
        boxShadow: "0 4px 20px hsl(var(--card-shadow))",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <FormControl
            size="small"
            sx={{
              width: { xs: "100%", sm: "calc(50% - 6px)", md: "140px" },
              minWidth: { md: 140 },
            }}
          >
            <InputLabel id="invoice-status-filter-label" sx={{ fontSize: "0.875rem" }}>
              {t("status")}
            </InputLabel>
            <Select
              labelId="invoice-status-filter-label"
              id="invoice-status-filter"
              value={filters.status || "all"}
              label={t("status")}
              onChange={(e) => setFilter("status", e.target.value)}
              sx={{ borderRadius: "8px", fontSize: "0.875rem" }}
            >
              <MenuItem value="all">{t("allStatuses")}</MenuItem>
              <MenuItem value="paid">{t("paid")}</MenuItem>
              <MenuItem value="pending">{t("pending")}</MenuItem>
              <MenuItem value="overdue">{t("overdue")}</MenuItem>
              <MenuItem value="cancelled">{t("cancelled")}</MenuItem>
            </Select>
          </FormControl>

          {/* Date Range: From */}
          <TextField
            id="invoice-date-from-filter"
            label={t("fromDate")}
            type="date"
            size="small"
            value={filters.fromDate || ""}
            onChange={(e) => setFilter("from", e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: filters.toDate || undefined }}
            sx={{
              width: { xs: "100%", sm: "calc(50% - 6px)", md: "150px" },
              minWidth: { md: 150 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />

          {/* Date Range: To */}
          <TextField
            id="invoice-date-to-filter"
            label={t("toDate")}
            type="date"
            size="small"
            value={filters.toDate || ""}
            onChange={(e) => setFilter("to", e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: filters.fromDate || undefined }}
            sx={{
              width: { xs: "100%", sm: "calc(50% - 6px)", md: "150px" },
              minWidth: { md: 150 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />

          {/* Token Filter */}
          <FormControl
            size="small"
            sx={{
              width: { xs: "100%", sm: "calc(50% - 6px)", md: "140px" },
              minWidth: { md: 140 },
            }}
          >
            <InputLabel id="invoice-token-filter-label" sx={{ fontSize: "0.875rem" }}>
              {t("token")}
            </InputLabel>
            <Select
              labelId="invoice-token-filter-label"
              id="invoice-token-filter"
              value={filters.token ? filters.token.toLowerCase() : "all"}
              label={t("token")}
              onChange={(e) => setFilter("token", e.target.value)}
              sx={{ borderRadius: "8px", fontSize: "0.875rem" }}
            >
              <MenuItem value="all">{t("allTokens")}</MenuItem>
              {availableTokens.map((tok) => (
                <MenuItem key={tok.address} value={tok.address}>
                  {tok.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Min Amount Filter */}
          <TextField
            id="invoice-min-amount-filter"
            label={t("minAmount")}
            type="number"
            size="small"
            value={filters.minAmount || ""}
            onChange={(e) => setFilter("minAmount", e.target.value)}
            inputProps={{ min: 0, step: "any" }}
            sx={{
              width: { xs: "100%", sm: "calc(50% - 6px)", md: "120px" },
              minWidth: { md: 120 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />

          {/* Max Amount Filter */}
          <TextField
            id="invoice-max-amount-filter"
            label={t("maxAmount")}
            type="number"
            size="small"
            value={filters.maxAmount || ""}
            onChange={(e) => setFilter("maxAmount", e.target.value)}
            inputProps={{ min: 0, step: "any" }}
            sx={{
              width: { xs: "100%", sm: "calc(50% - 6px)", md: "120px" },
              minWidth: { md: 120 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              id="invoice-clear-filters-btn"
              size="small"
              variant="outlined"
              color="inherit"
              onClick={clearFilters}
              startIcon={<FilterListOffIcon />}
              sx={{
                width: { xs: "100%", sm: "auto" },
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.875rem",
                color: "#64748b",
                borderColor: "#cbd5e1",
                "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
              }}
            >
              {t("clearFilters")}
            </Button>
          )}
        </div>

        {/* Showing results count when filters active */}
        {hasActiveFilters && (
          <div className="text-xs font-medium text-slate-500 w-full lg:w-auto text-left lg:text-right mt-1 lg:mt-0">
            {t("showingResults", { totalCount, rawCount })}
          </div>
        )}
      </div>
    </Paper>
  );
}
