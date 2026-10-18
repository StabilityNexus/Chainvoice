import { describe, expect, it } from "@jest/globals";
import { AbiCoder, Interface, makeError } from "ethers";
import { ChainvoiceABI } from "../../src/contractsABI/ChainvoiceABI.js";
import en from "../../src/locales/en.json";
import {
  PAYMENT_ERROR_KEYS,
  decodeContractError,
  findRevertData,
  getPaymentErrorMessage,
} from "../../src/utils/paymentErrors.js";

const iface = new Interface(ChainvoiceABI);
const messages = en.receivedInvoices.errors;

// Resolves a result the way the page does: the key under receivedInvoices.errors
// with its {{placeholders}} filled in.
const render = ({ key, params }) =>
  messages[key].replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) => params?.[name]);
const messageFor = (error) => render(getPaymentErrorMessage(error));

const selectorOf = (name) => iface.getError(name).selector;

// How a failed payment looks on the app's real stack (a viem wallet client wrapped
// in an ethers BrowserProvider, checked against a local anvil deployment of the
// contract): a CALL_EXCEPTION whose `reason` and `revert` are both null, and the
// revert data in `data` and `info.error.data`. makeError builds the same object.
const callException = (data, extra = {}) =>
  makeError("execution reverted (unknown custom error)", "CALL_EXCEPTION", {
    action: "estimateGas",
    data,
    reason: null,
    transaction: {
      to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      data: "0xac60a6cd0000000000000000000000000000000000000000000000000000000000000002",
      from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    },
    invocation: null,
    revert: null,
    info: {
      error: {
        code: 3,
        data,
        message: `RPC Request failed.\n\nDetails: execution reverted: custom error ${data}`,
      },
      payload: { method: "eth_estimateGas", params: [], id: 1, jsonrpc: "2.0" },
    },
    ...extra,
  });

// The selectors seen when each failure was triggered on a local anvil deployment
// of the contract. Pinning them ties the tests to what the chain really returned,
// and the ABI lookup below fails if the contract's errors ever change.
const CAPTURED_FROM_ANVIL = [
  ["pay an unknown invoice", "0x15a6bc43", "InvalidInvoiceId"],
  ["pay with the wrong value", "0x6992e1ff", "IncorrectPaymentAmount"],
  ["pay from the wrong account", "0x18bb1a3b", "NotAuthorizedPayer"],
  ["pay a cancelled invoice", "0xbe0fbbde", "InvoiceCancelledError"],
  ["pay an invoice twice", "0x322be652", "InvoiceAlreadyPaid"],
  ["pay a token invoice without an allowance", "0x13be252b", "InsufficientAllowance"],
  ["pay a token invoice with the wrong native fee", "0xeca3f214", "FeeMustBeNative"],
  ["batch containing a settled invoice", "0x560ff900", "AlreadySettled"],
  ["batch of the wrong size", "0x7862e959", "InvalidBatchSize"],
  ["batch with the wrong total", "0x0a3372a3", "IncorrectNativeValue"],
];

describe("the contract's payment errors", () => {
  it.each(CAPTURED_FROM_ANVIL)("%s reverts with the selector the ABI names %s", (_scenario, selector, name) => {
    expect(selectorOf(name)).toBe(selector);
  });

  it("maps only errors that the ABI defines", () => {
    for (const name of Object.keys(PAYMENT_ERROR_KEYS)) {
      expect(iface.getError(name)).not.toBeNull();
    }
  });

  it("maps only parameterless errors, so there is nothing to lose by not formatting arguments", () => {
    for (const name of Object.keys(PAYMENT_ERROR_KEYS)) {
      expect(iface.getError(name).inputs).toHaveLength(0);
    }
  });

  it("gives every error its own key and its own message", () => {
    const keys = Object.values(PAYMENT_ERROR_KEYS);
    expect(new Set(keys).size).toBe(keys.length);

    const texts = keys.map((key) => messages[key]);
    expect(texts.every((text) => typeof text === "string" && text.length > 0)).toBe(true);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

describe("getPaymentErrorMessage for each failure from issue #292", () => {
  it.each([
    ["pay an unknown invoice", "InvalidInvoiceId", /doesn't exist on the network/],
    ["pay with the wrong value", "IncorrectPaymentAmount", /amount sent doesn't match/],
    ["pay from the wrong account", "NotAuthorizedPayer", /issued to a different wallet/],
    ["pay a cancelled invoice", "InvoiceCancelledError", /sender cancelled this invoice/],
    ["pay an invoice twice", "InvoiceAlreadyPaid", /already been paid/],
  ])("%s", (_scenario, name, expected) => {
    expect(messageFor(callException(selectorOf(name)))).toMatch(expected);
  });

  it("gives each of the five a different message, none of them about the balance", () => {
    const texts = ["InvalidInvoiceId", "IncorrectPaymentAmount", "NotAuthorizedPayer", "InvoiceCancelledError", "InvoiceAlreadyPaid"].map(
      (name) => messageFor(callException(selectorOf(name)))
    );

    expect(new Set(texts).size).toBe(5);
    for (const text of texts) {
      expect(text).not.toMatch(/insufficient balance/i);
      expect(text).not.toBe(messages.reverted);
      expect(text).not.toBe(messages.generic);
    }
  });
});

describe("getPaymentErrorMessage for every payment error in the contract", () => {
  it.each(Object.entries(PAYMENT_ERROR_KEYS))("%s -> %s", (name, key) => {
    const result = getPaymentErrorMessage(callException(selectorOf(name)));

    expect(result.key).toBe(key);
    expect(render(result)).toBe(messages[key]);
    expect(key).not.toBe("reverted");
    expect(key).not.toBe("generic");
  });

  it("names the token and batch failures specifically", () => {
    expect(messageFor(callException(selectorOf("InsufficientAllowance")))).toMatch(/approve/i);
    expect(messageFor(callException(selectorOf("FeeMustBeNative")))).toMatch(/native currency/);
    expect(messageFor(callException(selectorOf("AlreadySettled")))).toMatch(/already been paid or cancelled/);
    expect(messageFor(callException(selectorOf("MixedTokenBatch")))).toMatch(/same token/);
    expect(messageFor(callException(selectorOf("InvalidBatchSize")))).toMatch(/number of invoices|isn't allowed/);
    expect(messageFor(callException(selectorOf("IncorrectNativeValue")))).toMatch(/total sent for this batch/);
    expect(messageFor(callException(selectorOf("NativeTransferFailed")))).toMatch(/can't receive this payment/);
    expect(messageFor(callException(selectorOf("TokenAmountShortfall")))).toMatch(/takes a fee on every transfer/);
  });
});

describe("a decoded revert wins over the loose keyword matching", () => {
  it("keeps InvoiceCancelledError when the surrounding message mentions the network", () => {
    const error = Object.assign(callException(selectorOf("InvoiceCancelledError")), {
      message: "network request failed while sending",
    });

    expect(getPaymentErrorMessage(error).key).toBe("cancelled");
  });

  it("keeps InvoiceAlreadyPaid when the surrounding message mentions insufficient balance", () => {
    const error = Object.assign(callException(selectorOf("InvoiceAlreadyPaid")), {
      message: "insufficient balance in the details of this rpc error",
    });

    expect(getPaymentErrorMessage(error).key).toBe("alreadyPaid");
  });
});

describe("where the revert data can be found", () => {
  const data = selectorOf("InvoiceCancelledError");
  const cancelled = messages.cancelled;

  it("reads error.data, as ethers sets it on the send path", () => {
    expect(findRevertData(callException(data))).toBe(data);
  });

  it("reads error.info.error.data when error.data is missing", () => {
    const error = callException(data, { data: undefined });

    expect(messageFor(error)).toBe(cancelled);
  });

  it("reads error.error.data", () => {
    const error = Object.assign(new Error("execution reverted"), { code: "CALL_EXCEPTION", error: { data } });

    expect(messageFor(error)).toBe(cancelled);
  });

  it("reads revert data nested the way MetaMask wraps it", () => {
    const error = Object.assign(new Error("Internal JSON-RPC error."), {
      code: "CALL_EXCEPTION",
      data: { code: 3, message: "execution reverted", data },
    });

    expect(messageFor(error)).toBe(cancelled);
  });

  it("reads revert data under cause, where viem puts it", () => {
    const error = Object.assign(new Error("RPC request failed"), {
      code: "CALL_EXCEPTION",
      cause: { data: { originalError: { data } } },
    });

    expect(messageFor(error)).toBe(cancelled);
  });

  it("falls back to the data quoted in an ethers message", () => {
    const error = new Error(`execution reverted (unknown custom error) (action="estimateGas", data="${data}", reason=null)`);

    expect(findRevertData(error)).toBe(data);
    expect(messageFor(error)).toBe(cancelled);
  });

  it("falls back to the selector quoted as a custom error", () => {
    const error = new Error(`Details: execution reverted: custom error ${data}`);

    expect(messageFor(error)).toBe(cancelled);
  });

  it("ignores data too short to be a selector", () => {
    expect(findRevertData(callException("0x"))).toBeNull();
    expect(findRevertData({ data: "0x1234" })).toBeNull();
  });

  it("does not loop on a circular error", () => {
    const error = { code: "CALL_EXCEPTION" };
    error.cause = error;
    error.info = { error };

    expect(findRevertData(error)).toBeNull();
    expect(getPaymentErrorMessage(error).key).toBe("reverted");
  });
});

describe("errors that are not one of the payment errors", () => {
  it("shows the reason of a built-in Error(string) revert, such as a token refusing the transfer", () => {
    const reason = "ERC20: transfer amount exceeds balance";
    const data = "0x08c379a0" + AbiCoder.defaultAbiCoder().encode(["string"], [reason]).slice(2);
    const error = makeError("execution reverted", "CALL_EXCEPTION", {
      action: "estimateGas",
      data,
      reason,
      transaction: { to: "0x5FbDB2315678afecb367f032d93F642f64180aa3", data: "0x" },
      invocation: null,
      revert: { signature: "Error(string)", name: "Error", args: [reason] },
    });

    expect(getPaymentErrorMessage(error)).toEqual({ key: "failedWithReason", params: { reason } });
    expect(messageFor(error)).toBe(`Transaction failed: ${reason}`);
  });

  it("shows the reason of an Error(string) revert whose data was not passed on", () => {
    const error = Object.assign(new Error("execution reverted"), { code: "CALL_EXCEPTION", reason: "Pausable: paused" });

    expect(messageFor(error)).toBe("Transaction failed: Pausable: paused");
  });

  it("names a contract error that payments are not expected to raise", () => {
    const error = callException(selectorOf("InvalidPublicKey"));

    expect(getPaymentErrorMessage(error)).toEqual({ key: "contractRejected", params: { name: "InvalidPublicKey" } });
    expect(messageFor(error)).toBe("The contract rejected this transaction (InvalidPublicKey).");
  });

  it("reports declining in the wallet as a choice, not a failure", () => {
    expect(getPaymentErrorMessage({ code: "ACTION_REJECTED" }).key).toBe("walletCancelled");
    expect(getPaymentErrorMessage({ code: 4001 }).key).toBe("walletCancelled");
    expect(getPaymentErrorMessage(new Error("User rejected the request.")).key).toBe("walletRejected");
    expect(getPaymentErrorMessage(new Error("User denied transaction signature")).key).toBe("walletRejected");
  });

  it("does not mistake a wallet cancellation for a cancelled invoice", () => {
    for (const message of ["Request cancelled by user", "user cancelled the transaction", "The request was cancelled"]) {
      const text = messageFor(new Error(message));

      expect(text).not.toBe(messages.cancelled);
      expect(text).not.toMatch(/invoice/i);
    }
  });

  it("reports an empty balance", () => {
    expect(getPaymentErrorMessage({ code: "INSUFFICIENT_FUNDS" }).key).toBe("insufficientFunds");
    expect(getPaymentErrorMessage(new Error("insufficient funds for gas * price + value")).key).toBe("insufficientFunds");
  });

  it("reports a network failure", () => {
    expect(getPaymentErrorMessage({ code: "NETWORK_ERROR" }).key).toBe("network");
    expect(getPaymentErrorMessage(new Error("could not detect network")).key).toBe("network");
  });

  it("reports a gas estimation failure", () => {
    expect(getPaymentErrorMessage(new Error("cannot estimate gas")).key).toBe("gas");
  });
});

describe("the generic fallbacks", () => {
  it("uses a neutral message for a revert with no data", () => {
    const error = callException(null, { info: undefined });

    expect(getPaymentErrorMessage(error).key).toBe("reverted");
    expect(messageFor(error)).not.toMatch(/insufficient balance/i);
  });

  it("uses it for a selector the contract does not define", () => {
    expect(decodeContractError(callException("0xdeadbeef"))).toBeNull();
    expect(getPaymentErrorMessage(callException("0xdeadbeef")).key).toBe("reverted");
  });

  it("does not read the word gas in an ethers call-exception message as a gas problem", () => {
    const error = callException("0xdeadbeef");

    expect(error.message).toMatch(/estimateGas/);
    expect(getPaymentErrorMessage(error).key).toBe("reverted");
  });

  it("uses the generic message for an unrecognised error", () => {
    expect(getPaymentErrorMessage(new Error("boom")).key).toBe("generic");
    expect(messageFor(new Error("boom"))).toBe("Payment failed. Please try again or contact support");
  });

  it("never shows raw error text", () => {
    expect(messageFor(new Error("TypeError: cannot read properties of undefined"))).not.toMatch(/TypeError/);
  });

  it.each([[null], [undefined], ["a string"], [42], [{}], [[]]])("does not crash on %p", (value) => {
    const result = getPaymentErrorMessage(value);

    expect(result.key).toBe("generic");
    expect(typeof messageFor(value)).toBe("string");
  });
});

describe("the message catalogue", () => {
  it("has a message for every key the mapper can return", () => {
    const keys = new Set([
      ...Object.values(PAYMENT_ERROR_KEYS),
      "walletCancelled",
      "walletRejected",
      "failedWithReason",
      "contractRejected",
      "insufficientFunds",
      "network",
      "gas",
      "reverted",
      "generic",
    ]);

    for (const key of keys) {
      expect(typeof messages[key]).toBe("string");
    }
    expect(Object.keys(messages).sort()).toEqual([...keys].sort());
  });
});
