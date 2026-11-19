import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import {
  applyTransactionError,
  applyTransactionReceipt,
  createTransactionRecord,
  getUnresolvedPaymentInvoiceIds,
  isUnresolvedStatus,
  reconcileTransactions,
  TRANSACTION_STATUS,
} from "../services/transactionRecovery/transactionRecovery.js";
import {
  getTransactionsForWallet,
  saveTransaction,
} from "../services/transactionRecovery/transactionStore.js";
import { getRecoveryProvider } from "../services/transactionRecovery/recoveryProvider.js";

const REFRESH_INTERVAL_MS = 20_000;

function upsertTransaction(records, record) {
  const next = records.filter((item) => item.key !== record.key);
  next.push(record);
  return next.sort((a, b) => b.submittedAt - a.submittedAt);
}

export function useTransactionRecovery() {
  const { address, chainId } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadedScope, setLoadedScope] = useState(null);
  const [settledVersion, setSettledVersion] = useState(0);
  const requestRef = useRef(0);
  const scopeKey =
    address && chainId ? `${Number(chainId)}:${address.toLowerCase()}` : null;

  const refresh = useCallback(async () => {
    if (!address || !chainId) {
      setTransactions([]);
      setLoadedScope(null);
      return [];
    }

    const requestId = ++requestRef.current;
    setIsRefreshing(true);

    try {
      const stored = await getTransactionsForWallet(chainId, address);
      if (requestId !== requestRef.current) return stored;

      // Show stored records first so duplicate-payment protection survives slow RPC.
      setTransactions(stored);
      setLoadedScope(scopeKey);

      const reconciled = await reconcileTransactions(stored, {
        getProvider: getRecoveryProvider,
        save: saveTransaction,
      });

      if (requestId !== requestRef.current) return reconciled;

      const storedByKey = new Map(stored.map((record) => [record.key, record]));
      const newlyConfirmed = reconciled.some((record) => {
        const previous = storedByKey.get(record.key);
        return (
          previous &&
          isUnresolvedStatus(previous.status) &&
          record.status === TRANSACTION_STATUS.CONFIRMED
        );
      });

      setTransactions(reconciled);
      if (newlyConfirmed) setSettledVersion((version) => version + 1);
      return reconciled;
    } catch (error) {
      console.warn("[transactionRecovery] Refresh failed:", error);
      return [];
    } finally {
      if (requestId === requestRef.current) setIsRefreshing(false);
    }
  }, [address, chainId, scopeKey]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      requestRef.current += 1;
    };
  }, [refresh]);

  const trackTransaction = useCallback(
    async ({
      tx,
      invoiceIds,
      operationType,
      chainId: transactionChainId,
      wallet,
    }) => {
      try {
        const record = createTransactionRecord({
          hash: typeof tx === "string" ? tx : tx?.hash,
          chainId: transactionChainId ?? chainId,
          wallet: wallet ?? address,
          invoiceIds,
          operationType,
          nonce: typeof tx === "object" ? tx?.nonce : null,
        });

        try {
          await saveTransaction(record);
        } catch (error) {
          console.warn(
            "[transactionRecovery] Transaction is not persisted:",
            error
          );
        }

        setTransactions((records) => upsertTransaction(records, record));
        return record;
      } catch (error) {
        console.warn("[transactionRecovery] Could not track transaction:", error);
        return null;
      }
    },
    [address, chainId]
  );

  const settleTransaction = useCallback(async (record, receipt) => {
    if (!record) return null;
    const updated = applyTransactionReceipt(record, receipt);
    try {
      await saveTransaction(updated);
    } catch (error) {
      console.warn("[transactionRecovery] Could not persist settlement:", error);
    }
    setTransactions((records) => upsertTransaction(records, updated));
    return updated;
  }, []);

  const failTransaction = useCallback(async (record, error) => {
    if (!record) return null;
    const updated = applyTransactionError(record, error);
    try {
      await saveTransaction(updated);
    } catch (storeError) {
      console.warn(
        "[transactionRecovery] Could not persist transaction error:",
        storeError
      );
    }
    setTransactions((records) => upsertTransaction(records, updated));
    return updated;
  }, []);

  const unresolvedTransactions = useMemo(
    () => transactions.filter((record) => isUnresolvedStatus(record.status)),
    [transactions]
  );

  const unresolvedPaymentInvoiceIds = useMemo(
    () => getUnresolvedPaymentInvoiceIds(transactions, chainId),
    [transactions, chainId]
  );

  return {
    transactions,
    unresolvedTransactions,
    unresolvedPaymentInvoiceIds,
    isRefreshing,
    isReady: scopeKey !== null && loadedScope === scopeKey,
    settledVersion,
    refresh,
    trackTransaction,
    settleTransaction,
    failTransaction,
  };
}
