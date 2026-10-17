import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

// generateInvoicePDF reads chain metadata through wagmiChainHelpers, which
// imports the whole React app. These tests only need a chain to look up.
const SEPOLIA = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
};

jest.unstable_mockModule("../../src/utils/wagmiChainHelpers.js", () => ({
  getWagmiChainInfo: (chainId) => (Number(chainId) === SEPOLIA.id ? SEPOLIA : {}),
  getWagmiChainName: (chainId) => (Number(chainId) === SEPOLIA.id ? SEPOLIA.name : undefined),
}));

// In Node, "jspdf" resolves to its CommonJS build, whose default export is the
// exports object. The browser bundle Vite ships exports the class as default,
// which is what generateInvoicePDF imports. Only that shape is adapted here;
// the jsPDF code under test is the real package.
jest.unstable_mockModule("jspdf", () => {
  const exported = jest.requireActual("jspdf");
  return { default: exported.jsPDF ?? exported.default ?? exported };
});

const { generateInvoicePDF } = await import("../../src/utils/generateInvoicePDF.js");
const { exportInvoiceBatch } = await import("../../src/utils/invoiceBulkExport.js");

const FEE_WEI = "500000000000000"; // 0.0005 ETH
const TOKEN_ADDRESS = "0x3333333333333333333333333333333333333333";

const makeInvoice = (overrides = {}) => ({
  id: 7n,
  isPaid: false,
  isCancelled: false,
  amountDue: "1.5",
  chainId: SEPOLIA.id,
  issueDate: "2026-03-01T00:00:00Z",
  dueDate: "2026-03-31T00:00:00Z",
  user: {
    fname: "Alice",
    lname: "Sender",
    address: "1 Chain Street",
    city: "Berlin",
    country: "Germany",
    postalcode: "10115",
    email: "alice@example.org",
  },
  client: {
    fname: "Bob",
    lname: "Payer",
    address: "2 Block Avenue",
    city: "Paris",
    country: "France",
    postalcode: "75001",
    email: "bob@example.org",
  },
  paymentToken: { address: "0x0000000000000000000000000000000000000000" },
  items: [
    { description: "Design work", qty: "1", unitPrice: "1.5", discount: "0", tax: "0%", amount: "1.5" },
  ],
  ...overrides,
});

const makeItems = (count) =>
  Array.from({ length: count }, (_, index) => ({
    description: `Line item ${index + 1}`,
    qty: "1",
    unitPrice: "0.1",
    discount: "0",
    tax: "0%",
    amount: "0.1",
  }));

// jsPDF writes uncompressed content streams by default, so text shows up in
// the raw output as `(text) Tj`.
const pdfText = (pdf) => pdf.output();

const pageCountOf = async (bytes) => (await PDFDocument.load(bytes)).getPageCount();

const startsWithPdfHeader = (bytes) =>
  new TextDecoder().decode(new Uint8Array(bytes).slice(0, 5)) === "%PDF-";

describe("generateInvoicePDF", () => {
  beforeEach(() => {
    // The logo loaders log on every fallback; there is no DOM here.
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns a one-page PDF document with the invoice details", async () => {
    const pdf = await generateInvoicePDF(makeInvoice(), FEE_WEI);

    expect(pdf.internal.getNumberOfPages()).toBe(1);

    const bytes = pdf.output("arraybuffer");
    expect(startsWithPdfHeader(bytes)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(1500);
    expect(await pageCountOf(bytes)).toBe(1);

    const text = pdfText(pdf);
    expect(text).toContain("(INVOICE)");
    expect(text).toContain("(#000007)");
    expect(text).toContain("(UNPAID)");
    expect(text).toContain("(Alice Sender)");
    expect(text).toContain("(Bob Payer)");
    expect(text).toContain("(Design work)");
    expect(text).toContain("(Native Currency)");
    expect(text).toContain("(0.0005 ETH)"); // network fee
    expect(text).toContain("(1.5005 ETH)"); // amount + fee
    expect(text).toContain("(Page 1 of 1)");
  });

  it("falls back to the text mark when no logo can be loaded", async () => {
    const pdf = await generateInvoicePDF(makeInvoice(), FEE_WEI);

    expect(pdfText(pdf)).toContain("(CV)");
  });

  it("shows the paid and cancelled states", async () => {
    const paid = await generateInvoicePDF(makeInvoice({ isPaid: true }), FEE_WEI);
    const cancelled = await generateInvoicePDF(makeInvoice({ isCancelled: true }), FEE_WEI);

    expect(pdfText(paid)).toContain("(PAID)");
    expect(pdfText(cancelled)).toContain("(CANCELLED)");
  });

  it("shows the token, its decimals and the chain for an ERC-20 invoice", async () => {
    const invoice = makeInvoice({
      paymentToken: { address: TOKEN_ADDRESS, symbol: "USDC", name: "USD Coin", decimals: 6 },
      amountDue: "25",
    });
    const text = pdfText(await generateInvoicePDF(invoice, FEE_WEI));

    expect(text).toContain("(USD Coin \\(USDC\\))");
    expect(text).toContain("(Decimals: 6 | Chain: Sepolia)");
    expect(text).toContain("(25 USDC + 0.0005 ETH)");
  });

  it("paginates a long item list and numbers every page", async () => {
    const pdf = await generateInvoicePDF(makeInvoice({ items: makeItems(40) }), FEE_WEI);

    const pages = pdf.internal.getNumberOfPages();
    expect(pages).toBeGreaterThan(1);
    expect(await pageCountOf(pdf.output("arraybuffer"))).toBe(pages);

    const text = pdfText(pdf);
    for (let page = 1; page <= pages; page++) {
      expect(text).toContain(`(Page ${page} of ${pages})`);
    }
  });

  it("renders an invoice with no items", async () => {
    const pdf = await generateInvoicePDF(makeInvoice({ items: [] }), FEE_WEI);

    expect(pdfText(pdf)).toContain("(No items in this invoice)");
  });

  it("rejects a missing invoice", async () => {
    await expect(generateInvoicePDF(null, FEE_WEI)).rejects.toThrow("Invoice is required");
  });

  it("rejects an unknown chain", async () => {
    await expect(
      generateInvoicePDF(makeInvoice({ chainId: 999999 }), FEE_WEI)
    ).rejects.toThrow("unsupported chain");
  });

  it("rejects an ERC-20 invoice without token metadata", async () => {
    const invoice = makeInvoice({ paymentToken: { address: TOKEN_ADDRESS } });

    await expect(generateInvoicePDF(invoice, FEE_WEI)).rejects.toThrow(
      "missing ERC-20 token metadata"
    );
  });
});

describe("jsPDF image embedding", () => {
  // generateInvoicePDF draws the logo from a browser canvas, so it can't run
  // here. This is the same addImage call with a PNG data URL.
  const PNG_1X1 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  it("accepts a PNG data URL with the arguments the generator passes", async () => {
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    pdf.rect(20, 20, 24, 24, "FD");
    expect(() => pdf.addImage(PNG_1X1, "PNG", 22, 22, 20, 20)).not.toThrow();

    expect(pdf.output()).toContain("/Subtype /Image");
    expect(await pageCountOf(pdf.output("arraybuffer"))).toBe(1);
  });
});

describe("exportInvoiceBatch with PDF output", () => {
  let created;

  beforeAll(() => {
    // downloadBlob needs a DOM; capture the blob instead of downloading it.
    globalThis.document = {
      createElement: () => ({ click: () => {}, remove: () => {} }),
      body: { appendChild: () => {} },
    };
  });

  beforeEach(() => {
    created = [];
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      created.push(blob);
      return "blob:test";
    });
    jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const invoices = () => [
    makeInvoice({ id: 1n }),
    makeInvoice({ id: 2n, items: makeItems(40) }),
    makeInvoice({ id: 3n, isPaid: true }),
  ];

  it("merges every invoice PDF into one document with all of their pages", async () => {
    const batch = invoices();
    const expectedPages = (
      await Promise.all(batch.map((invoice) => generateInvoicePDF(invoice, FEE_WEI)))
    ).reduce((sum, pdf) => sum + pdf.internal.getNumberOfPages(), 0);
    expect(expectedPages).toBeGreaterThan(batch.length);

    await exportInvoiceBatch(batch, { format: "pdf", mode: "single", fee: FEE_WEI });

    expect(created).toHaveLength(1);
    expect(created[0].type).toBe("application/pdf");

    const bytes = await created[0].arrayBuffer();
    expect(startsWithPdfHeader(bytes)).toBe(true);
    expect(await pageCountOf(bytes)).toBe(expectedPages);
  });

  it("writes one valid PDF per invoice into a ZIP", async () => {
    await exportInvoiceBatch(invoices(), { format: "pdf", mode: "separate", fee: FEE_WEI });

    expect(created).toHaveLength(1);

    const zip = await JSZip.loadAsync(await created[0].arrayBuffer());
    expect(Object.keys(zip.files).sort()).toEqual([
      "invoice-000001.pdf",
      "invoice-000002.pdf",
      "invoice-000003.pdf",
    ]);

    for (const name of Object.keys(zip.files)) {
      const bytes = await zip.file(name).async("arraybuffer");
      expect(startsWithPdfHeader(bytes)).toBe(true);
      expect(await pageCountOf(bytes)).toBeGreaterThanOrEqual(1);
    }

    const longInvoice = await zip.file("invoice-000002.pdf").async("arraybuffer");
    expect(await pageCountOf(longInvoice)).toBeGreaterThan(1);
  });

  it("rejects an empty selection", async () => {
    await expect(exportInvoiceBatch([], { format: "pdf" })).rejects.toThrow(
      "No invoices selected"
    );
  });
});
