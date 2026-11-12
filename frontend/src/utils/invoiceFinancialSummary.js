
const ZERO_TOTALS = () => ({
  total: 0,
  paid: 0,
  outstanding: 0,
  cancelled: 0,
  totalBaseUnits: 0n,
  paidBaseUnits: 0n,
  outstandingBaseUnits: 0n,
  cancelledBaseUnits: 0n,
});

export function classifyInvoiceStatus(invoice) {
  if (invoice.isCancelled) return "cancelled";
  if (invoice.isPaid) return "paid";
  return "outstanding";
}

export function summarizeInvoices(invoices) {
  if (!Array.isArray(invoices)) {
    throw new Error("Invoices must be provided as an array.");
  }

  const groups = new Map();

  for (const invoice of invoices) {
    const chainId = String(invoice?.chainId ?? "");
    const rawTokenAddress = invoice?.paymentToken?.address;
    const decimals = invoice?.paymentToken?.decimals;
    const amount = invoice?.amountDueBaseUnits;

    if (
      !chainId ||
      typeof rawTokenAddress !== "string" ||
      !rawTokenAddress.trim()
    ) {
      throw new Error("Missing chain or token metadata.");
    }

    const tokenAddress = rawTokenAddress.toLowerCase();

    if (
      !Number.isInteger(decimals) ||
      decimals < 0 ||
      decimals > 255
    ) {
      throw new Error(
        `Invalid token decimals for ${tokenAddress} on chain ${chainId}.`
      );
    }

    if (
      typeof amount !== "string" ||
      !/^\d+$/.test(amount)
    ) {
      throw new Error(
        `Invalid on-chain amount for invoice ${String(invoice?.id)}.`
      );
    }

    const key = `${chainId}:${tokenAddress}`;

    if (!groups.has(key)) {
      groups.set(key, {
        chainId,
        tokenAddress,
        symbol: invoice.paymentToken.symbol || "Unknown token",
        decimals,
        ...ZERO_TOTALS(),
      });
    }

    const group = groups.get(key);

    if (group.decimals !== decimals) {
      throw new Error(
        `Inconsistent decimals for ${tokenAddress} on chain ${chainId}.`
      );
    }

    const amountBaseUnits = BigInt(amount);
    const status = classifyInvoiceStatus(invoice);

    group.total += 1;
    group.totalBaseUnits += amountBaseUnits;

    if (status === "paid") {
      group.paid += 1;
      group.paidBaseUnits += amountBaseUnits;
    } else if (status === "cancelled") {
      group.cancelled += 1;
      group.cancelledBaseUnits += amountBaseUnits;
    } else {
      group.outstanding += 1;
      group.outstandingBaseUnits += amountBaseUnits;
    }
  }

  return Array.from(groups.values());
}
