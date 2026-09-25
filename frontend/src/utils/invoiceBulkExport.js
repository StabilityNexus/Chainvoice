import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { downloadInvoiceCSV } from "./generateInvoiceCSV";
import { downloadInvoiceJSON } from "./generateInvoiceJSON";
import { generateInvoicePDF } from "./generateInvoicePDF";

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
};

const getInvoiceId = (invoice) =>
    String(invoice?.id ?? "unknown").padStart(6, "0");

const getInvoiceFilename = (invoice, extension) =>
    `invoice-${getInvoiceId(invoice)}.${extension}`;

const escapeCSVValue = (value) => {
    let text = String(value ?? "");

    // Prevent spreadsheet formula injection.
    if (/^[=+\-@]/.test(text)) {
        text = `'${text}`;
    }

    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n") ||
        text.includes("\r")
    ) {
        return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
};

const createSimpleCSV = (invoice) => {
    const headers = [
        "Invoice ID",
        "Client",
        "Receiver",
        "Amount",
        "Status",
        "Date",
    ];

    const row = [
        invoice?.id,
        invoice?.fname ?? invoice?.senderName ?? "",
        invoice?.to ?? invoice?.receiverName ?? "",
        invoice?.amountDue ?? invoice?.amount ?? "",
        invoice?.status ?? "",
        invoice?.date ?? invoice?.createdAt ?? "",
    ];

    return [
        headers.map(escapeCSVValue).join(","),
        row.map(escapeCSVValue).join(","),
    ].join("\n");
};

const createMergedPDF = async (invoices, fee) => {
    const mergedPdf = await PDFDocument.create();

    for (const invoice of invoices) {
        const pdf = await generateInvoicePDF(invoice, fee);
        const pdfBytes = pdf.output("arraybuffer");

        const sourcePdf = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(
            sourcePdf,
            sourcePdf.getPageIndices()
        );

        pages.forEach((page) => {
            mergedPdf.addPage(page);
        });
    }

    const mergedBytes = await mergedPdf.save();

    downloadBlob(
        new Blob([mergedBytes], { type: "application/pdf" }),
        `invoices-export-${Date.now()}.pdf`
    );
};

const createZipExport = async (invoices, format, fee) => {
    const zip = new JSZip();

    for (const invoice of invoices) {
        const filename = getInvoiceFilename(invoice, format);

        if (format === "pdf") {
            const pdf = await generateInvoicePDF(invoice, fee);
            zip.file(filename, pdf.output("arraybuffer"));
            continue;
        }

        if (format === "json") {
            zip.file(filename, JSON.stringify(invoice, null, 2));
            continue;
        }

        if (format === "csv") {
            zip.file(filename, createSimpleCSV(invoice));
            continue;
        }

        throw new Error(`Unsupported export format: ${format}`);
    }

    const zipBlob = await zip.generateAsync({
        type: "blob",
    });

    downloadBlob(
        zipBlob,
        `invoices-export-${Date.now()}.zip`
    );
};

export const exportInvoiceBatch = async (
    invoices,
    {
        format = "csv",
        mode = "single",
        fee = 0,
    } = {}
) => {
    if (!Array.isArray(invoices) || invoices.length === 0) {
        throw new Error("No invoices selected");
    }

    const normalizedFormat = String(format).toLowerCase();
    const normalizedMode = String(mode).toLowerCase();

    if (!["csv", "json", "pdf"].includes(normalizedFormat)) {
        throw new Error(`Unsupported export format: ${format}`);
    }

    if (!["single", "separate"].includes(normalizedMode)) {
        throw new Error(`Unsupported export mode: ${mode}`);
    }

    // Separate Files -> ZIP containing one file per invoice.
    if (normalizedMode === "separate") {
        await createZipExport(invoices, normalizedFormat, fee);
        return;
    }

    // Single File exports.
    if (normalizedFormat === "csv") {
        downloadInvoiceCSV(invoices, fee);
        return;
    }

    if (normalizedFormat === "json") {
        downloadInvoiceJSON(invoices, fee);
        return;
    }

    if (normalizedFormat === "pdf") {
        await createMergedPDF(invoices, fee);
    }
};