"use client";

import {
  resolveChainMeta,
  formatNetworkFee,
  formatInvoiceId,
  resolveStatus,
  buildParty,
  toISODate,
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
  const issueDate = toISODate(invoice.issueDate) || "";
  const dueDate = toISODate(invoice.dueDate) || "";
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
 * Generate and download CSV file for one or more invoices
 * @param {Object|Object[]} invoiceOrInvoices - Single invoice object or array of invoices
 * @param {string|BigInt} fee - Network fee (wei)
 */
export const downloadInvoiceCSV = (invoiceOrInvoices, fee = 0) => {
  if (!invoiceOrInvoices) return;

  const invoices = Array.isArray(invoiceOrInvoices)
    ? invoiceOrInvoices
    : [invoiceOrInvoices];

  if (invoices.length === 0 || invoices.every((inv) => !inv)) return;

  let combinedCSV = "";
  invoices.forEach((invoice, index) => {
    const csvContent = generateCSVContent(invoice, fee);
    if (index === 0) {
      combinedCSV = csvContent;
    } else {
      // Skip the header row for subsequent invoices
      const lines = csvContent.split("\n");
      combinedCSV += "\n" + lines.slice(1).join("\n");
    }
  });

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + combinedCSV], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  if (invoices.length === 1) {
    link.download = `invoice-${formatInvoiceId(invoices[0])}.csv`;
  } else {
    link.download = `invoices-export-${new Date().getTime()}.csv`;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
