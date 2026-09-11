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
      (token && token !== "all")
  );

  const availableTokens = useMemo(() => {
    if (!Array.isArray(invoices)) return [];
    const tokenSet = new Set();
    invoices.forEach((inv) => {
      const sym = inv.paymentToken?.symbol;
      if (sym) tokenSet.add(sym);
    });
    return Array.from(tokenSet).sort();
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
        const filterUpper = token.toUpperCase();
        const sym = inv.paymentToken?.symbol?.toUpperCase();
        const addr = inv.paymentToken?.address?.toLowerCase();
        if (sym !== filterUpper && addr !== filterUpper.toLowerCase()) {
          return false;
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
          const valA = parseFloat(a.amountDue) || 0;
          const valB = parseFloat(b.amountDue) || 0;
          cmp = valA - valB;
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
  }, [invoices, status, fromDate, toDate, token, sortBy, sortDir, isSent]);

  return {
    filteredAndSortedInvoices,
    availableTokens,
    filters: { status, fromDate, toDate, token, sortBy, sortDir },
    setFilter,
    handleSort,
    clearFilters,
    hasActiveFilters,
  };
}
