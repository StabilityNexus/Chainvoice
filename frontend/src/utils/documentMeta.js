/**
 * Page title and description for each route, keyed into the `seo.pages`
 * namespace of the locale files. "/" is absent on purpose: the landing page
 * keeps the defaults from index.html.
 */
export const ROUTE_META_KEYS = {
  "/dashboard": "dashboard",
  "/dashboard/create": "createInvoice",
  "/dashboard/batch-invoice": "batchInvoice",
  "/dashboard/sent": "sentInvoices",
  "/dashboard/generate-link": "requestInvoice",
  "/dashboard/pending": "receivedInvoices",
  "/dashboard/import": "importInvoice",
  "/dashboard/settings": "settings",
  "/feature": "features",
  "/about": "about",
  "/working": "working",
  "/treasure": "treasury",
};

export const NOT_FOUND_META_KEY = "notFound";

/**
 * Looks up the locale key for a router pathname, ignoring a trailing slash.
 * Unknown paths map to the not-found entry, matching the catch-all route.
 *
 * @param {string} pathname
 * @returns {string|null} The key, or null for the landing page.
 */
export function routeMetaKey(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (path === "" || path === "/") return null;
  return ROUTE_META_KEYS[path] ?? NOT_FOUND_META_KEY;
}

/**
 * Resolves the title and description for a pathname.
 *
 * @param {string} pathname
 * @param {Function} t Translator scoped to the `seo` namespace.
 * @returns {{ title: string, description: string }|null}
 */
export function resolveRouteMeta(pathname, t) {
  const key = routeMetaKey(pathname);
  if (!key) return null;

  return {
    title: t("titleTemplate", { page: t(`pages.${key}.title`) }),
    description: t(`pages.${key}.description`),
  };
}

/**
 * Sets the document title and meta description, and returns a function that
 * puts back whatever was there before.
 *
 * @param {Document} doc
 * @param {{ title: string, description: string }|null} meta
 * @returns {() => void}
 */
export function applyDocumentMeta(doc, meta) {
  if (!meta) return () => {};

  const descriptionTag = doc.querySelector('meta[name="description"]');
  const previousTitle = doc.title;
  const previousDescription = descriptionTag?.getAttribute("content");

  doc.title = meta.title;
  descriptionTag?.setAttribute("content", meta.description);

  return () => {
    doc.title = previousTitle;
    if (descriptionTag && previousDescription != null) {
      descriptionTag.setAttribute("content", previousDescription);
    }
  };
}
