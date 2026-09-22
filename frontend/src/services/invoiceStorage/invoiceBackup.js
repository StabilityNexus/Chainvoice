import {
  BACKUP_VERSION,
  exportDB,
  importDB,
  downloadJSON,
  readFileAsJSON,
} from "@aossie-org/idb-backup";
import {
  DB_NAME,
  STORE_NAME,
  getAllInvoices,
} from "./invoiceDB.js";

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isSerializedInteger(value) {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value >= 0;
  }

  if (typeof value === "string") {
    return /^(0|[1-9]\d*)$/.test(value);
  }

  return (
    isObject(value) &&
    value.__type === "bigint" &&
    typeof value.value === "string" &&
    /^(0|[1-9]\d*)$/.test(value.value)
  );
}

function validateInvoiceRecord(record, index) {
  if (!isObject(record)) {
    throw new Error(`Invoice record ${index + 1} is not a valid object.`);
  }

  if (!isSerializedInteger(record.invoiceId)) {
    throw new Error(
      `Invoice record ${index + 1} has an invalid invoiceId.`
    );
  }

  if (!isSerializedInteger(record.chainId)) {
    throw new Error(
      `Invoice record ${index + 1} has an invalid chainId.`
    );
  }

  if (typeof record.from !== "string" || !ADDRESS_PATTERN.test(record.from)) {
    throw new Error(
      `Invoice record ${index + 1} has an invalid sender address.`
    );
  }

  if (typeof record.to !== "string" || !ADDRESS_PATTERN.test(record.to)) {
    throw new Error(
      `Invoice record ${index + 1} has an invalid receiver address.`
    );
  }

  if (!isObject(record.data)) {
  throw new Error(
    `Invoice record ${index + 1} is missing its invoice payload.`
  );
}

const payload = record.data;

if (
  typeof payload.amountDue !== "string" ||
  payload.amountDue.trim() === ""
) {
  throw new Error(
    `Invoice record ${index + 1} has an invalid invoice payload amount.`
  );
}

if (
  !isObject(payload.paymentToken) ||
  typeof payload.paymentToken.address !== "string"
) {
  throw new Error(
    `Invoice record ${index + 1} has an invalid payment token.`
  );
}

if (!isObject(payload.user) || typeof payload.user.address !== "string") {
  throw new Error(
    `Invoice record ${index + 1} has an invalid sender information.`
  );
}

if (
  !isObject(payload.client) ||
  typeof payload.client.address !== "string"
) {
  throw new Error(
    `Invoice record ${index + 1} has an invalid client information.`
  );
}

if (!Array.isArray(payload.items)) {
  throw new Error(
    `Invoice record ${index + 1} has an invalid invoice items list.`
  );
}

  if (
    record.compositeKey !== undefined &&
    typeof record.compositeKey !== "string"
  ) {
    throw new Error(
      `Invoice record ${index + 1} has an invalid composite key.`
    );
  }

  if (
    record.isPaid !== undefined &&
    typeof record.isPaid !== "boolean"
  ) {
    throw new Error(
      `Invoice record ${index + 1} has an invalid payment status.`
    );
  }

  if (
    record.isCancelled !== undefined &&
    typeof record.isCancelled !== "boolean"
  ) {
    throw new Error(
      `Invoice record ${index + 1} has an invalid cancellation status.`
    );
  }
}

function validateBackup(backupData) {
  if (!isObject(backupData)) {
    throw new Error(
      "Invalid backup file. The selected file is not a Chainvoice backup."
    );
  }

  if (backupData.backupVersion !== BACKUP_VERSION) {
    throw new Error(
      `Unsupported backup version. Expected version ${BACKUP_VERSION}.`
    );
  }

  if (backupData.databaseName !== DB_NAME) {
    throw new Error(
      "Invalid backup file. This backup does not belong to Chainvoice."
    );
  }

  if (
    !Number.isInteger(backupData.databaseVersion) ||
    backupData.databaseVersion < 1
  ) {
    throw new Error("Invalid backup database version.");
  }

  if (
    typeof backupData.exportedAt !== "string" ||
    Number.isNaN(Date.parse(backupData.exportedAt))
  ) {
    throw new Error("Invalid backup export timestamp.");
  }

  if (!isObject(backupData.schema) || !isObject(backupData.stores)) {
    throw new Error("Invalid backup structure.");
  }

  const invoiceSchema = backupData.schema[STORE_NAME];
  const invoiceEntries = backupData.stores[STORE_NAME];

  if (!isObject(invoiceSchema) || !Array.isArray(invoiceEntries)) {
    throw new Error(
      "Invalid Chainvoice backup. The invoices store is missing."
    );
  }

  if (
    invoiceSchema.keyPath !== "compositeKey" ||
    invoiceSchema.autoIncrement !== false
  ) {
    throw new Error(
      "Invalid Chainvoice backup. The invoice store schema is incompatible."
    );
  }

  invoiceEntries.forEach((entry, index) => {
    if (!isObject(entry) || !("value" in entry)) {
      throw new Error(`Backup entry ${index + 1} is malformed.`);
    }

    validateInvoiceRecord(entry.value, index);
  });

  return backupData;
}

/**
 * Export all locally cached invoices as a downloadable JSON backup.
 */
export async function exportInvoiceBackup() {
  // Force Chainvoice to initialize its versioned IndexedDB and indexes before
  // idb-backup opens the database. Without this, exporting on a fresh browser
  // can create/open an empty version-1 database.
  await getAllInvoices();

  const backup = await exportDB({
    dbName: DB_NAME,
    storeNames: [STORE_NAME],
  });

  validateBackup(backup);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  downloadJSON(backup, `chainvoice-backup-${timestamp}.json`);

  return backup;
}

/**
 * Validate and merge invoice data from a Chainvoice backup.
 *
 * @param {File} file
 */
export async function importInvoiceBackup(file) {
  if (!(file instanceof File)) {
    throw new Error("Please select a valid JSON backup file.");
  }

  if (
    file.type &&
    file.type !== "application/json" &&
    !file.name.toLowerCase().endsWith(".json")
  ) {
    throw new Error("Please select a JSON backup file.");
  }

  const backupData = await readFileAsJSON(file);
  validateBackup(backupData);

  // Ensure Chainvoice's current DB schema and indexes exist before merging.
  await getAllInvoices();

  await importDB({
    dbName: DB_NAME,
    backupData,
    strategy: "merge",
  });

  // Allows any mounted invoice views to refresh immediately.
  window.dispatchEvent(new Event("chainvoice:invoice-storage-updated"));

  return backupData;
}

/**
 * Get the count of locally stored invoices.
 */
export async function getLocalInvoiceCount() {
  try {
    const all = await getAllInvoices();
    return all.length;
  } catch {
    return 0;
  }
}