import {
  getDB,
  TRANSACTION_STORE_NAME,
} from "../invoiceStorage/invoiceDB.js";
import { isTransactionRecord } from "./transactionRecovery.js";

/**
 * Persist a recovery record immediately after a wallet returns a transaction.
 */
export async function saveTransaction(record) {
  if (!isTransactionRecord(record)) {
    throw new Error("Refusing to store an invalid transaction record");
  }

  const db = await getDB();
  await db.put(TRANSACTION_STORE_NAME, record);
  return record;
}

export async function getTransactionsForWallet(chainId, wallet) {
  if (!chainId || !wallet) return [];

  try {
    const db = await getDB();
    const walletChainKey = `${Number(chainId)}:${wallet.toLowerCase()}`;
    const records = await db.getAllFromIndex(
      TRANSACTION_STORE_NAME,
      "by-wallet-chain",
      walletChainKey
    );
    return records
      .filter(isTransactionRecord)
      .sort((a, b) => b.submittedAt - a.submittedAt);
  } catch (error) {
    console.warn("[transactionStore] Could not read transactions:", error);
    return [];
  }
}

export async function deleteTransaction(key) {
  try {
    const db = await getDB();
    await db.delete(TRANSACTION_STORE_NAME, key);
  } catch (error) {
    console.warn("[transactionStore] Could not delete transaction:", error);
  }
}

export { TRANSACTION_STORE_NAME };
