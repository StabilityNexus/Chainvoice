import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

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

  const filteredAndSortedInvoices = useMemo(() => {
    if (!Array.isArray(invoices) || invoices.length === 0) return [];

    let result = invoices.filter((inv) => {
      // 1. Status Filter
      if (status === "paid") {
        if (!inv.isPaid || inv.isCancelled) return false;
      } else if (status === "pending" || status === "unpaid") {
        if (inv.isPaid || inv.isCancelled) return false;
      } else if (status === "cancelled") {
        if (!inv.isCancelled) return false;
      }

      // 2. Date Range Filter
      if (fromDate) {
        const fromTs = new Date(`${fromDate}T00:00:00`).getTime();
        if (!isNaN(fromTs)) {
          if (!inv.issueDate) return false;
          const invTs = new Date(inv.issueDate).getTime();
          if (isNaN(invTs) || invTs < fromTs) return false;
        }
      }

      if (toDate) {
        const toTs = new Date(`${toDate}T23:59:59.999`).getTime();
        if (!isNaN(toTs)) {
          if (!inv.issueDate) return false;
          const invTs = new Date(inv.issueDate).getTime();
          if (isNaN(invTs) || invTs > toTs) return false;
        }
      }

      // 3. Token Filter
      if (token && token !== "all") {
        const tokenLower = token.toLowerCase();
        const addr = inv.paymentToken?.address?.toLowerCase();
        const sym = inv.paymentToken?.symbol?.toLowerCase();
        if (addr !== tokenLower && sym !== tokenLower) {
          return false;
        }
      }

      // 4. Amount Range Filter
      const toBigDecimal = (val) => {
        const s = String(val || "0");
        const [int, frac = ""] = s.split(".");
        return { int, frac };
      };

      if (minAmount) {
        try {
          const decInv = toBigDecimal(inv.amountDue);
          const decMin = toBigDecimal(minAmount);
          const maxFrac = Math.max(decInv.frac.length, decMin.frac.length);
          const scaledInv = BigInt(decInv.int + decInv.frac.padEnd(maxFrac, "0"));
          const scaledMin = BigInt(decMin.int + decMin.frac.padEnd(maxFrac, "0"));
          if (scaledInv < scaledMin) return false;
        } catch {
          const invVal = parseFloat(inv.amountDue);
          const minVal = parseFloat(minAmount);
          if (!isNaN(minVal) && (isNaN(invVal) || invVal < minVal)) return false;
        }
      }

      if (maxAmount) {
        try {
          const decInv = toBigDecimal(inv.amountDue);
          const decMax = toBigDecimal(maxAmount);
          const maxFrac = Math.max(decInv.frac.length, decMax.frac.length);
          const scaledInv = BigInt(decInv.int + decInv.frac.padEnd(maxFrac, "0"));
          const scaledMax = BigInt(decMax.int + decMax.frac.padEnd(maxFrac, "0"));
          if (scaledInv > scaledMax) return false;
        } catch {
          const invVal = parseFloat(inv.amountDue);
          const maxVal = parseFloat(maxAmount);
          if (!isNaN(maxVal) && (isNaN(invVal) || invVal > maxVal)) return false;
        }
      }

      return true;
    });

    // 4. Sorting
    if (sortBy) {
      result = [...result].sort((a, b) => {
        let cmp = 0;

        if (sortBy === "date") {
          const timeA = a.issueDate ? new Date(a.issueDate).getTime() : 0;
          const timeB = b.issueDate ? new Date(b.issueDate).getTime() : 0;
          cmp = (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
        } else if (sortBy === "amountDue" || sortBy === "amount") {
          try {
            const toBigDecimal = (val) => {
              const s = String(val || "0");
              const [int, frac = ""] = s.split(".");
              return { int, frac };
            };
            const decA = toBigDecimal(a.amountDue);
            const decB = toBigDecimal(b.amountDue);
            const maxFrac = Math.max(decA.frac.length, decB.frac.length);
            const scaledA = BigInt(decA.int + decA.frac.padEnd(maxFrac, "0"));
            const scaledB = BigInt(decB.int + decB.frac.padEnd(maxFrac, "0"));
            cmp = scaledA < scaledB ? -1 : scaledA > scaledB ? 1 : 0;
          } catch {
            cmp = String(a.amountDue || "").localeCompare(String(b.amountDue || ""));
          }
        } else if (sortBy === "fname" || sortBy === "client") {
          const nameA = isSent
            ? `${a.client?.fname || ""} ${a.client?.lname || ""}`.trim() || a.client?.address || ""
            : `${a.user?.fname || ""} ${a.user?.lname || ""}`.trim() || a.user?.address || "";
          const nameB = isSent
            ? `${b.client?.fname || ""} ${b.client?.lname || ""}`.trim() || b.client?.address || ""
            : `${b.user?.fname || ""} ${b.user?.lname || ""}`.trim() || b.user?.address || "";
          cmp = nameA.localeCompare(nameB);
        } else if (sortBy === "status") {
          const getStatusRank = (inv) => {
            if (inv.isCancelled) return 3;
            if (inv.isPaid) return 2;
            return 1;
          };
          cmp = getStatusRank(a) - getStatusRank(b);
        }

        if (cmp === 0) {
          const idA = String(a.id || "");
          const idB = String(b.id || "");
          cmp = idA.localeCompare(idB);
        }

        return sortDir === "desc" ? -cmp : cmp;
      });
    }

    return result;
  }, [invoices, status, fromDate, toDate, token, minAmount, maxAmount, sortBy, sortDir, isSent]);

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
