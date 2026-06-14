/**
 * Schema definition for a single IndexedDB index.
 */
interface IndexSchema {
    /** The name of the index. */
    name: string;
    /** The key path of the index. Can be a string or an array of strings for compound indexes. */
    keyPath: string | string[];
    /** Whether the index enforces unique values. */
    unique: boolean;
    /** Whether the index uses multi-entry mode for array key paths. */
    multiEntry: boolean;
}
/**
 * Schema definition for a single IndexedDB object store.
 */
interface StoreSchema {
    /** The key path of the object store, or `null` if using out-of-line keys. */
    keyPath: string | string[] | null;
    /** Whether the object store uses auto-incrementing keys. */
    autoIncrement: boolean;
    /** The indexes defined on this object store. */
    indexes: IndexSchema[];
}
/**
 * A type-tagged value used to preserve types that JSON.stringify cannot handle natively.
 *
 * Supported `__type` values:
 * - `"u8"` — Uint8Array (value is a base64-encoded string)
 * - `"bigint"` — bigint (value is the string representation)
 * - `"date"` — Date (value is an ISO 8601 string)
 */
interface TaggedValue {
    __type: string;
    value: string;
}
/**
 * The top-level backup JSON envelope produced by `exportDB()`.
 */
interface ExportFormat {
    /** The version of the backup format (currently 1). */
    backupVersion: number;
    /** The name of the exported IndexedDB database. */
    databaseName: string;
    /** The version number of the exported database. */
    databaseVersion: number;
    /** ISO 8601 timestamp of when the export was created. */
    exportedAt: string;
    /** Schema definitions for each object store, keyed by store name. */
    schema: Record<string, StoreSchema>;
    /** Serialized records for each object store, keyed by store name. */
    stores: Record<string, Array<{
        key: unknown;
        value: unknown;
    }>>;
}
/**
 * Options for the `exportDB()` function.
 */
interface ExportOptions {
    /** The name of the IndexedDB database to export. */
    dbName: string;
    /**
     * Optional list of object store names to export.
     * If omitted, all stores in the database are exported.
     */
    storeNames?: string[];
}
/**
 * Options for the `importDB()` function.
 */
interface ImportOptions {
    /** The name of the IndexedDB database to import into. */
    dbName: string;
    /** The parsed backup data to import. */
    backupData: ExportFormat;
    /**
     * The import strategy to use:
     * - `"overwrite"` — Delete the existing database and recreate it from the backup.
     * - `"merge"` — Keep existing data and add/update records from the backup.
     */
    strategy: 'overwrite' | 'merge';
}

/**
 * Export an IndexedDB database to the generic JSON backup format.
 *
 * Opens the specified database, extracts the schema for each object store,
 * reads all records (with type-tagged serialization), and returns the
 * complete ExportFormat envelope.
 *
 * @param options - Export configuration.
 * @param options.dbName - The name of the IndexedDB database to export.
 * @param options.storeNames - Optional list of store names to export. If omitted, all stores are exported.
 * @returns A promise that resolves to the ExportFormat JSON object.
 *
 * @example
 * ```typescript
 * const backup = await exportDB({ dbName: 'my-app-db' });
 * console.log(JSON.stringify(backup, null, 2));
 * ```
 */
declare function exportDB(options: ExportOptions): Promise<ExportFormat>;

/**
 * Import data from a JSON backup into an IndexedDB database.
 *
 * Supports two strategies:
 * - `"overwrite"` — Deletes the existing database, recreates it from the backup
 *   schema, and inserts all backup records. This is a clean restore.
 * - `"merge"` — Opens the existing database, creates any missing stores from the
 *   backup schema, and upserts records (add new, update existing by key).
 *
 * @param options - Import configuration.
 * @param options.dbName - The name of the target IndexedDB database.
 * @param options.backupData - The parsed ExportFormat JSON to import.
 * @param options.strategy - Either `"overwrite"` or `"merge"`.
 * @returns A promise that resolves when the import is complete.
 *
 * @example
 * ```typescript
 * // Overwrite: clean restore
 * await importDB({
 *   dbName: 'my-app-db',
 *   backupData: backup,
 *   strategy: 'overwrite',
 * });
 *
 * // Merge: additive sync
 * await importDB({
 *   dbName: 'my-app-db',
 *   backupData: backup,
 *   strategy: 'merge',
 * });
 * ```
 */
declare function importDB(options: ImportOptions): Promise<void>;

/**
 * The current backup format version.
 * Increment this when the serialization format changes.
 */
declare const BACKUP_VERSION = 1;
/**
 * Recursively serialize a value, converting non-JSON-safe types to tagged representations.
 *
 * Currently handles:
 * - `Uint8Array` → `{ __type: "u8", value: "<base64>" }`
 *
 * Hooks for future tagged types (bigint, Date) can be added here by Rohan's PR.
 *
 * JSON-safe primitives (string, number, boolean, null) pass through unchanged.
 * Plain objects and arrays are recursively processed.
 *
 * @param value - The value to serialize.
 * @returns The serialized value, safe for `JSON.stringify`.
 */
declare function serialize(value: unknown): unknown;
/**
 * Recursively deserialize a value, converting tagged representations back to native types.
 *
 * Currently handles:
 * - `{ __type: "u8", value: "<base64>" }` → `Uint8Array`
 *
 * Hooks for future tagged types (bigint, Date) can be added here by Rohan's PR.
 *
 * @param value - The value to deserialize.
 * @returns The deserialized value with native types restored.
 */
declare function deserialize(value: unknown): unknown;

export { BACKUP_VERSION, type ExportFormat, type ExportOptions, type ImportOptions, type IndexSchema, type StoreSchema, type TaggedValue, deserialize, exportDB, importDB, serialize };
