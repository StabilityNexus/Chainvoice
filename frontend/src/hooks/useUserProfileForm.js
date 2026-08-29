import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  getUserProfileFieldError,
  validateUserProfile,
} from "@/utils/userProfile";

/**
 * Editing state for the sender profile: a local draft, per-field errors, and a
 * save that validates before persisting. Shared by the Settings section and the
 * onboarding dialog so both behave identically.
 */
export const useUserProfileForm = ({ onSaved } = {}) => {
  const { profile, loading, isComplete, saveProfile, ...rest } =
    useUserProfile();

  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(() => new Set());
  const [saving, setSaving] = useState(false);

  // Adopt the stored profile once IndexedDB resolves, and whenever another
  // mounted instance saves a change.
  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleChange = useCallback((name, value) => {
    setDraft((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => (prev.has(name) ? prev : new Set(prev).add(name)));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  // Only fields the user actually edited are validated on blur. Opening a
  // dialog autofocuses the first input and moving that focus fires a blur,
  // which would otherwise flag an untouched form as invalid on arrival.
  const handleBlur = useCallback(
    (name, value) => {
      if (!touched.has(name)) return;

      const error = getUserProfileFieldError(name, value);
      setErrors((prev) => {
        if (!error && !prev[name]) return prev;
        const next = { ...prev };
        if (error) {
          next[name] = error;
        } else {
          delete next[name];
        }
        return next;
      });
    },
    [touched]
  );

  const submit = useCallback(async () => {
    const { isValid, fieldErrors } = validateUserProfile(draft);
    setErrors(fieldErrors);

    if (!isValid) {
      toast.error("Please fix the required fields");
      return false;
    }

    setSaving(true);
    try {
      const saved = await saveProfile(draft);
      toast.success("Your information has been saved");
      onSaved?.(saved);
      return true;
    } catch {
      toast.error("Could not save your information. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }, [draft, saveProfile, onSaved]);

  return {
    ...rest,
    profile,
    draft,
    errors,
    loading,
    saving,
    isComplete,
    handleChange,
    handleBlur,
    submit,
  };
};
