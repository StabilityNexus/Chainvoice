import { useCallback, useEffect, useMemo, useState } from "react";
import TermsOfUseModal from "@/components/TermsOfUseModal";
import { TermsOfUseContext } from "@/hooks/useTermsOfUse";
import {
  TERMS_RAW_URL,
  hasAcceptedTermsToday,
  recordTermsAcceptance,
} from "@/utils/termsOfUse";

/**
 * Shows the Terms of Use on the first visit of each UTC day, whichever page the
 * visit starts on, and lets any component reopen them through the context.
 */
export default function TermsOfUseProvider({ children }) {
  // Read synchronously so a user who accepted today never sees a flash of it.
  const [accepted, setAccepted] = useState(() => hasAcceptedTermsToday());
  const [open, setOpen] = useState(() => !accepted);
  const [content, setContent] = useState(null);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Fetched only once the modal is actually shown, so returning users today do
  // not download the document at all. A failed fetch is retried on reopen.
  useEffect(() => {
    if (!open || content !== null) return;

    const controller = new AbortController();
    setFetchFailed(false);
    fetch(TERMS_RAW_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(setContent)
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.warn("Failed to fetch the Terms of Use:", error);
        setFetchFailed(true);
      });
    return () => controller.abort();
  }, [open, content]);

  const acceptTerms = useCallback(() => {
    recordTermsAcceptance();
    setAccepted(true);
    setOpen(false);
  }, []);

  const openTerms = useCallback(() => setOpen(true), []);

  // Until the terms are accepted the modal cannot be dismissed any other way.
  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (nextOpen || accepted) setOpen(nextOpen);
    },
    [accepted]
  );

  const value = useMemo(
    () => ({ accepted, openTerms }),
    [accepted, openTerms]
  );

  return (
    <TermsOfUseContext.Provider value={value}>
      {children}
      <TermsOfUseModal
        open={open}
        onOpenChange={handleOpenChange}
        content={content}
        fetchFailed={fetchFailed}
        accepted={accepted}
        onAccept={acceptTerms}
      />
    </TermsOfUseContext.Provider>
  );
}
