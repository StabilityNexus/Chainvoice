import {
  getLineAmountDetails,
  getSafeLineAmountDisplay,
  parseNumericInputToWei,
} from "../../src/utils/invoiceCalculations.js";

describe("invoiceCalculations.parseNumericInputToWei", () => {
  test("returns 0n for empty values", () => {
    expect(parseNumericInputToWei("")).toBe(0n);
    expect(parseNumericInputToWei(null)).toBe(0n);
    expect(parseNumericInputToWei(undefined)).toBe(0n);
  });

  test("parses positive and negative decimals", () => {
    expect(parseNumericInputToWei("1.5")).toBe(1500000000000000000n);
    expect(parseNumericInputToWei("-2.25")).toBe(-2250000000000000000n);
  });

  test("returns null for invalid numeric formats", () => {
    expect(parseNumericInputToWei("abc")).toBeNull();
    expect(parseNumericInputToWei("1.2.3")).toBeNull();
    expect(parseNumericInputToWei("-.")).toBeNull();
  });
});

describe("invoiceCalculations.getLineAmountDetails", () => {
  test("computes amount with discount and tax", () => {
    const result = getLineAmountDetails({
      qty: "10",
      unitPrice: "10",
      discount: "5",
      tax: "10",
    });

    expect(result.valid).toBe(true);
    expect(result.lineTotalWei).toBe(100000000000000000000n);
    expect(result.taxAmountWei).toBe(10000000000000000000n);
    expect(result.amountWei).toBe(105000000000000000000n);
  });

  test("can produce negative line amount when discount is too high", () => {
    const result = getLineAmountDetails({
      qty: "10",
      unitPrice: "10",
      discount: "1000",
      tax: "0",
    });

    expect(result.valid).toBe(true);
    expect(result.amountWei).toBe(-900000000000000000000n);
  });

  test("marks line invalid when any input format is invalid", () => {
    const result = getLineAmountDetails({
      qty: "x",
      unitPrice: "10",
      discount: "0",
      tax: "0",
    });

    expect(result.valid).toBe(false);
    expect(result.amountWei).toBe(0n);
  });
});

describe("invoiceCalculations.getSafeLineAmountDisplay", () => {
  test("clamps negative line amount to 0 for display", () => {
    const display = getSafeLineAmountDisplay({
      qty: "10",
      unitPrice: "10",
      discount: "1000",
      tax: "0",
    });

    expect(display).toBe("0.0");
  });

  test("returns empty string for invalid line inputs", () => {
    expect(
      getSafeLineAmountDisplay({
        qty: "bad",
        unitPrice: "10",
        discount: "0",
        tax: "0",
      })
    ).toBe("");
  });
});
