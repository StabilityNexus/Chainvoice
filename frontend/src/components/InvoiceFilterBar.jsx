import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

/**
 * Filter bar component for invoice tables (Sent/Received).
 *
 * @param {Object} props
 * @param {Object} props.filters - Current filter values ({ status, fromDate, toDate, token })
 * @param {Function} props.setFilter - Callback to set a specific filter
 * @param {Array<string>} props.availableTokens - Available token symbols in loaded invoices
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="invoice-status-filter-label" sx={{ fontSize: "0.875rem" }}>
              Status
            </InputLabel>
            <Select
              labelId="invoice-status-filter-label"
              id="invoice-status-filter"
              value={filters.status || "all"}
              label="Status"
              onChange={(e) => setFilter("status", e.target.value)}
              sx={{ borderRadius: "8px", fontSize: "0.875rem" }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          {/* Date Range: From */}
          <TextField
            id="invoice-date-from-filter"
            label="From Date"
            type="date"
            size="small"
            value={filters.fromDate || ""}
            onChange={(e) => setFilter("from", e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: filters.toDate || undefined }}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />

          {/* Date Range: To */}
          <TextField
            id="invoice-date-to-filter"
            label="To Date"
            type="date"
            size="small"
            value={filters.toDate || ""}
            onChange={(e) => setFilter("to", e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: filters.fromDate || undefined }}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />

          {/* Token Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="invoice-token-filter-label" sx={{ fontSize: "0.875rem" }}>
              Token
            </InputLabel>
            <Select
              labelId="invoice-token-filter-label"
              id="invoice-token-filter"
              value={filters.token || "all"}
              label="Token"
              onChange={(e) => setFilter("token", e.target.value)}
              sx={{ borderRadius: "8px", fontSize: "0.875rem" }}
            >
              <MenuItem value="all">All Tokens</MenuItem>
              {availableTokens.map((tok) => (
                <MenuItem key={tok.address} value={tok.address}>
                  {tok.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.875rem",
                color: "#64748b",
                borderColor: "#cbd5e1",
                "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Showing results count when filters active */}
        {hasActiveFilters && (
          <div className="text-xs font-medium text-slate-500">
            Showing {totalCount} of {rawCount} invoices
          </div>
        )}
      </div>
    </Paper>
  );
}
