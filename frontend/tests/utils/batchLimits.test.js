import { readFileSync } from "node:fs";
import {
  MAX_INVOICES_PER_BATCH,
  getMaxInvoicesPerBatch,
} from "../../src/utils/batchLimits.js";

describe("getMaxInvoicesPerBatch", () => {
  it("matches the contract's MAX_CREATE_BATCH", () => {
    const source = readFileSync(
      new URL("../../../contracts/src/Chainvoice.sol", import.meta.url),
      "utf8"
    );
    const match = source.match(/MAX_CREATE_BATCH\s*=\s*(\d+)/);
    expect(Number(match[1])).toBe(MAX_INVOICES_PER_BATCH);
  });

  it("caps Sepolia below its per-transaction gas limit", () => {
    expect(getMaxInvoicesPerBatch(11155111)).toBe(15);
    expect(getMaxInvoicesPerBatch("11155111")).toBe(15);
  });

  it("uses the contract limit on Ethereum Classic and other chains", () => {
    expect(getMaxInvoicesPerBatch(61)).toBe(MAX_INVOICES_PER_BATCH);
    expect(getMaxInvoicesPerBatch(1)).toBe(MAX_INVOICES_PER_BATCH);
  });

  it("uses the contract limit while no chain is known", () => {
    expect(getMaxInvoicesPerBatch(undefined)).toBe(MAX_INVOICES_PER_BATCH);
  });
});
