import { createContext, useContext } from "react";

export const TermsOfUseContext = createContext(null);

/**
 * Access to the app-wide Terms of Use modal: whether the terms were accepted
 * today, and `openTerms` for surfaces such as the footer link.
 */
export function useTermsOfUse() {
  const context = useContext(TermsOfUseContext);
  if (!context) {
    throw new Error("useTermsOfUse must be used inside TermsOfUseProvider");
  }
  return context;
}
