import { openDB } from 'idb';

const DB_NAME = 'chainvoice-invoices';
const DB_VERSION = 2; // Bumped to force re-creation of stores
const STORE_NAME = 'invoices';

/**
 * Open (or create) the IndexedDB database for local invoice storage.
 * If the database exists but is missing the required store (e.g. from a
 * previous version or corrupted state), we delete and recreate it.
 * @returns {Promise<import('idb').IDBPDatabase>}
 */
let dbPromise = null;

async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        let store;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          store = db.createObjectStore(STORE_NAME, { keyPath: 'compositeKey' });
        } else {
          store = db.transaction.objectStore(STORE_NAME);
        }

        if (!store.indexNames.contains('by-sender')) store.createIndex('by-sender', 'from');
        if (!store.indexNames.contains('by-receiver')) store.createIndex('by-receiver', 'to');
        if (!store.indexNames.contains('by-chain')) store.createIndex('by-chain', 'chainId');
        if (!store.indexNames.contains('by-invoiceId')) store.createIndex('by-invoiceId', 'invoiceId');
      },
    }).catch((err) => {
      dbPromise = null; // Reset so next call retries
      console.error('[invoiceDB] DB open failed:', err);
      throw err;
    });
  }
  return dbPromise;
}

/**
 * Build a composite key from chainId and invoiceId.
 * @param {number|string} chainId
 * @param {number|string} invoiceId
 * @returns {string}
 */
function makeKey(chainId, invoiceId) {
  return `${chainId}-${invoiceId}`;
}

/**
 * Store an invoice in IndexedDB.
 * The invoice object must contain: invoiceId, chainId, from, to.
 *
 * @param {Object} invoice - invoice record with metadata + data
 */
export async function storeInvoice(invoice) {
  if (invoice.chainId === undefined || invoice.invoiceId === undefined) {
    throw new Error('storeInvoice: chainId and invoiceId are required');
  }
  if (!invoice.from || !invoice.to) {
    throw new Error('storeInvoice: from and to addresses are required');
  }

  const db = await getDB();
  const record = {
    ...invoice,
    compositeKey: makeKey(invoice.chainId, invoice.invoiceId),
    from: invoice.from.toLowerCase(),
    to: invoice.to.toLowerCase(),
    storedAt: Date.now(),
  };
  await db.put(STORE_NAME, record);
}

/**
 * Get an invoice by chain and ID.
 * @param {number|string} chainId
 * @param {number|string} invoiceId
 * @returns {Promise<Object|undefined>}
 */
export async function getInvoiceById(chainId, invoiceId) {
  try {
    const db = await getDB();
    return db.get(STORE_NAME, makeKey(chainId, invoiceId));
  } catch (err) {
    console.warn('[invoiceDB] getInvoiceById failed:', err);
    return undefined;
  }
}

/**
 * Get all invoices sent by an address (across all chains).
 * @param {string} senderAddress
 * @returns {Promise<Array>}
 */
export async function getSentInvoices(senderAddress) {
  try {
    const db = await getDB();
    return db.getAllFromIndex(
      STORE_NAME,
      'by-sender',
      senderAddress.toLowerCase()
    );
  } catch (err) {
    console.warn('[invoiceDB] getSentInvoices failed:', err);
    return [];
  }
}

/**
 * Get all invoices received by an address (across all chains).
 * @param {string} receiverAddress
 * @returns {Promise<Array>}
 */
export async function getReceivedInvoices(receiverAddress) {
  try {
    const db = await getDB();
    return db.getAllFromIndex(
      STORE_NAME,
      'by-receiver',
      receiverAddress.toLowerCase()
    );
  } catch (err) {
    console.warn('[invoiceDB] getReceivedInvoices failed:', err);
    return [];
  }
}

/**
 * Get all invoices stored locally.
 * @returns {Promise<Array>}
 */
export async function getAllInvoices() {
  try {
    const db = await getDB();
    return db.getAll(STORE_NAME);
  } catch (err) {
    console.warn('[invoiceDB] getAllInvoices failed:', err);
    return [];
  }
}

/**
 * Update invoice status fields (isPaid, isCancelled).
 * @param {number|string} chainId
 * @param {number|string} invoiceId
 * @param {Object} updates - { isPaid?: boolean, isCancelled?: boolean }
 * @returns {Promise<Object|null>}
 */
export async function updateInvoiceStatus(chainId, invoiceId, updates) {
  try {
    const db = await getDB();
    const key = makeKey(chainId, invoiceId);
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const existing = await store.get(key);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: Date.now() };
    await store.put(updated);
    await tx.done;
    return updated;
  } catch (err) {
    console.warn('[invoiceDB] updateInvoiceStatus failed:', err);
    return null;
  }
}

/**
 * Delete an invoice from local storage.
 * @param {number|string} chainId
 * @param {number|string} invoiceId
 */
export async function deleteInvoice(chainId, invoiceId) {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, makeKey(chainId, invoiceId));
  } catch (err) {
    console.warn('[invoiceDB] deleteInvoice failed:', err);
  }
}

export { DB_NAME, STORE_NAME };

