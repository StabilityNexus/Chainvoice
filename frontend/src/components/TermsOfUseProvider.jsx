import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TermsOfUseModal from "@/components/TermsOfUseModal";
import { TermsOfUseContext } from "@/hooks/useTermsOfUse";
import {
  TERMS_RAW_URL,
  hasAcceptedTermsToday,
  recordTermsAcceptance,
  utcDayKey,
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
  const [fetchAttempt, setFetchAttempt] = useState(0);

  // The day accepted in this tab, kept alongside storage so users whose
  // storage is unavailable are not asked again on every return to the tab.
  const acceptedDayRef = useRef(accepted ? utcDayKey() : null);

  // Fetched only once the modal is actually shown, so returning users today do
  // not download the document at all.
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
  }, [open, content, fetchAttempt]);

  // Tabs often stay open for days, so a return to the tab after 00:00 UTC
  // counts as the first visit of the new day.
  useEffect(() => {
    const recheck = () => {
      if (document.visibilityState !== "visible") return;
      if (acceptedDayRef.current === utcDayKey() || hasAcceptedTermsToday()) {
        return;
      }
      setAccepted(false);
      setOpen(true);
    };
    document.addEventListener("visibilitychange", recheck);
    return () => document.removeEventListener("visibilitychange", recheck);
  }, []);

  const acceptTerms = useCallback(() => {
    recordTermsAcceptance();
    acceptedDayRef.current = utcDayKey();
    setAccepted(true);
    setOpen(false);
  }, []);

  const openTerms = useCallback(() => setOpen(true), []);

  // An unaccepted modal cannot be closed and reopened, so a failed fetch needs
  // its own way to try again.
  const retryFetch = useCallback(() => setFetchAttempt((n) => n + 1), []);

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
        onRetry={retryFetch}
        accepted={accepted}
        onAccept={acceptTerms}
      />
    </TermsOfUseContext.Provider>
  );
}
