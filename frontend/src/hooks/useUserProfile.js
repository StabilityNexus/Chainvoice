import { useCallback, useEffect, useState } from "react";
import { del, get, set } from "idb-keyval";
import {
  createEmptyUserProfile,
  isUserProfileComplete,
  normalizeUserProfile,
} from "@/utils/userProfile";

const PROFILE_KEY = "chainvoice_user_profile";
const ONBOARDING_DISMISSED_KEY = "chainvoice_onboarding_dismissed";
const PROFILE_UPDATED_EVENT = "chainvoice:user-profile-updated";

/**
 Module-level memory cache shared by all hook instances.
 Intentional singleton: avoids redundant IndexedDB reads across components.
 Kept in sync by saveProfile()/clearProfile() and the broadcast event.
 */
let memoryCache = null;

const broadcastProfileUpdate = (profile) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(PROFILE_UPDATED_EVENT, { detail: profile })
  );
};

/**
 * Reads and writes the sender ("From") profile that every invoice is issued
 * under. Stored locally only — these details never leave the browser except
 * inside an invoice payload the user explicitly sends.
 */
export const useUserProfile = () => {
  const [profile, setProfile] = useState(createEmptyUserProfile);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyProfile = useCallback((next) => {
    memoryCache = next;
    setProfile(next);
  }, []);

  const saveProfile = useCallback(
    async (nextProfile) => {
      const normalized = normalizeUserProfile(nextProfile);

      try {
        await set(PROFILE_KEY, normalized);
      } catch (err) {
        console.error("Failed to save user profile to IndexedDB:", err);
        throw err;
      }

      applyProfile(normalized);
      broadcastProfileUpdate(normalized);
      return normalized;
    },
    [applyProfile]
  );

  const clearProfile = useCallback(async () => {
    try {
      await del(PROFILE_KEY);
    } catch (err) {
      console.error("Failed to clear user profile from IndexedDB:", err);
      throw err;
    }

    const empty = createEmptyUserProfile();
    applyProfile(empty);
    broadcastProfileUpdate(empty);
  }, [applyProfile]);

  /** Records that onboarding was skipped, so it is not shown again on every visit. */
  const dismissOnboarding = useCallback(async () => {
    setOnboardingDismissed(true);
    try {
      await set(ONBOARDING_DISMISSED_KEY, true);
    } catch (err) {
      // Non-critical: the prompt reappearing is better than blocking the user.
      console.warn("Failed to persist onboarding dismissal:", err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const handleProfileUpdated = (event) => {
      const next = normalizeUserProfile(event?.detail);
      memoryCache = next;
      setProfile(next);
      setLoading(false);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    }

    const load = async () => {
      try {
        const [stored, dismissed] = await Promise.all([
          memoryCache ? Promise.resolve(memoryCache) : get(PROFILE_KEY),
          get(ONBOARDING_DISMISSED_KEY),
        ]);

        if (cancelled) return;
        memoryCache = normalizeUserProfile(stored);
        setProfile(memoryCache);
        setOnboardingDismissed(Boolean(dismissed));
      } catch (err) {
        console.error("Failed to load user profile from IndexedDB:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
      }
    };
  }, []);

  return {
    profile,
    loading,
    isComplete: isUserProfileComplete(profile),
    onboardingDismissed,
    saveProfile,
    clearProfile,
    dismissOnboarding,
  };
};
