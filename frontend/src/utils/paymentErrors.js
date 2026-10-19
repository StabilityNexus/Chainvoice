import { Interface } from "ethers";
import { ChainvoiceABI } from "../contractsABI/ChainvoiceABI";

/**
 * Turns a failed payment into a message key under `receivedInvoices.errors`
 * in en.json, by decoding the contract's custom error from the revert data.
 *
 * Why the data is decoded here: on the send path ethers reports a custom error
 * as a CALL_EXCEPTION with `reason: null` and `revert: null` (it only decodes the
 * built-in Error(string) and Panic). The only thing that identifies the failure is
 * the 4-byte selector in `error.data`, for example `data: "0x322be652"` for
 * InvoiceAlreadyPaid, so it has to be decoded against the contract ABI.
 */

const chainvoiceInterface = new Interface(ChainvoiceABI);

/**
 * The custom errors payInvoice and payInvoicesBatch can raise, mapped to a
 * message key. All of them are parameterless. Every key is distinct so each
 * failure gets its own message.
 */
export const PAYMENT_ERROR_KEYS = {
  // payInvoice and payInvoicesBatch
  InvalidInvoiceId: "invoiceNotFound",
  NotAuthorizedPayer: "wrongPayer",
  InsufficientAllowance: "insufficientAllowance",
  NativeTransferFailed: "senderCannotReceive",
  TokenAmountShortfall: "tokenTakesFee",
  Reentrancy: "busy",
  // payInvoice
  InvoiceAlreadyPaid: "alreadyPaid",
  InvoiceCancelledError: "cancelled",
  IncorrectPaymentAmount: "amountMismatch",
  FeeMustBeNative: "feeMismatch",
  // payInvoicesBatch
  AlreadySettled: "batchSettled",
  MixedTokenBatch: "mixedTokens",
  InvalidBatchSize: "batchSize",
  IncorrectNativeValue: "batchAmountMismatch",
};

// Revert data starts with a 4-byte selector, so anything shorter is not a custom error.
const REVERT_DATA = /^0x([0-9a-fA-F]{2}){4,}$/;

// Wallets and RPC clients nest the revert data differently: ethers puts it on
// `error.data` and `error.info.error.data`, MetaMask wraps it as
// `{ data: { originalError: { data } } }`, and viem puts it under `cause`.
const NESTED_KEYS = ["data", "error", "info", "cause", "originalError"];

// Last resort when no field carries the data: the text of the message does.
const MESSAGE_PATTERNS = [
  /data="(0x(?:[0-9a-fA-F]{2}){4,})"/, // ethers: ...(action="estimateGas", data="0x...", ...)
  /custom error (0x(?:[0-9a-fA-F]{2}){4,})/, // node and viem: execution reverted: custom error 0x...
];

function searchRevertData(node, depth = 0) {
  if (!node || typeof node !== "object" || depth > 4) return null;
  if (typeof node.data === "string" && REVERT_DATA.test(node.data)) return node.data;
  for (const key of NESTED_KEYS) {
    const found = searchRevertData(node[key], depth + 1);
    if (found) return found;
  }
  return null;
}

/**
 * Finds the revert data of a failed call, wherever the wallet or RPC client put it.
 *
 * @param {unknown} error
 * @returns {string|null} 0x-prefixed hex, or null when the error carries none
 */
export function findRevertData(error) {
  const found = searchRevertData(error);
  if (found) return found;

  const message = typeof error?.message === "string" ? error.message : "";
  for (const pattern of MESSAGE_PATTERNS) {
    const match = message.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Decodes the revert of a failed call against the Chainvoice ABI.
 *
 * @param {unknown} error
 * @returns {{ name: string, args: Array }|null} null when there is no revert
 *   data or its selector is not one the contract defines (for example an error
 *   raised inside an ERC-20 token)
 */
export function decodeContractError(error) {
  const data = findRevertData(error);
  if (!data) return null;
  try {
    const parsed = chainvoiceInterface.parseError(data);
    return parsed ? { name: parsed.name, args: Array.from(parsed.args) } : null;
  } catch {
    return null;
  }
}

const WALLET_REJECTION_MESSAGE =
  /user (rejected|denied|cancel(?:l)?ed)|request (?:was )?cancel(?:l)?ed|rejected the request/i;

/**
 * Chooses the message for a failed payment.
 *
 * @param {unknown} error - anything thrown while paying
 * @returns {{ key: string, params?: Object }} a key under
 *   `receivedInvoices.errors` and the values for its `{{placeholders}}`
 */
export function getPaymentErrorMessage(error) {
  const code = error?.code;
  const message = typeof error?.message === "string" ? error.message : "";

  // Declining in the wallet is a choice, not a failure.
  if (code === "ACTION_REJECTED" || code === 4001) {
    return { key: "walletCancelled" };
  }
  if (WALLET_REJECTION_MESSAGE.test(message)) {
    return { key: "walletRejected" };
  }

  // A decoded revert is authoritative, so it is checked before the loose
  // keyword matching below can misread the surrounding message.
  const decoded = decodeContractError(error);
  if (decoded) {
    if (decoded.name in PAYMENT_ERROR_KEYS) {
      return { key: PAYMENT_ERROR_KEYS[decoded.name] };
    }
    if (decoded.name === "Error" && typeof decoded.args[0] === "string") {
      return { key: "failedWithReason", params: { reason: decoded.args[0] } };
    }
    if (decoded.name !== "Panic") {
      // A Chainvoice error that payments are not expected to raise.
      return { key: "contractRejected", params: { name: decoded.name } };
    }
  }

  if (typeof error?.reason === "string" && error.reason && error.reason !== "missing revert data") {
    return { key: "failedWithReason", params: { reason: error.reason } };
  }

  // The call reverted but the data names nothing we know: no reason, a selector
  // from another contract, or a Panic. This comes before the keyword matching
  // because ethers writes action="estimateGas" into every call-exception message,
  // which the "gas" check below would otherwise take for a gas problem.
  if (code === "CALL_EXCEPTION") {
    return { key: "reverted" };
  }

  if (code === "INSUFFICIENT_FUNDS" || /insufficient (balance|funds)/i.test(message)) {
    return { key: "insufficientFunds" };
  }
  if (code === "NETWORK_ERROR" || /network/i.test(message)) {
    return { key: "network" };
  }
  if (/gas/i.test(message)) {
    return { key: "gas" };
  }

  return { key: "generic" };
}
