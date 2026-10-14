import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";
import { transform } from "esbuild";
import * as ethers from "ethers";
import * as calculations from "../../src/utils/invoiceCalculations.js";
import { format } from "date-fns";
import * as validation from "../../src/utils/invoiceValidation.js";
import * as products from "../../src/utils/productCatalogInvoiceHelpers.js";

// Read rather than `import ... with { type: "json" }`: import attributes are not
// available on every supported Node version, and this keeps the real strings.
export const en = JSON.parse(readFileSync(resolve("src/locales/en.json"), "utf8"));
const translate = (namespace, key) =>
  (namespace ? en[namespace]?.[key] : en[key]) ?? key;

// Exercise component callbacks and effects in Jest's Node environment, without
// adding a DOM dependency. UI children and unrelated services are stubbed.
export async function tokenUiHarness(file, state) {
  const context = createContext({
    window: { ethereum: {}, location: { origin: "https://chainvoice.test" } },
    document: { body: { style: {} } },
    console: { ...console, log: () => {} }, fetch: state.fetch,
    setTimeout, clearTimeout, URLSearchParams,
  });
  const slots = [];
  let cursor = 0;
  let pending = [];
  let dirty = false;
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const hooks = {
    useState(initial) {
      const i = cursor++;
      if (!slots[i]) slots[i] = { value: typeof initial === "function" ? initial() : initial };
      slots[i].set ??= (next) => {
        const value = typeof next === "function" ? next(slots[i].value) : next;
        if (!Object.is(value, slots[i].value)) dirty = true;
        slots[i].value = value;
      };
      return [slots[i].value, slots[i].set];
    },
    useRef(value) {
      const i = cursor++;
      return (slots[i] ??= { current: value });
    },
    useMemo(fn, deps) {
      const i = cursor++;
      if (!slots[i] || !same(slots[i].deps, deps)) slots[i] = { value: fn(), deps };
      return slots[i].value;
    },
    useCallback(fn, deps) { return hooks.useMemo(() => fn, deps); },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!slots[i] || !same(slots[i].deps, deps)) {
        const cleanup = slots[i]?.cleanup;
        slots[i] = { deps };
        pending.push(() => { cleanup?.(); slots[i].cleanup = fn(); });
      }
    },
    memo: (component) => component,
  };
  const jsx = (type, props) => ({ type, props });
  const namespaces = {
    react: hooks,
    "react-hot-toast": { default: Object.assign(() => {}, {
      error: (message) => state.toasts?.push(["error", message]),
      success: (message) => state.toasts?.push(["success", message]) }) },
    "../hooks/useTranslation": {
      useTranslation: (namespace) => ({ t: (key) => translate(namespace, key), locale: "en" }) },
    "date-fns": { format },
    "@/utils/invoiceValidation": validation,
    "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "Fragment" },
    wagmi: { useConfig: () => ({ chains: state.chains }), useAccount: () => state.account,
      useWalletClient: () => ({ data: {} }) },
    ethers: { ...ethers, ethers: { ...ethers.ethers, Contract: state.Contract },
      BrowserProvider: class {}, JsonRpcProvider: class {} },
    "react-router-dom": { useSearchParams: () => [state.params], useNavigate: () => () => {} },
    "@/hooks/useTokenList": { useTokenList: () => state.tokenList,
      isTestnet: (id) => state.testnets.includes(id) },
    "../hooks/useTokenList": { useTokenList: () => state.tokenList, isTestnet: (id) => state.testnets.includes(id), ChainIdToName: {} },
    "@/utils/invoiceCalculations": calculations,
    "@/utils/productCatalogInvoiceHelpers": products,
    "@/hooks/useUserProfile": { useUserProfile: () => ({ profile: {}, isComplete: true }) },
    "@/hooks/useProductCatalog": { useProductCatalog: () => ({ catalogMetadata: [] }) },
    "@/hooks/useRelayKeys": { useRelayKeys: () => ({}) },
    "@/lib/utils": { cn: (...args) => args.filter(Boolean).join(" ") },
  };
  const cache = new Map();
  async function load(path) {
    if (cache.has(path)) return cache.get(path);
    const source = readFileSync(path, "utf8");
    const code = (await transform(source, { loader: "jsx", format: "esm", jsx: "automatic",
      define: { "import.meta.env": JSON.stringify({ BASE_URL: "/" }) } })).code;
    const module = new SourceTextModule(code, { identifier: path, context });
    cache.set(path, module);
    await module.link(async (specifier) => {
      if (/usePaymentToken|paymentToken|useTokenSearch/.test(specifier)) {
        return load(resolve(dirname(path), /\.jsx?$/.test(specifier) ? specifier : specifier + ".js"));
      }
      const names = [];
      const imports = /import\s+(?:(\w+)\s*,?\s*)?(?:\{([^}]+)\}\s*)?from\s*["']([^"']+)["']/g;
      for (const match of code.matchAll(imports)) {
        if (match[3] !== specifier) continue;
        if (match[1]) names.push("default");
        if (match[2]) names.push(...match[2].split(",").map((s) => s.trim().split(/\s+as\s+/)[0]));
      }
      const values = namespaces[specifier] || {};
      return new SyntheticModule(names, function () {
        for (const name of names) this.setExport(name, values[name] ??
          (name === "default" ? specifier.split("/").pop().replace(/\.jsx?$/, "") : name));
      }, { context });
    });
    return module;
  }
  const module = await load(resolve("src", file));
  await module.evaluate();
  const component = module.namespace.default || module.namespace.usePaymentToken || module.namespace.useTokenList;
  return {
    render(props) {
      let tree;
      for (let attempts = 0; attempts < 20; attempts++) {
        cursor = 0; pending = []; dirty = false;
        tree = component(props);
        for (const effect of pending) effect();
        if (!dirty) return tree;
      }
      throw new Error("Component did not settle");
    },
    unmount() { slots.forEach((slot) => slot?.cleanup?.()); },
  };
}

export function findAll(tree, predicate) {
  if (Array.isArray(tree)) return tree.flatMap((node) => findAll(node, predicate));
  if (!tree || typeof tree !== "object") return [];
  return [...(predicate(tree) ? [tree] : []), ...findAll(tree.props?.children, predicate)];
}
export const find = (tree, type) => findAll(tree, (node) => node.type === type)[0];
