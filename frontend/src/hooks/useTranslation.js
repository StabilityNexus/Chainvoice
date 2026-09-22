import { useState, useCallback } from "react";
import en from "../locales/en.json";

const resources = {
  en,
};

/**
 * Custom hook for accessing localized strings.
 *
 * @param {string} [defaultNamespace=""] Optional namespace prefix (e.g. "filterBar")
 * @returns {{ t: Function, locale: string }}
 */
export function useTranslation(defaultNamespace = "") {
  const [locale] = useState("en");
  const currentResource = resources[locale] || resources.en;

  const t = useCallback(
    (key, options = {}) => {
      if (!key) return typeof options === "string" ? options : "";

      const fallback = typeof options === "string" ? options : options.defaultValue || "";
      const fullKey = defaultNamespace ? `${defaultNamespace}.${key}` : key;
      const keys = fullKey.split(".");

      let current = currentResource;
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          current = undefined;
          break;
        }
      }

      if (typeof current === "string") {
        let result = current;
        if (typeof options === "object" && options !== null) {
          Object.keys(options).forEach((optKey) => {
            if (optKey !== "defaultValue") {
              result = result.replace(new RegExp(`{{\\s*${optKey}\\s*}}`, "g"), options[optKey]);
            }
          });
        }
        return result;
      }

      // Flat key fallback in namespace or root
      if (typeof currentResource[key] === "string") {
        return currentResource[key];
      }

      if (
        currentResource.filterBar &&
        typeof currentResource.filterBar[key] === "string"
      ) {
        return currentResource.filterBar[key];
      }

      return fallback || key;
    },
    [currentResource, defaultNamespace]
  );

  return { t, locale };
}

export default useTranslation;
