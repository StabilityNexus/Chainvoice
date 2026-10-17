import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { applyDocumentMeta, resolveRouteMeta } from "@/utils/documentMeta";

/**
 * Keeps the document title and meta description in step with the current
 * route, restoring the previous values when the route changes or the caller
 * unmounts. Must be used inside the router.
 */
export function useDocumentMeta() {
  const { pathname } = useLocation();
  const { t } = useTranslation("seo");

  useEffect(
    () => applyDocumentMeta(document, resolveRouteMeta(pathname, t)),
    [pathname, t]
  );
}

export default useDocumentMeta;
