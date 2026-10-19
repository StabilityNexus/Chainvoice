import { readFileSync } from "node:fs";
import { getBatchCreateErrorKey } from "../../src/utils/batchCreateError.js";

const en = JSON.parse(
  readFileSync(new URL("../../src/locales/en.json", import.meta.url), "utf8")
);

const cases = [
  [{ code: "ACTION_REJECTED" }, "cancelled"],
  [{ code: 4001 }, "cancelled"],
  [{ code: "INSUFFICIENT_FUNDS" }, "insufficientFunds"],
  [{ message: "insufficient funds for gas * price + value" }, "insufficientFunds"],
  [{ code: "NETWORK_ERROR" }, "network"],
  [new Error("Unsupported network"), "unsupportedNetwork"],
  [{ code: "CALL_EXCEPTION", revert: { name: "InvalidBatchSize" } }, "batchTooLarge"],
  [{ code: "CALL_EXCEPTION", revert: { name: "NotContract" } }, "invalidToken"],
  [{ code: "CALL_EXCEPTION", revert: { name: "InvalidToken" } }, "invalidToken"],
  [{ code: "CALL_EXCEPTION", revert: null, receipt: { status: 0 } }, "reverted"],
  [{ code: "CALL_EXCEPTION", revert: { name: "SelfInvoicing" } }, "rejected"],
  [{ code: "CALL_EXCEPTION", revert: null }, "rejected"],
  [new Error('transaction execution reverted (action="sendTransaction")'), "generic"],
  [undefined, "generic"],
];

describe("getBatchCreateErrorKey", () => {
  test.each(cases)("maps %p to %s", (error, expected) => {
    expect(getBatchCreateErrorKey(error)).toBe(expected);
  });

  test("every key has a message in en.json", () => {
    for (const [, key] of cases) {
      expect(typeof en.batchInvoice.errors[key]).toBe("string");
    }
  });
});
