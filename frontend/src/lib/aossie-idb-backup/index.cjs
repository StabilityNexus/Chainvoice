"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BACKUP_VERSION: () => BACKUP_VERSION,
  deserialize: () => deserialize,
  exportDB: () => exportDB,
  importDB: () => importDB,
  serialize: () => serialize
});
module.exports = __toCommonJS(index_exports);

// src/serialization/index.ts
var BACKUP_VERSION = 1;
function uint8ArrayToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}
function isTaggedValue(value) {
  return isPlainObject(value) && typeof value["__type"] === "string" && typeof value["value"] === "string";
}
function serialize(value) {
  if (value instanceof Uint8Array) {
    return { __type: "u8", value: uint8ArrayToBase64(value) };
  }
  if (Array.isArray(value)) {
    return value.map((item) => serialize(item));
  }
  if (isPlainObject(value)) {
    const result = /* @__PURE__ */ Object.create(null);
    for (const key of Object.keys(value)) {
      result[key] = serialize(value[key]);
    }
    return result;
  }
  return value;
}
function deserialize(value) {
  if (isTaggedValue(value)) {
    switch (value.__type) {
      case "u8":
        return base64ToUint8Array(value.value);
      // TODO: bigint deserialization (Rohan's PR)
      // TODO: Date deserialization (Rohan's PR)
      default:
        return value;
    }
  }
  if (Array.isArray(value)) {
    return value.map((item) => deserialize(item));
  }
  if (isPlainObject(value)) {
    const result = /* @__PURE__ */ Object.create(null);
    for (const key of Object.keys(value)) {
      result[key] = deserialize(value[key]);
    }
    return result;
  }
  return value;
}

// src/core/exporter.ts
function extractStoreSchema(store) {
  const indexes = [];
  const indexNames = Array.from(store.indexNames);
  for (const indexName of indexNames) {
    const index = store.index(indexName);
    indexes.push({
      name: index.name,
      keyPath: index.keyPath,
      unique: index.unique,
      multiEntry: index.multiEntry
    });
  }
  return {
    keyPath: store.keyPath,
    autoIncrement: store.autoIncrement,
    indexes
  };
}
function readAllRecords(store) {
  return new Promise((resolve, reject) => {
    const records = [];
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        records.push({
          key: serialize(cursor.primaryKey),
          value: serialize(cursor.value)
        });
        cursor.continue();
      } else {
        resolve(records);
      }
    };
    request.onerror = () => {
      reject(new Error(`Failed to read records from store "${store.name}": ${String(request.error)}`));
    };
  });
}
function openDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(new Error(`Failed to open database "${dbName}": ${String(request.error)}`));
    };
  });
}
async function exportDB(options) {
  const { dbName, storeNames } = options;
  const db = await openDatabase(dbName);
  try {
    const allStoreNames = Array.from(db.objectStoreNames);
    const targetStores = storeNames ? [...new Set(storeNames.filter((name) => allStoreNames.includes(name)))] : allStoreNames;
    if (targetStores.length === 0) {
      return {
        backupVersion: BACKUP_VERSION,
        databaseName: db.name,
        databaseVersion: db.version,
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        schema: {},
        stores: {}
      };
    }
    const transaction = db.transaction(targetStores, "readonly");
    const schema = {};
    const stores = {};
    const storePromises = targetStores.map(async (storeName) => {
      const store = transaction.objectStore(storeName);
      schema[storeName] = extractStoreSchema(store);
      stores[storeName] = await readAllRecords(store);
    });
    await Promise.all(storePromises);
    return {
      backupVersion: BACKUP_VERSION,
      databaseName: db.name,
      databaseVersion: db.version,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      schema,
      stores
    };
  } finally {
    db.close();
  }
}

// src/core/importer.ts
function deleteDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(new Error(`Failed to delete database "${dbName}": ${String(request.error)}`));
    };
    request.onblocked = () => {
      reject(
        new Error(
          `Database "${dbName}" deletion blocked. Close all other connections to this database and try again.`
        )
      );
    };
  });
}
function createStoresFromSchema(db, schema, strategy) {
  for (const [storeName, storeSchema] of Object.entries(schema)) {
    let store;
    if (db.objectStoreNames.contains(storeName)) {
      if (strategy === "overwrite") {
        db.deleteObjectStore(storeName);
        store = db.createObjectStore(storeName, {
          keyPath: storeSchema.keyPath ?? void 0,
          autoIncrement: storeSchema.autoIncrement
        });
      } else {
        continue;
      }
    } else {
      store = db.createObjectStore(storeName, {
        keyPath: storeSchema.keyPath ?? void 0,
        autoIncrement: storeSchema.autoIncrement
      });
    }
    for (const indexSchema of storeSchema.indexes) {
      store.createIndex(indexSchema.name, indexSchema.keyPath, {
        unique: indexSchema.unique,
        multiEntry: indexSchema.multiEntry
      });
    }
  }
}
async function openDatabaseForImport(dbName, backupData, strategy) {
  if (strategy === "overwrite") {
    await deleteDatabase(dbName);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, backupData.databaseVersion);
      request.onupgradeneeded = () => {
        const db = request.result;
        createStoresFromSchema(db, backupData.schema, strategy);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(new Error(`Failed to create database "${dbName}": ${String(request.error)}`));
      };
      request.onblocked = () => {
        reject(
          new Error(
            `Database "${dbName}" open blocked. Close all other connections and try again.`
          )
        );
      };
    });
  }
  return new Promise((resolve, reject) => {
    const probeRequest = indexedDB.open(dbName);
    probeRequest.onsuccess = () => {
      const existingDb = probeRequest.result;
      const currentVersion = existingDb.version;
      const existingStoreNames = Array.from(existingDb.objectStoreNames);
      existingDb.close();
      const backupStoreNames = Object.keys(backupData.schema);
      const needsNewStores = backupStoreNames.some(
        (name) => !existingStoreNames.includes(name)
      );
      if (!needsNewStores) {
        const openRequest = indexedDB.open(dbName, currentVersion);
        openRequest.onsuccess = () => {
          resolve(openRequest.result);
        };
        openRequest.onerror = () => {
          reject(
            new Error(`Failed to open database "${dbName}": ${String(openRequest.error)}`)
          );
        };
        openRequest.onblocked = () => {
          reject(
            new Error(
              `Database "${dbName}" open blocked. Close all other connections and try again.`
            )
          );
        };
        return;
      }
      const upgradeRequest = indexedDB.open(dbName, currentVersion + 1);
      upgradeRequest.onupgradeneeded = () => {
        const db = upgradeRequest.result;
        createStoresFromSchema(db, backupData.schema, strategy);
      };
      upgradeRequest.onsuccess = () => {
        resolve(upgradeRequest.result);
      };
      upgradeRequest.onerror = () => {
        reject(
          new Error(`Failed to upgrade database "${dbName}": ${String(upgradeRequest.error)}`)
        );
      };
      upgradeRequest.onblocked = () => {
        reject(
          new Error(
            `Database "${dbName}" upgrade blocked. Close all other connections and try again.`
          )
        );
      };
    };
    probeRequest.onerror = () => {
      reject(new Error(`Failed to probe database "${dbName}": ${String(probeRequest.error)}`));
    };
  });
}
function insertRecords(store, records, strategy) {
  return new Promise((resolve, reject) => {
    let completed = 0;
    const total = records.length;
    if (total === 0) {
      resolve();
      return;
    }
    for (const serializedRecord of records) {
      const value = deserialize(serializedRecord.value);
      const key = deserialize(serializedRecord.key);
      const hasInlineKey = store.keyPath !== null;
      let request;
      if (strategy === "merge") {
        request = hasInlineKey ? store.put(value) : store.put(value, key);
      } else {
        request = hasInlineKey ? store.add(value) : store.add(value, key);
      }
      request.onsuccess = () => {
        completed++;
        if (completed === total) {
          resolve();
        }
      };
      request.onerror = () => {
        reject(
          new Error(
            `Failed to insert record into store "${store.name}": ${String(request.error)}`
          )
        );
      };
    }
  });
}
async function importDB(options) {
  const { dbName, backupData, strategy } = options;
  const db = await openDatabaseForImport(dbName, backupData, strategy);
  try {
    const backupStoreNames = Object.keys(backupData.stores);
    const dbStoreNames = Array.from(db.objectStoreNames);
    const targetStores = backupStoreNames.filter((name) => dbStoreNames.includes(name));
    if (targetStores.length === 0) {
      return;
    }
    const transaction = db.transaction(targetStores, "readwrite");
    const insertPromises = targetStores.map((storeName) => {
      const store = transaction.objectStore(storeName);
      const records = backupData.stores[storeName] ?? [];
      return insertRecords(store, records, strategy);
    });
    await Promise.all(insertPromises);
    await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(new Error(`Import transaction failed: ${String(transaction.error)}`));
      };
      transaction.onabort = () => {
        reject(new Error(`Import transaction aborted: ${String(transaction.error)}`));
      };
    });
  } finally {
    db.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BACKUP_VERSION,
  deserialize,
  exportDB,
  importDB,
  serialize
});
//# sourceMappingURL=index.cjs.map