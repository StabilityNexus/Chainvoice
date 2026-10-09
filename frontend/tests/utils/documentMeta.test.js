import { readFileSync } from "node:fs";
import {
  NOT_FOUND_META_KEY,
  ROUTE_META_KEYS,
  applyDocumentMeta,
  resolveRouteMeta,
  routeMetaKey,
} from "../../src/utils/documentMeta.js";

const en = JSON.parse(
  readFileSync(new URL("../../src/locales/en.json", import.meta.url), "utf8")
);

// Mirrors useTranslation's lookup and {{var}} interpolation for the seo namespace.
function seoT(key, options = {}) {
  const value = key.split(".").reduce((node, k) => node?.[k], en.seo);
  if (typeof value !== "string") return key;
  return value.replace(/{{\s*(\w+)\s*}}/g, (_, name) => options[name] ?? "");
}

function createDocument({ title = "Chainvoice | Stability Nexus", description = "Default." } = {}) {
  const attrs = { content: description };
  const tag = {
    getAttribute: (name) => attrs[name] ?? null,
    setAttribute: (name, value) => {
      attrs[name] = String(value);
    },
  };
  return {
    title,
    querySelector: (selector) => (selector === 'meta[name="description"]' ? tag : null),
    get description() {
      return attrs.content;
    },
  };
}

describe("routeMetaKey", () => {
  test("returns null for the landing page", () => {
    expect(routeMetaKey("/")).toBeNull();
    expect(routeMetaKey("")).toBeNull();
  });

  test("maps known routes, with or without a trailing slash", () => {
    expect(routeMetaKey("/dashboard/sent")).toBe("sentInvoices");
    expect(routeMetaKey("/dashboard/sent/")).toBe("sentInvoices");
    expect(routeMetaKey("/about")).toBe("about");
  });

  test("falls back to the not-found entry for unknown routes", () => {
    expect(routeMetaKey("/nope")).toBe(NOT_FOUND_META_KEY);
    expect(routeMetaKey("/dashboard/unknown")).toBe(NOT_FOUND_META_KEY);
  });
});

describe("resolveRouteMeta", () => {
  test("formats the title as '<Page> | Chainvoice'", () => {
    expect(resolveRouteMeta("/dashboard/create", seoT)).toEqual({
      title: "Send Invoice | Chainvoice",
      description: en.seo.pages.createInvoice.description,
    });
  });

  test("returns null for the landing page so index.html defaults stand", () => {
    expect(resolveRouteMeta("/", seoT)).toBeNull();
  });

  test("every mapped route has a title and description in en.json", () => {
    const keys = [...Object.values(ROUTE_META_KEYS), NOT_FOUND_META_KEY];
    for (const key of keys) {
      expect(typeof en.seo.pages[key]?.title).toBe("string");
      expect(typeof en.seo.pages[key]?.description).toBe("string");
      expect(en.seo.pages[key].description.length).toBeLessThanOrEqual(160);
    }
  });
});

describe("applyDocumentMeta", () => {
  test("sets the title and description and restores them afterwards", () => {
    const doc = createDocument();
    const restore = applyDocumentMeta(doc, { title: "About | Chainvoice", description: "About us." });

    expect(doc.title).toBe("About | Chainvoice");
    expect(doc.description).toBe("About us.");

    restore();
    expect(doc.title).toBe("Chainvoice | Stability Nexus");
    expect(doc.description).toBe("Default.");
  });

  test("restores defaults between consecutive routes", () => {
    const doc = createDocument();
    const leaveAbout = applyDocumentMeta(doc, resolveRouteMeta("/about", seoT));
    leaveAbout();
    applyDocumentMeta(doc, resolveRouteMeta("/", seoT));

    expect(doc.title).toBe("Chainvoice | Stability Nexus");
    expect(doc.description).toBe("Default.");
  });

  test("is a no-op when there is no meta to apply", () => {
    const doc = createDocument();
    applyDocumentMeta(doc, null)();
    expect(doc.title).toBe("Chainvoice | Stability Nexus");
  });

  test("still sets the title when the description tag is missing", () => {
    const doc = { title: "Default", querySelector: () => null };
    const restore = applyDocumentMeta(doc, { title: "Settings | Chainvoice", description: "x" });

    expect(doc.title).toBe("Settings | Chainvoice");
    restore();
    expect(doc.title).toBe("Default");
  });
});
