/**
 * Map a failed batch-create error to a message key under
 * `batchInvoice.errors` in `en.json`. Raw ethers/contract errors are never
 * shown to users; callers log the original error instead.
 *
 * @param {unknown} error - error thrown while creating the batch
 * @returns {string} message key
 */
export function getBatchCreateErrorKey(error) {
  if (error?.code === "ACTION_REJECTED" || error?.code === 4001) {
    return "cancelled";
  }
  if (
    error?.code === "INSUFFICIENT_FUNDS" ||
    /insufficient funds/i.test(error?.message ?? "")
  ) {
    return "insufficientFunds";
  }
  if (error?.code === "NETWORK_ERROR") {
    return "network";
  }
  if (error?.message === "Unsupported network") {
    return "unsupportedNetwork";
  }

  const revertName = error?.revert?.name;
  if (revertName === "InvalidBatchSize") {
    return "batchTooLarge";
  }
  if (revertName === "NotContract" || revertName === "InvalidToken") {
    return "invalidToken";
  }
  if (error?.code === "CALL_EXCEPTION") {
    // A receipt means the transaction was mined after passing simulation, so
    // the likely cause is a too-low gas limit; without one, the contract
    // refused the batch during simulation.
    return error.receipt ? "reverted" : "rejected";
  }

  return "generic";
}
