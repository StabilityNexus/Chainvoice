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

const validBasePayload = {
  clientFname: "John",
  clientEmail: "john@example.com",
  userFname: "Admin",
  userEmail: "admin@example.com",
  userInfo: { userFname: "Admin", userEmail: "admin@example.com" }
};

describe("invoiceValidation.getClientAddressError", () => {
  test("requires address when required flag is true", () => {
    expect(getClientAddressError("", { required: true, ownerAddress: OWNER })).toBe(
      "Please enter a client wallet address"
    );
  });

  test("does not require address when required flag is false", () => {
    expect(getClientAddressError("", { required: false, ownerAddress: OWNER })).toBe("");
  });

  test("blocks same address as connected wallet", () => {
    expect(
      getClientAddressError(OWNER, { required: true, ownerAddress: OWNER })
    ).toBe("You cannot create an invoice for your own wallet");
  });

  test("validates address format", () => {
    expect(
      getClientAddressError("0xinvalid", { required: true, ownerAddress: OWNER })
    ).toBe("Please enter a valid wallet address");
  });

  test("accepts valid address", () => {
    expect(
      getClientAddressError(CLIENT_1, { required: true, ownerAddress: OWNER })
    ).toBe("");
  });
});

describe("invoiceValidation.validateSingleInvoiceData", () => {
  test("accepts valid single invoice payload", () => {
    const result = validateSingleInvoiceData({
      ...validBasePayload,
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
      ...validBasePayload,
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
    expect(result.errorMessage).toBe("Please fix the required fields");
    expect(result.fieldErrors.item_0.amount).toBe(
      "Amount cannot be negative. Reduce discount or update values"
    );
  });

  test("blocks negative quantity/unit price/discount/tax", () => {
    const byField = [
      { field: "qty", expected: "Cannot be negative" },
      { field: "unitPrice", expected: "Cannot be negative" },
      { field: "discount", expected: "Cannot be negative" },
      { field: "tax", expected: "Cannot be negative" },
    ];

    for (const { field, expected } of byField) {
      const item = { ...validItem, [field]: "-1" };
      const result = validateSingleInvoiceData({
        ...validBasePayload,
        clientAddress: CLIENT_1,
        itemData: [item],
        totalAmountDue: "100",
        paymentToken: { symbol: "USDT", decimals: 6 },
        ownerAddress: OWNER,
      });

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe("Please fix the required fields");
      expect(result.fieldErrors.item_0[field]).toBe(expected);
    }
  });

  test("blocks zero or invalid totals", () => {
    const zeroTotal = validateSingleInvoiceData({
      ...validBasePayload,
      clientAddress: CLIENT_1,
      itemData: [validItem],
      totalAmountDue: "0",
      paymentToken: { symbol: "USDT", decimals: 6 },
      ownerAddress: OWNER,
    });
    expect(zeroTotal.isValid).toBe(false);
    expect(zeroTotal.errorMessage).toBe("Invoice total must be greater than 0");

    const invalidTotal = validateSingleInvoiceData({
      ...validBasePayload,
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
      ...validBasePayload,
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
    ...validBasePayload,
    clientAddress: CLIENT_1,
    itemData: [validItem],
    totalAmountDue: "100",
    userInfo: { userFname: "Admin", userEmail: "admin@example.com" },
    ...overrides,
  });

  const validBatchBase = {
    paymentToken: { symbol: "USDT", decimals: 6 },
    ownerAddress: OWNER,
    userInfo: { userFname: "Admin", userEmail: "admin@example.com" }
  };

  test("returns valid invoices when batch is valid", () => {
    const result = validateBatchInvoiceData({
      ...validBatchBase,
      rows: [makeRow({ clientAddress: CLIENT_1 }), makeRow({ clientAddress: CLIENT_2 })],
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
    expect(result.errorMessage).toBe("Please fix the required fields");
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
    expect(result.errorMessage).toBe("Please fix the required fields");
    expect(result.itemErrors["1_0"].amount).toBe(
      "Amount cannot be negative. Reduce discount or update values"
    );
  });

  test("blocks invoice rows whose totals exceed token precision", () => {
    const result = validateBatchInvoiceData({
      rows: [makeRow({ totalAmountDue: "1.1234567" })],
      paymentToken: { symbol: "USDC", decimals: 6 },
      ownerAddress: OWNER,
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Please fix the required fields");
    expect(result.totalErrors[0]).toBe(
      "Invoice total supports up to 6 decimals for USDC"
    );
  });

  test("fails when no row contains meaningful invoice data", () => {
    const result = validateBatchInvoiceData({
      ...validBatchBase,
      rows: [
        {
          clientAddress: "",
          itemData: [validItem],
          totalAmountDue: "0",
        },
      ],
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      "Please add at least one valid invoice with client address and amount"
    );
  });
});
