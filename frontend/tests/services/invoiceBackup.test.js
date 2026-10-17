import { BACKUP_VERSION } from "@aossie-org/idb-backup";
import {
    DB_NAME,
    STORE_NAME,
} from "../../src/services/invoiceStorage/invoiceDB.js";
import {
    validateBackup,
    validateInvoiceRecord,
} from "../../src/services/invoiceStorage/invoiceBackup.js";

const ADDRESS_A = "0x1111111111111111111111111111111111111111";
const ADDRESS_B = "0x2222222222222222222222222222222222222222";
const ADDRESS_C = "0x3333333333333333333333333333333333333333";

function makeRecord(overrides = {}) {
    return {
        invoiceId: 42,
        chainId: 1,
        compositeKey: "1-42",
        from: ADDRESS_A,
        to: ADDRESS_B,
        data: {
            amountDue: "100.50",
            paymentToken: { address: ADDRESS_C },
            user: { address: ADDRESS_A },
            client: { address: ADDRESS_B },
            items: [],
        },
        ...overrides,
    };
}

function makeBackup(record = makeRecord()) {
    return {
        backupVersion: BACKUP_VERSION,
        databaseName: DB_NAME,
        databaseVersion: 2,
        exportedAt: "2026-10-17T10:00:00.000Z",
        schema: {
            [STORE_NAME]: {
                keyPath: "compositeKey",
                autoIncrement: false,
            },
        },
        stores: {
            [STORE_NAME]: [{ key: record.compositeKey, value: record }],
        },
    };
}

describe("validateInvoiceRecord", () => {
    test("accepts a valid invoice record", () => {
        expect(() => validateInvoiceRecord(makeRecord())).not.toThrow();
    });

    test("accepts normalized serialized integer IDs", () => {
        const record = makeRecord({
            invoiceId: { __type: "bigint", value: "42" },
            chainId: "1",
        });

        expect(() => validateInvoiceRecord(record)).not.toThrow();
    });

    test("rejects noncanonical invoice IDs", () => {
        expect(() =>
            validateInvoiceRecord(makeRecord({ invoiceId: "042" }))
        ).toThrow(/invalid invoiceId/i);
    });

    test("rejects a composite key that does not match the IDs", () => {
        expect(() =>
            validateInvoiceRecord(makeRecord({ compositeKey: "1-99" }))
        ).toThrow(/invalid composite key/i);
    });

    test("rejects a missing invoice payload", () => {
        expect(() =>
            validateInvoiceRecord(makeRecord({ data: undefined }))
        ).toThrow(/missing its invoice payload/i);
    });

    test("rejects an invalid amount", () => {
        const record = makeRecord({
            data: { ...makeRecord().data, amountDue: "not-a-number" },
        });

        expect(() => validateInvoiceRecord(record)).toThrow(/invalid invoice payload amount/i);
    });

    test("rejects an invalid sender address", () => {
        expect(() =>
            validateInvoiceRecord(makeRecord({ from: "not-an-address" }))
        ).toThrow(/invalid sender address/i);
    });

    test("rejects an invalid receiver address", () => {
        expect(() =>
            validateInvoiceRecord(makeRecord({ to: "not-an-address" }))
        ).toThrow(/invalid receiver address/i);
    });

    test("rejects an invalid payment token address", () => {
        const record = makeRecord({
            data: {
                ...makeRecord().data,
                paymentToken: { address: "not-an-address" },
            },
        });

        expect(() => validateInvoiceRecord(record)).toThrow(/invalid payment token/i);
    });

    test("rejects an invalid sender payload address", () => {
        const record = makeRecord({
            data: {
                ...makeRecord().data,
                user: { address: "not-an-address" },
            },
        });

        expect(() => validateInvoiceRecord(record)).toThrow(/invalid sender information/i);
    });

    test("rejects an invalid client payload address", () => {
        const record = makeRecord({
            data: {
                ...makeRecord().data,
                client: { address: "not-an-address" },
            },
        });

        expect(() => validateInvoiceRecord(record)).toThrow(/invalid client information/i);
    });
});

describe("validateBackup", () => {
    test("accepts a valid backup", () => {
        const backup = makeBackup();
        expect(validateBackup(backup)).toBe(backup);
    });

    test("rejects the wrong database name", () => {
        expect(() =>
            validateBackup({ ...makeBackup(), databaseName: "other-database" })
        ).toThrow(/does not belong to Chainvoice/i);
    });

    test("rejects an unsupported backup version", () => {
        expect(() =>
            validateBackup({ ...makeBackup(), backupVersion: -1 })
        ).toThrow(/unsupported backup version/i);
    });

    test("rejects an invalid database version", () => {
        expect(() =>
            validateBackup({ ...makeBackup(), databaseVersion: 0 })
        ).toThrow(/invalid backup database version/i);
    });

    test("rejects backups containing additional stores", () => {
        const backup = makeBackup();
        backup.stores.other = [];

        expect(() => validateBackup(backup)).toThrow(/only the invoices store/i);
    });

    test("rejects an incompatible invoice store schema", () => {
        const backup = makeBackup();
        backup.schema[STORE_NAME].keyPath = "invoiceId";

        expect(() => validateBackup(backup)).toThrow(/schema is incompatible/i);
    });

    test("rejects a backup containing an invalid invoice record", () => {
        const backup = makeBackup(makeRecord({ compositeKey: "1-99" }));

        expect(() => validateBackup(backup)).toThrow(/invalid composite key/i);
    });
});