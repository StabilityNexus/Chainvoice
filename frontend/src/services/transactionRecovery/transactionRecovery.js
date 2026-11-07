/**
 * Payment transaction recovery model and reconciliation.
 *
 * A record is written as soon as the wallet returns a transaction response.
 * Recovery only reads the original chain; it never resubmits a transaction.
 */

const HASH_PATTERN = /^0x[0-9a-fA-F]{64}$/;
const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export const TRANSACTION_STATUS = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  REVERTED: "reverted",
  REPLACED: "replaced",
  DROPPED: "dropped",
  UNRESOLVED: "unresolved",
});

export const TRANSACTION_OPERATION = Object.freeze({
  PAYMENT: "payment",
  APPROVAL: "approval",
});

const VALID_STATUSES = new Set(Object.values(TRANSACTION_STATUS));
const VALID_OPERATIONS = new Set(Object.values(TRANSACTION_OPERATION));

function normalizeChainId(chainId) {
  const normalized = Number(chainId);
  return Number.isSafeInteger(normalized) && normalized > 0 ? normalized : null;
}

function normalizeWallet(wallet) {
  return typeof wallet === "string" && ADDRESS_PATTERN.test(wallet)
    ? wallet.toLowerCase()
    : null;
}

function normalizeInvoiceIds(invoiceIds) {
  if (!Array.isArray(invoiceIds)) return [];
  return [
    ...new Set(
      invoiceIds
        .map((id) => (id === undefined || id === null ? "" : String(id)))
        .filter(Boolean)
    ),
  ];
}

function errorMessage(error) {
  if (typeof error?.shortMessage === "string" && error.shortMessage) {
    return error.shortMessage;
  }
  if (typeof error?.message === "string" && error.message) {
    return error.message;
  }
  return "Unable to read transaction status";
}

export function isUnresolvedStatus(status) {
  return (
    status === TRANSACTION_STATUS.PENDING ||
    status === TRANSACTION_STATUS.UNRESOLVED
  );
}

export function isTerminalStatus(status) {
  return (
    status === TRANSACTION_STATUS.CONFIRMED ||
    status === TRANSACTION_STATUS.REVERTED
  );
}

export function makeTransactionKey({ chainId, wallet, hash }) {
  const normalizedChainId = normalizeChainId(chainId);
  const normalizedWallet = normalizeWallet(wallet);
  const normalizedHash = typeof hash === "string" ? hash.toLowerCase() : "";

  if (!normalizedChainId || !normalizedWallet || !HASH_PATTERN.test(normalizedHash)) {
    throw new Error("Invalid transaction identity");
  }

  return `${normalizedChainId}:${normalizedWallet}:${normalizedHash}`;
}

export function createTransactionRecord({
  hash,
  chainId,
  wallet,
  invoiceIds,
  operationType,
  submittedAt = Date.now(),
  nonce = null,
}) {
  const normalizedHash = typeof hash === "string" ? hash.toLowerCase() : "";
  const normalizedChainId = normalizeChainId(chainId);
  const normalizedWallet = normalizeWallet(wallet);
  const normalizedInvoiceIds = normalizeInvoiceIds(invoiceIds);

  if (!HASH_PATTERN.test(normalizedHash)) {
    throw new Error("A submitted transaction must have a valid hash");
  }
  if (!normalizedChainId) {
    throw new Error("A submitted transaction must have a valid chain id");
  }
  if (!normalizedWallet) {
    throw new Error("A submitted transaction must have a valid wallet address");
  }
  if (normalizedInvoiceIds.length === 0) {
    throw new Error("A submitted transaction must reference at least one invoice");
  }
  if (!VALID_OPERATIONS.has(operationType)) {
    throw new Error("Unsupported transaction operation");
  }

  const key = makeTransactionKey({
    chainId: normalizedChainId,
    wallet: normalizedWallet,
    hash: normalizedHash,
  });

  return {
    key,
    hash: normalizedHash,
    chainId: normalizedChainId,
    wallet: normalizedWallet,
    walletChainKey: `${normalizedChainId}:${normalizedWallet}`,
    invoiceIds: normalizedInvoiceIds,
    operationType,
    submittedAt: Number(submittedAt) || Date.now(),
    updatedAt: Date.now(),
    status: TRANSACTION_STATUS.PENDING,
    nonce: nonce === null || nonce === undefined ? null : Number(nonce),
    receipt: null,
    blockNumber: null,
    blockHash: null,
    replacementHash: null,
    settledAt: null,
    lastCheckedAt: null,
    lastError: null,
  };
}

export function isTransactionRecord(record) {
  if (!record || typeof record !== "object") return false;
  if (!HASH_PATTERN.test(String(record.hash || ""))) return false;
  if (!normalizeChainId(record.chainId)) return false;
  if (!normalizeWallet(record.wallet)) return false;
  if (!Array.isArray(record.invoiceIds) || record.invoiceIds.length === 0) {
    return false;
  }
  if (!VALID_OPERATIONS.has(record.operationType)) return false;
  if (!VALID_STATUSES.has(record.status)) return false;
  if (!Number.isFinite(Number(record.submittedAt))) return false;

  try {
    return (
      record.key ===
      makeTransactionKey({
        chainId: record.chainId,
        wallet: record.wallet,
        hash: record.hash,
      })
    );
  } catch {
    return false;
  }
}

function serializeReceipt(record, receipt) {
  const status = Number(receipt.status);
  return {
    status: Number.isFinite(status) ? status : null,
    blockNumber: receipt.blockNumber ?? null,
    blockHash: receipt.blockHash ?? null,
    transactionHash: receipt.transactionHash ?? record.hash,
    from: receipt.from ?? record.wallet,
    to: receipt.to ?? null,
    gasUsed:
      receipt.gasUsed === null || receipt.gasUsed === undefined
        ? null
        : String(receipt.gasUsed),
    cumulativeGasUsed:
      receipt.cumulativeGasUsed === null ||
      receipt.cumulativeGasUsed === undefined
        ? null
        : String(receipt.cumulativeGasUsed),
    contractAddress: receipt.contractAddress ?? null,
  };
}

export function applyTransactionReceipt(record, receipt, now = Date.now()) {
  if (!receipt || typeof receipt !== "object") {
    return {
      ...record,
      updatedAt: now,
      lastCheckedAt: now,
      lastError: "Transaction receipt was unavailable",
    };
  }

  const receiptStatus = Number(receipt.status);
  const status =
    receiptStatus === 1
      ? TRANSACTION_STATUS.CONFIRMED
      : receiptStatus === 0
        ? TRANSACTION_STATUS.REVERTED
        : record.status;
  const settled = isTerminalStatus(status);

  return {
    ...record,
    status,
    receipt: serializeReceipt(record, receipt),
    blockNumber: receipt.blockNumber ?? record.blockNumber ?? null,
    blockHash: receipt.blockHash ?? record.blockHash ?? null,
    settledAt: settled ? now : record.settledAt,
    updatedAt: now,
    lastCheckedAt: now,
    lastError: null,
  };
}

export function applyTransactionError(record, error, now = Date.now()) {
  if (error?.code === "TRANSACTION_REPLACED") {
    const cancelled = error.reason === "cancelled";
    return {
      ...record,
      status: cancelled
        ? TRANSACTION_STATUS.DROPPED
        : TRANSACTION_STATUS.REPLACED,
      replacementHash:
        error.replacement?.hash || error.hash || record.replacementHash || null,
      settledAt: now,
      updatedAt: now,
      lastCheckedAt: now,
      lastError: null,
    };
  }

  // ethers attaches the authoritative receipt to a reverted send.
  if (error?.receipt && typeof error.receipt === "object") {
    return applyTransactionReceipt(record, error.receipt, now);
  }

  return {
    ...record,
    updatedAt: now,
    lastCheckedAt: now,
    lastError: errorMessage(error),
  };
}

/**
 * Re-read a pending/unresolved record from its original chain.
 *
 * - receipt found: confirmed or reverted
 * - transaction found: still pending
 * - both null: unresolved, not "dropped"
 * - RPC failure: keep the previous status
 */
export async function reconcileTransaction(record, provider, now = Date.now()) {
  if (!isUnresolvedStatus(record.status)) return record;

  if (!provider) {
    return {
      ...record,
      updatedAt: now,
      lastCheckedAt: now,
      lastError: `No RPC provider configured for chain ${record.chainId}`,
    };
  }

  try {
    const receipt = await provider.getTransactionReceipt(record.hash);
    if (receipt) return applyTransactionReceipt(record, receipt, now);

    const transaction = await provider.getTransaction(record.hash);
    if (transaction) {
      return {
        ...record,
        status: TRANSACTION_STATUS.PENDING,
        nonce:
          transaction.nonce === undefined || transaction.nonce === null
            ? record.nonce
            : Number(transaction.nonce),
        updatedAt: now,
        lastCheckedAt: now,
        lastError: null,
      };
    }

    return {
      ...record,
      status: TRANSACTION_STATUS.UNRESOLVED,
      updatedAt: now,
      lastCheckedAt: now,
      lastError: null,
    };
  } catch (error) {
    return {
      ...record,
      updatedAt: now,
      lastCheckedAt: now,
      lastError: errorMessage(error),
    };
  }
}

export async function reconcileTransactions(
  records,
  { getProvider, save, now = Date.now } = {}
) {
  const updatedRecords = [];

  for (const record of records) {
    if (!isUnresolvedStatus(record.status)) {
      updatedRecords.push(record);
      continue;
    }

    let provider = null;
    try {
      provider = getProvider ? getProvider(record.chainId) : null;
    } catch {
      provider = null;
    }

    const updated = await reconcileTransaction(record, provider, now());
    if (updated !== record && typeof save === "function") {
      try {
        await save(updated);
      } catch (error) {
        console.warn("[transactionRecovery] Could not persist update:", error);
      }
    }
    updatedRecords.push(updated);
  }

  return updatedRecords;
}

export function getUnresolvedPaymentInvoiceIds(transactions, chainId) {
  const ids = new Set();
  const normalizedChainId = normalizeChainId(chainId);

  for (const transaction of transactions || []) {
    if (!isTransactionRecord(transaction)) continue;
    if (transaction.operationType !== TRANSACTION_OPERATION.PAYMENT) continue;
    if (!isUnresolvedStatus(transaction.status)) continue;
    if (transaction.chainId !== normalizedChainId) continue;
    for (const invoiceId of transaction.invoiceIds) {
      ids.add(String(invoiceId));
    }
  }

  return ids;
}
