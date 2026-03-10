"use client";

import {
  resolveChainMeta,
  formatNetworkFee,
  formatInvoiceId,
  resolveStatus,
  buildParty,
  toDisplayDate,
} from "./invoiceExportHelpers";

/**
 * Generate CSV string from invoice data
 * @param {Object} invoice - Invoice object
 * @param {string|BigInt} fee - Network fee (wei)
 * @returns {string} CSV formatted string
 */
const generateCSVContent = (invoice, fee = 0) => {
  if (!invoice) {
    throw new Error("Invoice is required");
  }

  const { nativeSymbol, tokenSymbol } = resolveChainMeta(invoice);
  const invoiceId = formatInvoiceId(invoice);
  const status = resolveStatus(invoice);
  const from = buildParty(invoice.user, "N/A");
  const to = buildParty(invoice.client, "N/A");
  const issueDate = toDisplayDate(invoice.issueDate);
  const dueDate = toDisplayDate(invoice.dueDate);
  const networkFee = formatNetworkFee(fee);

  const escapeCSV = (value) => {
    let str = String(value ?? "");

    // Mitigate CSV/Excel formula injection
    // Neutralize cells beginning with =, +, -, or @ (even after leading whitespace)
    const trimmed = str.trimStart();
    if (/^[=+\-@]/.test(trimmed)) {
      str = `'${str}`;
    }

    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = [];

  // Header row for items
  rows.push(
    [
      "InvoiceID",
      "Status",
      "IssueDate",
      "DueDate",
      "FromName",
      "FromEmail",
      "FromAddress",
      "FromCity",
      "FromCountry",
      "FromPostalCode",
      "ToName",
      "ToEmail",
      "ToAddress",
      "ToCity",
      "ToCountry",
      "ToPostalCode",
      "PaymentToken",
      "Item",
      "Quantity",
      "UnitPrice",
      "Discount",
      "Tax",
      "Amount",
      "Subtotal",
      "NetworkFee",
      "NetworkFeeCurrency",
      "Currency",
    ].join(",")
  );

  const items = invoice.items && invoice.items.length > 0 ? invoice.items : [];

  if (items.length === 0) {
    rows.push(
      [
        escapeCSV(invoiceId),
        escapeCSV(status),
        escapeCSV(issueDate),
        escapeCSV(dueDate),
        escapeCSV(from.name),
        escapeCSV(from.email),
        escapeCSV(from.address),
        escapeCSV(from.city || ""),
        escapeCSV(from.country || ""),
        escapeCSV(from.postalCode || ""),
        escapeCSV(to.name),
        escapeCSV(to.email),
        escapeCSV(to.address),
        escapeCSV(to.city || ""),
        escapeCSV(to.country || ""),
        escapeCSV(to.postalCode || ""),
        escapeCSV(tokenSymbol),
        "",
        "",
        "",
        "",
        "",
        "",
        escapeCSV(invoice.amountDue),
        escapeCSV(networkFee),
        escapeCSV(nativeSymbol),
        escapeCSV(tokenSymbol),
      ].join(",")
    );
  } else {
    items.forEach((item, index) => {
      const isFirstRow = index === 0;
      rows.push(
        [
          escapeCSV(invoiceId),
          escapeCSV(status),
          escapeCSV(issueDate),
          escapeCSV(dueDate),
          escapeCSV(from.name),
          escapeCSV(from.email),
          escapeCSV(from.address),
          escapeCSV(from.city || ""),
          escapeCSV(from.country || ""),
          escapeCSV(from.postalCode || ""),
          escapeCSV(to.name),
          escapeCSV(to.email),
          escapeCSV(to.address),
          escapeCSV(to.city || ""),
          escapeCSV(to.country || ""),
          escapeCSV(to.postalCode || ""),
          escapeCSV(tokenSymbol),
          escapeCSV(item.description || "N/A"),
          escapeCSV(item.qty || 0),
          escapeCSV(item.unitPrice || 0),
          escapeCSV(item.discount || "0"),
          escapeCSV(item.tax || "0%"),
          escapeCSV(item.amount || 0),
          isFirstRow ? escapeCSV(invoice.amountDue) : "",
          isFirstRow ? escapeCSV(networkFee) : "",
          isFirstRow ? escapeCSV(nativeSymbol) : "",
          isFirstRow ? escapeCSV(tokenSymbol) : "",
        ].join(",")
      );
    });
  }

  return rows.join("\n");
};

/**
 * Generate and download CSV file for an invoice
 * @param {Object} invoice - Invoice object
 * @param {string|BigInt} fee - Network fee (wei)
 */
export const downloadInvoiceCSV = (invoice, fee = 0) => {
  const csvContent = generateCSVContent(invoice, fee);
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${invoice.id.toString().padStart(6, "0")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
