import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { filterAndSortInvoices } from "../utils/invoiceFilterSortHelpers.js";

/**
 * Custom hook for client-side filtering, sorting, and URL param persistence of invoice tables.
 *
 * @param {Array} invoices - Array of invoice objects
 * @param {Object} options
 * @param {boolean} options.isSent - True for Sent invoices, false for Received invoices
 * @returns {Object} Filter state, available tokens, filtered/sorted invoices, and handler functions
 */
export function useInvoiceFilterSort(invoices = [], { isSent = false } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") || "all";
  const fromDate = searchParams.get("from") || "";
  const toDate = searchParams.get("to") || "";
  const token = searchParams.get("token") || "all";
  const minAmount = searchParams.get("minAmount") || searchParams.get("min") || "";
  const maxAmount = searchParams.get("maxAmount") || searchParams.get("max") || "";
  const sortBy = searchParams.get("sortBy") || "date";
  const sortDir = searchParams.get("sortDir") || "desc";

  const setFilter = useCallback(
    (key, value) => {
      setSearchParams(
        (prevParams) => {
          const params = new URLSearchParams(prevParams);
          if (value && value !== "all") {
            params.set(key, value);
          } else {
            params.delete(key);
          }
          if (key === "minAmount") {
            params.delete("min");
          } else if (key === "maxAmount") {
            params.delete("max");
          } else if (key === "min") {
            params.delete("minAmount");
          } else if (key === "max") {
            params.delete("maxAmount");
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleSort = useCallback(
    (columnId) => {
      if (!columnId || columnId === "select" || columnId === "actions" || columnId === "to") {
        return;
      }
      setSearchParams(
        (prevParams) => {
          const params = new URLSearchParams(prevParams);
          const currentSortBy = params.get("sortBy") || "date";
          const currentSortDir = params.get("sortDir") || "desc";

          let newDir = "asc";
          if (currentSortBy === columnId) {
            newDir = currentSortDir === "asc" ? "desc" : "asc";
          }

          params.set("sortBy", columnId);
          params.set("sortDir", newDir);
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      (prevParams) => {
        const params = new URLSearchParams(prevParams);
        params.delete("status");
        params.delete("from");
        params.delete("to");
        params.delete("token");
        params.delete("minAmount");
        params.delete("min");
        params.delete("maxAmount");
        params.delete("max");
        params.delete("sortBy");
        params.delete("sortDir");
        return params;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const hasActiveFilters = Boolean(
    (status && status !== "all") ||
      fromDate ||
      toDate ||
      (token && token !== "all") ||
      minAmount ||
      maxAmount
  );

  const availableTokens = useMemo(() => {
    if (!Array.isArray(invoices)) return [];
    const tokenMap = new Map();
    invoices.forEach((inv) => {
      const addr = inv.paymentToken?.address?.toLowerCase();
      const sym = inv.paymentToken?.symbol;
      if (addr && sym && !tokenMap.has(addr)) {
        tokenMap.set(addr, sym);
      }
    });
    const symbolCount = new Map();
    for (const sym of tokenMap.values()) {
      symbolCount.set(sym, (symbolCount.get(sym) || 0) + 1);
    }
    return Array.from(tokenMap.entries())
      .map(([addr, sym]) => ({
        address: addr,
        symbol: sym,
        label: symbolCount.get(sym) > 1
          ? `${sym} (${addr.slice(0, 6)}…${addr.slice(-4)})`
          : sym,
      }))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [invoices]);

  const filteredAndSortedInvoices = useMemo(
    () =>
      filterAndSortInvoices(invoices, {
        status,
        fromDate,
        toDate,
        token,
        minAmount,
        maxAmount,
        sortBy,
        sortDir,
        isSent,
      }),
    [invoices, status, fromDate, toDate, token, minAmount, maxAmount, sortBy, sortDir, isSent]
  );

  return {
    filteredAndSortedInvoices,
    availableTokens,
    filters: { status, fromDate, toDate, token, minAmount, maxAmount, sortBy, sortDir },
    setFilter,
    handleSort,
    clearFilters,
    hasActiveFilters,
  };
}
