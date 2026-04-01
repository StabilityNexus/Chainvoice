import { useState, useEffect, useCallback } from 'react';
import { del, get, set } from 'idb-keyval';
import Papa from 'papaparse';

const CATALOG_KEY = 'chainvoice_product_catalog';
const LAST_URL_KEY = 'chainvoice_product_catalog_last_url';
const CATALOG_UPDATED_EVENT = 'chainvoice:product-catalog-updated';

/**
 Module-level memory cache shared by all hook instances.
 Intentional singleton: avoids redundant IndexedDB reads across components.
 Cleared explicitly via clearCatalog() and updated via broadcastCatalogUpdate().
 */
let memoryCache = null;

/**
 Normalizes raw row data to ensure consistent field names.
 Maps common aliases (description → name, unit_price → price) and
 strips empty keys produced by malformed CSV headers.
 */
const normalizeRows = (rows) => {
  const FIELD_ALIAS_MAP = {
    description: 'name',
    unit_price: 'price',
    unite_price: 'price',
    'unit price': 'price',
  };

  const normalizedData = rows
    .map((row) => {
      const normRow = {};
      for (const [key, value] of Object.entries(row || {})) {
        const trimmedKey = (key || '').trim().toLowerCase();
        if (!trimmedKey) continue;
        normRow[trimmedKey] = typeof value === 'string' ? value.trim() : value;
      }

      for (const [alias, canonical] of Object.entries(FIELD_ALIAS_MAP)) {
        if (
          Object.prototype.hasOwnProperty.call(normRow, alias) &&
          (normRow[canonical] === undefined || normRow[canonical] === '')
        ) {
          normRow[canonical] = normRow[alias];
          delete normRow[alias];
        }
      }

      return normRow;
    })
    .filter((row) => Object.keys(row).length > 0);

  if (normalizedData.length === 0) {
    throw new Error('Empty file or no valid data rows');
  }

  const hasRequired = normalizedData.every(
    (row) => row.name !== undefined && row.name !== '' && row.price !== undefined && row.price !== '',
  );

  if (!hasRequired) {
    throw new Error("Missing required fields: 'name' (or 'description') and 'price' (or 'unit_price') in one or more rows");
  }

  const isPlainDecimal = (value) =>
    value === undefined ||
    value === '' ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    (typeof value === 'string' && /^(?:\d+|\d*\.\d+)$/.test(value));

  const hasValidNumericFields = normalizedData.every((row) =>
    ['price', 'qty', 'tax', 'discount'].every((field) => isPlainDecimal(row[field])),
  );

  if (!hasValidNumericFields) {
    throw new Error('Invalid numeric fields: use plain decimal values for price, qty, tax, and discount');
  }

  return normalizedData;
};

/**
 * Parses a CSV string using PapaParse and normalizes the resulting rows.
 */
const parseAndNormalizeCSV = (csvString) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          const firstError = results.errors[0];
          const rowSuffix =
            typeof firstError?.row === 'number' ? ` near row ${firstError.row + 1}` : '';
          return reject(new Error(`Invalid CSV format${rowSuffix}`));
        }

        try {
          resolve(normalizeRows(results.data));
        } catch (e) {
          reject(e);
        }
      },
      error: (error) => reject(error),
    });
  });
};

/**
 * Parses a JSON string and normalizes the resulting rows.
 */
const parseAndNormalizeJSON = (jsonString) => {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) {
    throw new Error('JSON must be an array of objects');
  }
  return normalizeRows(parsed);
};

/**
 * Rewrites known Google Sheets URLs to their CSV export endpoint.
 */
const normalizeImportUrl = (rawUrl) => {
  const input = String(rawUrl || '').trim();

  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();
    const path = url.pathname;

    if (!host.includes('docs.google.com') || !path.includes('/spreadsheets/')) {
      return input;
    }

    if (/\/spreadsheets\/(?:u\/\d+\/)?d\/e\//.test(path)) {
      if (path.endsWith('/pubhtml')) {
        const pubUrl = new URL(url.toString());
        pubUrl.pathname = path.replace('/pubhtml', '/pub');
        pubUrl.searchParams.set('output', 'csv');
        return pubUrl.toString();
      }
      if (path.endsWith('/pub')) {
        const pubUrl = new URL(url.toString());
        pubUrl.searchParams.set('output', 'csv');
        return pubUrl.toString();
      }
      return input;
    }

    const match = path.match(/\/spreadsheets\/(?:u\/\d+\/)?d\/([^/]+)/);
    if (!match?.[1]) {
      return input;
    }

    const docId = match[1];
    const hashGid = url.hash.match(/(?:^#|[?&#])gid=(\d+)/)?.[1];
    const gid = url.searchParams.get('gid') || hashGid || '0';
    return `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv&gid=${gid}`;
  } catch {
    return input;
  }
};

/**
 * Appends a cache-busting query parameter to avoid stale CDN/browser caches.
 */
const withCacheBuster = (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('_cvts', String(Date.now()));
    return url.toString();
  } catch {
    return rawUrl;
  }
};

export const useProductCatalog = () => {
  const [catalogMetadata, setCatalogMetadata] = useState(null);
  const [savedUrl, setSavedUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const broadcastCatalogUpdate = useCallback((metadata) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(CATALOG_UPDATED_EVENT, { detail: metadata }));
  }, []);

  const saveCatalogData = useCallback(async (metadata) => {
    try {
      if (metadata === null) {
        await del(CATALOG_KEY);
      } else {
        await set(CATALOG_KEY, metadata);
      }
      memoryCache = metadata;
      setCatalogMetadata(metadata);
      broadcastCatalogUpdate(metadata);
    } catch (err) {
      console.error('Failed to save catalog to IndexedDB:', err);
      throw err;
    }
  }, [broadcastCatalogUpdate]);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    try {
      if (memoryCache) {
        setCatalogMetadata(memoryCache);
        setLoading(false);
        return;
      }
      const data = await get(CATALOG_KEY);
      if (data) {
        memoryCache = data;
        setCatalogMetadata(data);
      } else {
        memoryCache = null;
        setCatalogMetadata(null);
      }
    } catch (err) {
      console.error('Failed to load catalog from IndexedDB:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSavedUrl = useCallback(async () => {
    try {
      const url = await get(LAST_URL_KEY);
      setSavedUrl(url || null);
    } catch (err) {
      console.error('Failed to load saved URL from IndexedDB:', err);
      setSavedUrl(null);
    }
  }, []);

  useEffect(() => {
    const handleCatalogUpdated = (event) => {
      const nextMetadata = event?.detail ?? null;
      memoryCache = nextMetadata;
      setCatalogMetadata(nextMetadata);
      setLoading(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(CATALOG_UPDATED_EVENT, handleCatalogUpdated);
    }

    loadCatalog();
    loadSavedUrl();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(CATALOG_UPDATED_EVENT, handleCatalogUpdated);
      }
    };
  }, [loadCatalog, loadSavedUrl]);

  const importFromFile = useCallback(async (file) => {
    const fileName = file?.name?.toLowerCase?.() || '';
    const text = await file.text();
    let parsedData;

    if (fileName.endsWith('.json')) {
      parsedData = parseAndNormalizeJSON(text);
    } else {
      parsedData = await parseAndNormalizeCSV(text);
    }

    const isJson = fileName.endsWith('.json');
    const newMetadata = {
      source: isJson ? 'json' : 'csv',
      url: null,
      lastFetched: Date.now(),
      data: parsedData,
    };

    await saveCatalogData(newMetadata);
    return {
      success: true,
      count: parsedData.length,
      format: isJson ? 'JSON' : 'CSV',
    };
  }, [saveCatalogData]);

  const importFromURL = useCallback(async (url, options = { persistUrl: true, forceRefresh: false }) => {
    const normalizedUrl = normalizeImportUrl(url);
    const requestUrl = options?.forceRefresh ? withCacheBuster(normalizedUrl) : normalizedUrl;
    let response;
    try {
      response = await fetch(requestUrl, { cache: 'no-store' });
    } catch (err) {
      throw new Error('Network error: Failed to fetch. Ensure the URL is valid and the server supports CORS.');
    }
    if (!response.ok) throw new Error(`Failed to fetch data from URL (Status: ${response.status})`);

    const text = await response.text();

    let parsedData;
    try {
      parsedData = parseAndNormalizeJSON(text);
    } catch (jsonErr) {
      if (jsonErr.message.includes('JSON must be an array') || jsonErr.message.includes('Missing required fields')) {
        throw jsonErr;
      }
      parsedData = await parseAndNormalizeCSV(text);
    }

    const persistUrl = options?.persistUrl !== false;

    const newMetadata = {
      source: persistUrl ? 'url' : 'url-temp',
      url: normalizedUrl,
      lastFetched: Date.now(),
      data: parsedData,
    };

    if (persistUrl) {
      await set(LAST_URL_KEY, normalizedUrl);
      setSavedUrl(normalizedUrl);
      await saveCatalogData(newMetadata);
    } else {
      memoryCache = newMetadata;
      setCatalogMetadata(newMetadata);
      broadcastCatalogUpdate(newMetadata);
    }

    return { success: true, count: parsedData.length, persisted: persistUrl };
  }, [saveCatalogData, broadcastCatalogUpdate]);

  const refreshURL = useCallback(async () => {
    const persistedUrl = savedUrl || (await get(LAST_URL_KEY)) || null;

    if (persistedUrl) {
      return await importFromURL(persistedUrl, { persistUrl: true, forceRefresh: true });
    }
    throw new Error('No URL source configured to refresh');
  }, [savedUrl, importFromURL]);

  const disableURLPersistence = useCallback(async () => {
    await del(LAST_URL_KEY);
    setSavedUrl(null);

    if (catalogMetadata?.source === 'url') {
      const updatedMetadata = {
        ...catalogMetadata,
        source: 'url-temp',
      };
      await del(CATALOG_KEY);
      memoryCache = updatedMetadata;
      setCatalogMetadata(updatedMetadata);
      broadcastCatalogUpdate(updatedMetadata);
    }

    return { success: true };
  }, [catalogMetadata, broadcastCatalogUpdate]);

  const persistCurrentURLData = useCallback(async () => {
    const currentUrl = catalogMetadata?.url;
    const currentData = catalogMetadata?.data;

    if (!currentUrl || !Array.isArray(currentData) || currentData.length === 0) {
      throw new Error('No fetched URL data available to save');
    }

    const persistedMetadata = {
      source: 'url',
      url: currentUrl,
      lastFetched: Date.now(),
      data: currentData,
    };

    await set(LAST_URL_KEY, currentUrl);
    setSavedUrl(currentUrl);
    await saveCatalogData(persistedMetadata);

    return { success: true, url: currentUrl, count: currentData.length };
  }, [catalogMetadata, saveCatalogData]);

  const clearCatalog = useCallback(async () => {
    memoryCache = null;
    await del(LAST_URL_KEY);
    await del(CATALOG_KEY);
    setSavedUrl(null);
    setCatalogMetadata(null);
    broadcastCatalogUpdate(null);
  }, [broadcastCatalogUpdate]);

  return {
    catalogMetadata,
    savedUrl,
    loading,
    importFromFile,
    importFromURL,
    refreshURL,
    persistCurrentURLData,
    disableURLPersistence,
    clearCatalog,
  };
};
