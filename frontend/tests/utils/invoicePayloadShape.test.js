import { getPayloadShapeError } from "../../src/utils/invoicePayloadShape.js";
import { createEmptyInvoiceItem } from "../../src/utils/productCatalogInvoiceHelpers.js";

const SENDER = "0x1111111111111111111111111111111111111111";
const RECIPIENT = "0x2222222222222222222222222222222222222222";

/** The shape CreateInvoice and CreateInvoicesBatch send over the relay. */
const makePayload = (overrides = {}) => ({
  amountDue: "125.5",
  dueDate: "2026-10-31",
  issueDate: "2026-10-01",
  paymentToken: { address: "0x3333333333333333333333333333333333333333", symbol: "USDC", decimals: 6 },
  user: { address: SENDER, fname: "Ada", lname: "Lovelace", email: "ada@example.com", country: "UK", city: "London", postalcode: "N1" },
  client: { address: RECIPIENT, fname: "Bob", lname: "", email: "", country: "", city: "", postalcode: "" },
  items: [{ ...createEmptyInvoiceItem(), description: "Consulting", qty: "1", unitPrice: "125.5", amount: "125.5" }],
  ...overrides,
});

describe("getPayloadShapeError", () => {
  test("accepts the payloads this app creates", () => {
    expect(getPayloadShapeError(makePayload())).toBeNull();
    expect(
      getPayloadShapeError(
        makePayload({
          batchInfo: { batchId: "batch_1", batchSize: 3, index: 0, batchType: "user_created" },
        })
      )
    ).toBeNull();
  });

  test("accepts the sender's stored copy, which keeps Date objects", () => {
    const payload = makePayload({
      issueDate: new Date("2026-10-01T09:30:00Z"),
      dueDate: new Date("2026-10-31T00:00:00Z"),
    });
    expect(getPayloadShapeError(payload)).toBeNull();
  });

  test("accepts numbers in item amounts and missing optional fields", () => {
    const payload = makePayload({
      dueDate: null,
      client: { address: RECIPIENT },
      items: [{ description: "Hours", qty: 3, unitPrice: 40, amount: 120 }],
    });
    expect(getPayloadShapeError(payload)).toBeNull();
  });

  test.each([
    ["not an object", "x", "payload"],
    ["an array", [], "payload"],
  ])("rejects a payload that is %s", (_, payload, field) => {
    expect(getPayloadShapeError(payload)).toBe(field);
  });

  test.each([
    ["a number as the sender's name", { user: { address: SENDER, fname: 123 } }, "user"],
    ["an object as the client's email", { client: { address: RECIPIENT, email: { a: 1 } } }, "client"],
    ["a missing client", { client: undefined }, "client"],
    ["items that are not a list", { items: "x" }, "items"],
    ["a null item", { items: [null] }, "items"],
    ["a nested object in an item", { items: [{ description: "x", qty: { n: 1 } }] }, "items"],
    ["a number as an item description", { items: [{ description: 5 }] }, "items"],
    ["batch info that is a string", { batchInfo: "batch" }, "batchInfo"],
    ["empty batch info", { batchInfo: {} }, "batchInfo"],
    ["a number as the batch id", { batchInfo: { batchId: 12345, batchSize: 2, index: 0 } }, "batchInfo"],
    ["an empty batch id", { batchInfo: { batchId: "", batchSize: 2, index: 0 } }, "batchInfo"],
    ["a missing batch size", { batchInfo: { batchId: "batch_1", index: 0 } }, "batchInfo"],
    ["a zero batch size", { batchInfo: { batchId: "batch_1", batchSize: 0, index: 0 } }, "batchInfo"],
    ["a text batch index", { batchInfo: { batchId: "batch_1", batchSize: 2, index: "0" } }, "batchInfo"],
    ["a fractional batch index", { batchInfo: { batchId: "batch_1", batchSize: 2, index: 0.5 } }, "batchInfo"],
    ["a negative batch index", { batchInfo: { batchId: "batch_1", batchSize: 2, index: -1 } }, "batchInfo"],
    ["a batch index past the batch size", { batchInfo: { batchId: "batch_1", batchSize: 2, index: 2 } }, "batchInfo"],
    ["a number as the batch type", { batchInfo: { batchId: "batch_1", batchSize: 2, index: 0, batchType: 1 } }, "batchInfo"],
    ["an object as the due date", { dueDate: { y: 2026 } }, "dueDate"],
    ["an invalid Date as the issue date", { issueDate: new Date("not a date") }, "issueDate"],
    ["an object as the amount", { amountDue: { value: "1" } }, "amountDue"],
    ["a token without an address", { paymentToken: { symbol: "USDC", decimals: 6 } }, "paymentToken"],
  ])("rejects %s", (_, overrides, field) => {
    expect(getPayloadShapeError(makePayload(overrides))).toBe(field);
  });
});
