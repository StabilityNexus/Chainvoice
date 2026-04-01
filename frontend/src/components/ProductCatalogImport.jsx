import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { Download, UploadCloud, Link as LinkIcon, RefreshCw, CheckCircle2, AlertCircle, Trash2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const LAST_CATALOG_URL_INPUT_KEY = 'chainvoice_last_catalog_url_input';

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL((value || '').trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Resolves a human-readable label for the active catalog source.
 */
const getSourceLabel = (metadata) => {
  switch (metadata?.source) {
    case 'url':
      return metadata.url || 'URL';
    case 'url-temp':
      return 'Temporary URL (not saved)';
    case 'json':
      return 'Local JSON File';
    case 'csv':
      return 'Local CSV File';
    default:
      return 'Unknown';
  }
};

export default function ProductCatalogImport() {
  const {
    catalogMetadata,
    savedUrl,
    loading,
    importFromFile,
    importFromURL,
    refreshURL,
    persistCurrentURLData,
    disableURLPersistence,
    clearCatalog,
  } = useProductCatalog();

  const [urlInput, setUrlInput] = useState('');
  const [persistUrl, setPersistUrl] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!persistUrl) return;
    if (savedUrl) {
      setUrlInput(savedUrl);
      return;
    }
    if (typeof window !== 'undefined') {
      const lastUrl = window.localStorage.getItem(LAST_CATALOG_URL_INPUT_KEY);
      if (lastUrl) {
        setUrlInput(lastUrl);
      }
    }
  }, [persistUrl, savedUrl]);

  const hasSavedUrlSource = Boolean(savedUrl);
  const isLocalCatalogActive = catalogMetadata?.source === 'csv' || catalogMetadata?.source === 'json';

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await importFromFile(file);
      toast.success(`Loaded ${result.count} products from ${result.format}`);
      if (hasSavedUrlSource) {
        toast('Local file is now active for search. Saved URL remains available via refresh.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to import file');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [importFromFile, hasSavedUrlSource]);

  const handleUrlLoad = useCallback(async () => {
    const normalizedUrl = urlInput.trim();

    if (!normalizedUrl) {
      toast.error('Please enter a URL');
      return;
    }

    if (!isValidHttpUrl(normalizedUrl)) {
      toast.error('Invalid URL. Please use a valid http/https link.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await importFromURL(normalizedUrl, { persistUrl });
      if (typeof window !== 'undefined' && persistUrl) {
        window.localStorage.setItem(LAST_CATALOG_URL_INPUT_KEY, normalizedUrl);
      }
      toast.success(
        result.persisted
          ? `Loaded ${result.count} products from URL and saved for refresh`
          : `Loaded ${result.count} products from URL (temporary session)`,
      );
    } catch (err) {
      toast.error(err.message || 'Failed to import from URL');
    } finally {
      setIsProcessing(false);
    }
  }, [urlInput, persistUrl, importFromURL]);

  const handleRefresh = useCallback(async () => {
    setIsProcessing(true);
    try {
      const result = await refreshURL();
      toast.success(`Refreshed ${result.count} products`);
    } catch (err) {
      toast.error(err.message || 'Failed to refresh data');
    } finally {
      setIsProcessing(false);
    }
  }, [refreshURL]);

  const handlePersistToggle = useCallback(async (checked) => {
    setPersistUrl(checked);

    if (checked && catalogMetadata?.source === 'url-temp' && catalogMetadata?.url) {
      setIsProcessing(true);
      try {
        const result = await persistCurrentURLData();
        toast.success(`Saved URL for refresh (${result.count} products)`);
      } catch (err) {
        toast.error(err.message || 'Failed to save fetched URL');
      } finally {
        setIsProcessing(false);
      }
    }

    if (!checked) {
      setIsProcessing(true);
      try {
        await disableURLPersistence();
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(LAST_CATALOG_URL_INPUT_KEY);
        }
        toast.success('Saved URL removed. Refresh is now disabled.');
      } catch (err) {
        toast.error(err.message || 'Failed to remove saved URL');
      } finally {
        setIsProcessing(false);
      }
    }
  }, [catalogMetadata, persistCurrentURLData, disableURLPersistence]);

  const handleClear = useCallback(async () => {
    setIsProcessing(true);
    try {
      await clearCatalog();
      setUrlInput('');
      setPersistUrl(false);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(LAST_CATALOG_URL_INPUT_KEY);
      }
      toast.success('Product catalog cleared');
    } catch (err) {
      toast.error('Failed to clear catalog');
    } finally {
      setIsProcessing(false);
    }
  }, [clearCatalog]);

  const downloadSampleTemplate = useCallback(() => {
    const csvContent = 'name,price,tax,discount,qty\nProduct A,100,5,10,1\nProduct B,200,0,0,1';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product-catalog-sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  if (loading) return null;

  const sourceLabel = getSourceLabel(catalogMetadata);

  return (
    <div className="mb-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <UploadCloud className="text-gray-600 w-5 h-5" />
          Product Catalog Import
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-gray-700"
                aria-label="Product catalog help"
              >
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Using Product Catalog Import</DialogTitle>
                <DialogDescription>
                  Import once, then browse and search products while creating invoices.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm text-gray-700">
                <p><span className="font-semibold text-gray-900">Choose what works best for you:</span> local upload (CSV/JSON), URL fetch (CSV/JSON), and optional URL save for IndexedDB refresh.</p>
                <div>
                  <p className="font-semibold text-gray-900">Google Sheets to CSV URL:</p>
                  <p>In Google Sheets, open <span className="font-medium">File - Share - Publish to web</span>, choose the tab, select <span className="font-medium">CSV</span>, then copy and paste that published URL here.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">External API URLs (CORS):</p>
                  <p>When fetching from a custom server, ensure it includes <span className="font-medium">CORS headers</span> (e.g. <code>Access-Control-Allow-Origin: *</code>), otherwise the browser will block the fetch request.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">JSON format example:</p>
                  <pre className="mt-1 rounded-md bg-gray-100 p-2 text-xs text-gray-800 overflow-x-auto">{`[
  {"name":"Product A","price":100,"tax":5,"discount":10,"qty":1},
  {"description":"Service B","unit_price":50}
]`}</pre>
                </div>
                <p><span className="font-semibold text-gray-900">Required fields:</span> name or description, and price or unit_price.</p>
                <p><span className="font-semibold text-gray-900">Optional fields:</span> tax, discount, qty.</p>
                <p><span className="font-semibold text-gray-900">Browsing behavior:</span> product rows are shown by default with a limit and <span className="font-medium">Load more</span> pagination.</p>
                <p><span className="font-semibold text-gray-900">Search behavior:</span> search stays a filter, useful for larger catalogs, and matching is case-insensitive.</p>
                <div>
                  <p className="font-semibold text-gray-900">Best case recommendations by dataset size:</p>
                  <p><span className="font-medium">Small (up to ~200 rows):</span> local CSV/JSON upload is fastest.</p>
                  <p><span className="font-medium">Medium (200 to 5,000 rows):</span> use URL fetch + save URL so refresh pulls updates without re-upload.</p>
                  <p><span className="font-medium">Large (5,000+ rows):</span> prefer URL source, keep default browse with load more, and use search to filter quickly.</p>
                </div>
                <p><span className="font-semibold text-gray-900">Performance:</span> imported data is stored in IndexedDB and reused in memory for faster product lookup.</p>
              </div>
            </DialogContent>
          </Dialog>
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={downloadSampleTemplate} className="text-sm">
          <Download className="w-4 h-4 mr-2" /> Sample CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 block mb-2">Upload local CSV or JSON</Label>
            <Input
              type="file"
              accept=".csv,.json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="cursor-pointer file:bg-gray-100 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:text-sm file:font-medium hover:file:bg-gray-200 text-gray-600 bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 block mb-2">Fetch from URL (CSV/JSON)</Label>
            <form 
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void handleUrlLoad();
              }}
            >
              <Input
                type="url"
                placeholder="https://example.com/data.csv"
                value={urlInput}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setUrlInput(nextValue);
                  if (typeof window !== 'undefined' && persistUrl) {
                    window.localStorage.setItem(LAST_CATALOG_URL_INPUT_KEY, nextValue);
                  }
                }}
                disabled={isProcessing}
                className="flex-1 bg-gray-50 border-gray-200 text-gray-800"
              />
              <Button type="submit" disabled={isProcessing || !urlInput.trim()} className="shrink-0 bg-gray-800 text-white hover:bg-gray-700">
                <LinkIcon className="w-4 h-4 mr-2" /> Fetch URL
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRefresh}
                disabled={isProcessing || !hasSavedUrlSource}
                className="shrink-0"
                title={hasSavedUrlSource ? (isLocalCatalogActive ? 'Load saved URL data (replaces active local file in search)' : 'Refresh products from saved URL') : 'Load from URL first to enable refresh'}
              >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              </Button>
            </form>

            <div className="mt-2 flex items-center gap-2">
              <input
                id="persist-url"
                type="checkbox"
                checked={persistUrl}
                onChange={(e) => handlePersistToggle(e.target.checked)}
                className="h-4 w-4"
                disabled={isProcessing}
              />
              <Label htmlFor="persist-url" className="text-xs text-gray-600">
                Save this URL in IndexedDB (last URL only) and enable refresh updates
              </Label>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              URL fetch works without saving. Enable the checkbox to store the last URL in IndexedDB for one-click refresh later.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Search always uses the currently loaded catalog. Importing a new source replaces the active search dataset.
            </p>
            {hasSavedUrlSource && (
              <p className="text-xs text-gray-500 mt-1 truncate" title={savedUrl}>
                Saved URL: {savedUrl}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-between border border-gray-100">
          <div>
            <Label className="text-sm font-bold text-gray-700 mb-2 block">Accepted Format</Label>
            <p className="text-xs text-gray-600 mb-1"><span className="font-semibold text-gray-800">Required:</span> name (or description), price (or unit_price)</p>
            <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">Optional:</span> tax, discount, qty</p>
            <p className="text-xs text-gray-500 mt-2">Autocomplete shows default rows with a limit and Load more. Search filters the same catalog for large datasets.</p>
            <p className="text-xs text-gray-500 mt-2">Imported catalog is cached in IndexedDB and memory for faster autocomplete.</p>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            {catalogMetadata ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-green-700 font-medium tracking-tight">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                    Loaded: {catalogMetadata.data.length} products
                  </span>
                  <div className="flex gap-2">
                    {hasSavedUrlSource && (
                      <Button type="button" variant="outline" size="sm" onClick={handleRefresh} disabled={isProcessing} className="h-7 text-xs px-2 bg-white">
                        <RefreshCw className={`w-3 h-3 mr-1 ${isProcessing ? 'animate-spin' : ''}`} /> {isLocalCatalogActive ? 'Load Saved URL' : 'Refresh'}
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="sm" onClick={handleClear} disabled={isProcessing} className="h-7 text-xs px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="truncate max-w-[250px]" title={sourceLabel}>
                    Source: {sourceLabel}
                  </span>
                  {catalogMetadata.source === 'url-temp' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 ml-2">
                      Session only
                    </span>
                  )}
                </div>
                {hasSavedUrlSource && isLocalCatalogActive && (
                  <div className="text-xs text-amber-600">Saved URL exists. Use Load Saved URL to switch search data back to URL source.</div>
                )}
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <AlertCircle className="w-4 h-4 mr-2 text-gray-400" />
                No products loaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
