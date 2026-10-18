/**
 * Whether a due date is behind us, comparing calendar days in local time.
 *
 * A due date names a day, not a moment: an invoice due on the 20th is still
 * on time until that day ends, and becomes overdue at local midnight that
 * starts the 21st. Comparing the stored instant (local midnight at the *start*
 * of the due day) with the current time made it overdue the moment its due day
 * began.
 *
 * @param {string|number|Date|null|undefined} dueDate
 * @param {number} [now] - epoch milliseconds, injectable for tests
 * @returns {boolean} false for a missing or invalid date
 */
export function isPastDueDate(dueDate, now = Date.now()) {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;
  // Local midnight starting the day after the due day. The Date constructor
  // rolls the day over and follows daylight-saving changes.
  const firstOverdueMoment = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate() + 1
  ).getTime();
  return now >= firstOverdueMoment;
}

/**
 * Pure helper function for filtering and sorting invoice arrays.
 */
export function filterAndSortInvoices(
  invoices = [],
  {
    status = "all",
    fromDate = "",
    toDate = "",
    token = "all",
    minAmount = "",
    maxAmount = "",
    sortBy = "date",
    sortDir = "desc",
    isSent = false,
  } = {}
) {
  if (!Array.isArray(invoices) || invoices.length === 0) return [];

  let result = invoices.filter((inv) => {
    // 1. Status Filter
    if (status === "paid") {
      if (!inv.isPaid || inv.isCancelled) return false;
    } else if (status === "pending" || status === "unpaid") {
      if (inv.isPaid || inv.isCancelled) return false;
    } else if (status === "overdue") {
      if (inv.isPaid || inv.isCancelled) return false;
      if (!isPastDueDate(inv.dueDate)) return false;
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
      if (tokenLower.startsWith("0x")) {
        if (addr !== tokenLower) {
          return false;
        }
      } else if (addr !== tokenLower && sym !== tokenLower) {
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

  // 5. Sorting
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
          if (inv.isCancelled) return 4;
          if (inv.isPaid) return 3;
          if (!inv.isPaid && !inv.isCancelled && isPastDueDate(inv.dueDate)) {
            return 2;
          }
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
}
