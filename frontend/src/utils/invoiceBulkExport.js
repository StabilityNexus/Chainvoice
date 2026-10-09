import { downloadInvoiceCSV, generateCSVContent } from "./generateInvoiceCSV";
import { downloadInvoiceJSON, generateJSONContent } from "./generateInvoiceJSON";
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

const createMergedPDF = async (invoices, fee) => {
    const { PDFDocument } = await import("pdf-lib");
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
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();

    for (const invoice of invoices) {
        const filename = getInvoiceFilename(invoice, format);

        if (format === "pdf") {
            const pdf = await generateInvoicePDF(invoice, fee);
            zip.file(filename, pdf.output("arraybuffer"));
            continue;
        }

        // Same content as a single-file export; the raw invoice can't be
        // stringified directly because its id is a BigInt.
        if (format === "json") {
            zip.file(
                filename,
                JSON.stringify(generateJSONContent(invoice, fee), null, 2)
            );
            continue;
        }

        if (format === "csv") {
            zip.file(filename, "﻿" + generateCSVContent(invoice, fee));
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