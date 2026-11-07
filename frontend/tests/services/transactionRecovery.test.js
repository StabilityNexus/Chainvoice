import { jest } from "@jest/globals";
import {
  applyTransactionError,
  applyTransactionReceipt,
  createTransactionRecord,
  getUnresolvedPaymentInvoiceIds,
  isTransactionRecord,
  makeTransactionKey,
  reconcileTransaction,
  reconcileTransactions,
  TRANSACTION_OPERATION,
  TRANSACTION_STATUS,
} from "../../src/services/transactionRecovery/transactionRecovery.js";
import { getTransactionExplorerUrl } from "../../src/utils/chainConfig.js";

const HASH_A = `0x${"a".repeat(64)}`;
const HASH_B = `0x${"b".repeat(64)}`;
const HASH_C = `0x${"c".repeat(64)}`;
const WALLET = `0x${"1".repeat(40)}`;

function makeRecord(overrides = {}) {
  return createTransactionRecord({
    hash: HASH_A,
    chainId: 11155111,
    wallet: WALLET,
    invoiceIds: ["42"],
    operationType: TRANSACTION_OPERATION.PAYMENT,
    submittedAt: 1_700_000_000_000,
    ...overrides,
  });
}

function makeReceipt(overrides = {}) {
  return {
    status: 1,
    blockNumber: 1234,
    blockHash: `0x${"d".repeat(64)}`,
    transactionHash: HASH_A,
    from: WALLET,
    to: `0x${"2".repeat(40)}`,
    gasUsed: 21000n,
    cumulativeGasUsed: 42000n,
    contractAddress: null,
    ...overrides,
  };
}

describe("transaction recovery records", () => {
  test("persists the wallet, chain, operation, invoices, and hash together", () => {
    const record = makeRecord({ invoiceIds: [42n, "42", 43] });

    expect(record).toMatchObject({
      key: `${11155111}:${WALLET}:${HASH_A}`,
      hash: HASH_A,
      chainId: 11155111,
      wallet: WALLET,
      walletChainKey: `11155111:${WALLET}`,
      invoiceIds: ["42", "43"],
      operationType: TRANSACTION_OPERATION.PAYMENT,
      status: TRANSACTION_STATUS.PENDING,
    });
    expect(isTransactionRecord(record)).toBe(true);
  });

  test("does not invent a record when no transaction hash exists", () => {
    expect(() => makeRecord({ hash: undefined })).toThrow(/valid hash/i);
    expect(() => makeRecord({ hash: "0x1234" })).toThrow(/valid hash/i);
  });

  test("requires a valid wallet, chain, operation, and invoice reference", () => {
    expect(() => makeRecord({ wallet: "not-an-address" })).toThrow(/wallet/i);
    expect(() => makeRecord({ chainId: 0 })).toThrow(/chain id/i);
    expect(() => makeRecord({ invoiceIds: [] })).toThrow(/at least one invoice/i);
    expect(() => makeRecord({ operationType: "transfer" })).toThrow(/operation/i);
  });

  test("rejects corrupted records whose key does not match their identity", () => {
    const record = { ...makeRecord(), key: "wrong-key" };
    expect(isTransactionRecord(record)).toBe(false);
    expect(isTransactionRecord(null)).toBe(false);
    expect(isTransactionRecord({ ...makeRecord(), status: "mystery" })).toBe(false);
  });

  test("scopes duplicate-payment detection to payment records on the same chain", () => {
    const pendingPayment = makeRecord({ invoiceIds: ["42"] });
    const confirmedPayment = makeRecord({
      hash: HASH_B,
      invoiceIds: ["43"],
      status: TRANSACTION_STATUS.PENDING,
    });
    const approval = makeRecord({
      hash: HASH_C,
      invoiceIds: ["44"],
      operationType: TRANSACTION_OPERATION.APPROVAL,
    });
    const otherChain = makeRecord({
      hash: HASH_B,
      chainId: 1,
      invoiceIds: ["45"],
    });

    const ids = getUnresolvedPaymentInvoiceIds(
      [
        pendingPayment,
        applyTransactionReceipt(confirmedPayment, makeReceipt({ transactionHash: HASH_B })),
        approval,
        otherChain,
      ],
      11155111
    );

    expect([...ids]).toEqual(["42"]);

    const settled = applyTransactionReceipt(pendingPayment, makeReceipt());
    expect([...getUnresolvedPaymentInvoiceIds([settled], 11155111)]).toEqual([]);
  });
});

describe("transaction status reconciliation", () => {
  test("a pending transaction found on the original chain stays pending", async () => {
    const record = makeRecord();
    const provider = {
      getTransactionReceipt: jest.fn().mockResolvedValue(null),
      getTransaction: jest.fn().mockResolvedValue({ hash: HASH_A, nonce: 7 }),
    };

    const updated = await reconcileTransaction(record, provider, 1_700_000_100_000);

    expect(updated.status).toBe(TRANSACTION_STATUS.PENDING);
    expect(updated.nonce).toBe(7);
    expect(provider.getTransactionReceipt).toHaveBeenCalledWith(HASH_A);
  });

  test("a receipt with status 1 confirms the transaction and stores block details", async () => {
    const record = makeRecord();
    const provider = {
      getTransactionReceipt: jest.fn().mockResolvedValue(makeReceipt()),
      getTransaction: jest.fn(),
    };

    const updated = await reconcileTransaction(record, provider, 1_700_000_100_000);

    expect(updated.status).toBe(TRANSACTION_STATUS.CONFIRMED);
    expect(updated.blockNumber).toBe(1234);
    expect(updated.receipt).toMatchObject({
      status: 1,
      blockNumber: 1234,
      gasUsed: "21000",
    });
    expect(provider.getTransaction).not.toHaveBeenCalled();
  });

  test("a receipt with status 0 marks the transaction reverted", async () => {
    const record = makeRecord();
    const provider = {
      getTransactionReceipt: jest
        .fn()
        .mockResolvedValue(makeReceipt({ status: 0 })),
      getTransaction: jest.fn(),
    };

    const updated = await reconcileTransaction(record, provider);

    expect(updated.status).toBe(TRANSACTION_STATUS.REVERTED);
  });

  test("neither a receipt nor a transaction is marked unresolved, not dropped", async () => {
    const record = makeRecord();
    const provider = {
      getTransactionReceipt: jest.fn().mockResolvedValue(null),
      getTransaction: jest.fn().mockResolvedValue(null),
    };

    const updated = await reconcileTransaction(record, provider);

    expect(updated.status).toBe(TRANSACTION_STATUS.UNRESOLVED);
    expect(updated.lastError).toBeNull();
  });

  test("an RPC failure keeps the previous status and never fabricates a revert", async () => {
    const record = makeRecord();
    const provider = {
      getTransactionReceipt: jest
        .fn()
        .mockRejectedValue(new Error("temporary RPC outage")),
      getTransaction: jest.fn(),
    };

    const updated = await reconcileTransaction(record, provider);

    expect(updated.status).toBe(TRANSACTION_STATUS.PENDING);
    expect(updated.lastError).toMatch(/temporary RPC outage/);
  });

  test("an already confirmed transaction is not queried again", async () => {
    const record = applyTransactionReceipt(makeRecord(), makeReceipt());
    const provider = {
      getTransactionReceipt: jest.fn(),
      getTransaction: jest.fn(),
    };

    const updated = await reconcileTransaction(record, provider);

    expect(updated).toBe(record);
    expect(provider.getTransactionReceipt).not.toHaveBeenCalled();
  });

  test("wallet wait errors preserve pending on generic failures", () => {
    const updated = applyTransactionError(makeRecord(), new Error("network error"));
    expect(updated.status).toBe(TRANSACTION_STATUS.PENDING);
    expect(updated.lastError).toMatch(/network error/);
  });

  test("a revert receipt attached to the wait error marks reverted", () => {
    const error = new Error("transaction execution reverted");
    error.receipt = makeReceipt({ status: 0 });

    const updated = applyTransactionError(makeRecord(), error);

    expect(updated.status).toBe(TRANSACTION_STATUS.REVERTED);
  });

  test("only authoritative replacement evidence marks replaced or dropped", () => {
    const replaced = applyTransactionError(makeRecord(), {
      code: "TRANSACTION_REPLACED",
      reason: "replaced",
      replacement: { hash: HASH_B },
    });
    expect(replaced.status).toBe(TRANSACTION_STATUS.REPLACED);
    expect(replaced.replacementHash).toBe(HASH_B);

    const dropped = applyTransactionError(makeRecord(), {
      code: "TRANSACTION_REPLACED",
      reason: "cancelled",
      replacement: { hash: HASH_C },
    });
    expect(dropped.status).toBe(TRANSACTION_STATUS.DROPPED);
  });
});

describe("refresh recovery", () => {
  test("reconciles stored pending records and persists the new status", async () => {
    const pending = makeRecord();
    const save = jest.fn().mockResolvedValue(undefined);
    const provider = {
      getTransactionReceipt: jest.fn().mockResolvedValue(makeReceipt()),
      getTransaction: jest.fn(),
    };

    const records = await reconcileTransactions([pending], {
      getProvider: jest.fn().mockReturnValue(provider),
      save,
      now: () => 1_700_000_200_000,
    });

    expect(records[0].status).toBe(TRANSACTION_STATUS.CONFIRMED);
    expect(save).toHaveBeenCalledWith(records[0]);
  });

  test("a missing provider leaves the record pending for a later retry", async () => {
    const pending = makeRecord();

    const records = await reconcileTransactions([pending], {
      getProvider: () => null,
      save: jest.fn(),
    });

    expect(records[0].status).toBe(TRANSACTION_STATUS.PENDING);
    expect(records[0].lastError).toMatch(/No RPC provider/i);
  });

  test("persistence failures do not break recovery", async () => {
    const pending = makeRecord();
    const provider = {
      getTransactionReceipt: jest.fn().mockResolvedValue(makeReceipt()),
      getTransaction: jest.fn(),
    };
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    await expect(
      reconcileTransactions([pending], {
        getProvider: () => provider,
        save: jest.fn().mockRejectedValue(new Error("quota exceeded")),
      })
    ).resolves.toHaveLength(1);

    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("transaction explorer links", () => {
  const chains = [
    {
      id: 999,
      blockExplorers: { default: { url: "https://scan.example/" } },
    },
  ];

  test("builds the URL from configured chain metadata", () => {
    expect(getTransactionExplorerUrl(999, HASH_A, chains)).toBe(
      `https://scan.example/tx/${HASH_A}`
    );
  });

  test("returns null for an unknown chain or missing hash", () => {
    expect(getTransactionExplorerUrl(123, HASH_A, chains)).toBeNull();
    expect(getTransactionExplorerUrl(999, "", chains)).toBeNull();
  });

  test("uses the app's real chain config", () => {
    expect(getTransactionExplorerUrl(1, HASH_A)).toBe(
      `https://etherscan.io/tx/${HASH_A}`
    );
  });

  test("makeTransactionKey scopes the same hash by chain and wallet", () => {
    expect(
      makeTransactionKey({ chainId: 1, wallet: WALLET, hash: HASH_A })
    ).not.toBe(makeTransactionKey({ chainId: 2, wallet: WALLET, hash: HASH_A }));
  });
});
