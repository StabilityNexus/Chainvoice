"use client";

import {
  resolveChainMeta,
  formatNetworkFee,
  formatInvoiceId,
  resolveStatus,
  buildParty,
  normalizeItem,
  toISODate,
} from "./invoiceExportHelpers";

/**
 * Generate structured JSON object from invoice data
 * @param {Object} invoice - Invoice object
 * @param {string|BigInt} fee - Network fee (wei)
 * @returns {Object} Structured invoice data
 */
const generateJSONContent = (invoice, fee = 0) => {
  if (!invoice) {
    throw new Error("Invoice is required");
  }

  const { chainId, nativeSymbol, nativeName, tokenSymbol } = resolveChainMeta(invoice);
  const networkFee = formatNetworkFee(fee);

  return {
    invoiceId: formatInvoiceId(invoice),
    status: resolveStatus(invoice),
    issueDate: toISODate(invoice.issueDate),
    dueDate: toISODate(invoice.dueDate),
    from: buildParty(invoice.user),
    billTo: buildParty(invoice.client),
    paymentToken: {
      name: invoice.paymentToken?.name || nativeName,
      symbol: tokenSymbol,
      address: invoice.paymentToken?.address || null,
      decimals: invoice.paymentToken?.decimals ?? 18,
      chainId: chainId || null,
    },
    items: (invoice.items || []).map(normalizeItem),
    subtotal: invoice.amountDue || "0",
    networkFee: networkFee,
    networkFeeCurrency: nativeSymbol,
    currency: tokenSymbol,
  };
};

/**
 * Generate and download JSON file for one or more invoices
 * @param {Object|Object[]} invoiceOrInvoices - Single invoice object or array of invoices
 * @param {string|BigInt} fee - Network fee (wei)
 */
export const downloadInvoiceJSON = (invoiceOrInvoices, fee = 0) => {
  if (!invoiceOrInvoices) return;

  const invoices = Array.isArray(invoiceOrInvoices)
    ? invoiceOrInvoices
    : [invoiceOrInvoices];

  if (invoices.length === 0 || invoices.every((inv) => !inv)) return;

  let jsonContent;
  if (invoices.length === 1) {
    jsonContent = generateJSONContent(invoices[0], fee);
  } else {
    jsonContent = invoices.map((inv) => generateJSONContent(inv, fee));
  }

  const jsonString = JSON.stringify(jsonContent, null, 2);
  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  if (invoices.length === 1) {
    link.download = `invoice-${formatInvoiceId(invoices[0])}.json`;
  } else {
    link.download = `invoices-export-${new Date().getTime()}.json`;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
