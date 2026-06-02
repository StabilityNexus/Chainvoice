import {
  getClientAddressError,
  validateBatchInvoiceData,
  validateSingleInvoiceData,
} from "../../src/utils/invoiceValidation.js";

const OWNER = "0x66f820a414680B5bcda5eECA5dea238543F42054";
const CLIENT_1 = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
const CLIENT_2 = "0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73";

const validItem = {
  description: "Consulting",
  qty: "2",
  unitPrice: "50",
  discount: "10",
  tax: "10",
};

describe("invoiceValidation.getClientAddressError", () => {
  test("requires address when required flag is true", () => {
    expect(getClientAddressError("", { required: true, ownerAddress: OWNER })).toBe(
      "Please enter a client wallet address"
    );
  });

  test("rejects malformed wallet addresses", () => {
    expect(getClientAddressError("0x123", { ownerAddress: OWNER })).toBe(
      "Please enter a valid wallet address"
    );
  });

  test("rejects owner self-invoicing", () => {
    expect(getClientAddressError(OWNER, { ownerAddress: OWNER })).toBe(
      "You cannot create an invoice for your own wallet"
    );
  });

  test("accepts a valid client address", () => {
    expect(getClientAddressError(CLIENT_1, { ownerAddress: OWNER })).toBe("");
  });
});

describe("invoiceValidation.validateSingleInvoiceData", () => {
  test("accepts valid single invoice payload", () => {
    const result = validateSingleInvoiceData({
      clientAddress: CLIENT_1,
      itemData: [validItem],
      totalAmountDue: "100",
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBe("");
  });

  test("blocks negative line amount", () => {
    const result = validateSingleInvoiceData({
      clientAddress: CLIENT_1,
      itemData: [
        {
          ...validItem,
          qty: "10",
          unitPrice: "10",
          discount: "1000",
          tax: "0",
        },
      ],
      totalAmountDue: "100",
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      "Line item 1 amount cannot be negative. Reduce discount or update values"
    );
  });

  test("blocks negative quantity/unit price/discount/tax", () => {
    const byField = [
      { field: "qty", expected: "Line item 1: quantity cannot be negative" },
      { field: "unitPrice", expected: "Line item 1: unit price cannot be negative" },
      { field: "discount", expected: "Line item 1: discount cannot be negative" },
      { field: "tax", expected: "Line item 1: tax cannot be negative" },
    ];

    for (const { field, expected } of byField) {
      const item = { ...validItem, [field]: "-1" };
      const result = validateSingleInvoiceData({
        clientAddress: CLIENT_1,
        itemData: [item],
        totalAmountDue: "100",
        paymentToken: { symbol: "USDT", decimals: 6 },
        ownerAddress: OWNER,
      });

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(expected);
    }
  });

  test("blocks zero or invalid totals", () => {
    const zeroTotal = validateSingleInvoiceData({
      clientAddress: CLIENT_1,
      itemData: [validItem],
      totalAmountDue: "0",
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });
    expect(zeroTotal.isValid).toBe(false);
    expect(zeroTotal.errorMessage).toBe("Invoice total must be greater than 0");

    const invalidTotal = validateSingleInvoiceData({
      clientAddress: CLIENT_1,
      itemData: [validItem],
      totalAmountDue: "bad",
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });
    expect(invalidTotal.isValid).toBe(false);
    expect(invalidTotal.errorMessage).toBe("Invoice total must be greater than 0");
  });

  test("blocks token-decimal precision overflow", () => {
    const result = validateSingleInvoiceData({
      clientAddress: CLIENT_1,
      itemData: [validItem],
      totalAmountDue: "1.1234567",
      paymentToken: { symbol: "USDC", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      "Invoice total supports up to 6 decimals for USDC"
    );
  });
});

describe("invoiceValidation.validateBatchInvoiceData", () => {
  const makeRow = (overrides = {}) => ({
    clientAddress: CLIENT_1,
    itemData: [validItem],
    totalAmountDue: "100",
    ...overrides,
  });

  test("returns valid invoices when batch is valid", () => {
    const result = validateBatchInvoiceData({
      rows: [makeRow({ clientAddress: CLIENT_1 }), makeRow({ clientAddress: CLIENT_2 })],
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(true);
    expect(result.validInvoices).toHaveLength(2);
  });

  test("blocks duplicate client wallet addresses", () => {
    const result = validateBatchInvoiceData({
      rows: [makeRow({ clientAddress: CLIENT_1 }), makeRow({ clientAddress: CLIENT_1 })],
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Duplicate client wallet found");
    expect(result.addressErrors[0]).toBe("Duplicate wallet address in batch");
    expect(result.addressErrors[1]).toBe("Duplicate wallet address in batch");
  });

  test("blocks negative line amount in any invoice row", () => {
    const result = validateBatchInvoiceData({
      rows: [
        makeRow({ clientAddress: CLIENT_1 }),
        makeRow({
          clientAddress: CLIENT_2,
          itemData: [
            {
              ...validItem,
              qty: "10",
              unitPrice: "10",
              discount: "1000",
              tax: "0",
            },
          ],
        }),
      ],
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      "Invoice #2, line item 1 amount cannot be negative. Reduce discount or update values"
    );
  });

  test("blocks invoice rows whose totals exceed token precision", () => {
    const result = validateBatchInvoiceData({
      rows: [makeRow({ totalAmountDue: "1.1234567" })],
      paymentToken: { symbol: "USDC", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      "Invoice #1: total supports up to 6 decimals for USDC"
    );
  });

  test("fails when no row contains meaningful invoice data", () => {
    const result = validateBatchInvoiceData({
      rows: [
        {
          clientAddress: "",
          itemData: [validItem],
          totalAmountDue: "0",
        },
      ],
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      "Please add at least one valid invoice with client address and amount"
    );
  });
});
