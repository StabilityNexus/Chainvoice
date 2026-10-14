import { jest } from "@jest/globals";
import { ZeroAddress } from "ethers";
import { mainnet, classic, polygon, bsc, base, sepolia } from "wagmi/chains";
import { citreaTestnet } from "../../src/utils/CitreaTestnet.jsx";
import { getNativeToken, resolveTokenDecimals } from "../../src/utils/paymentToken.js";
import { tokenUiHarness, find, findAll, en } from "../helpers/tokenUiHarness.js";

const chains = [mainnet, classic, polygon, bsc, base, sepolia, citreaTestnet];
const erc20 = { contract_address: "0x1111111111111111111111111111111111111111",
  symbol: "USDC", name: "USD Coin", decimals: 6 };
function fixture(chain = sepolia) {
  return { chains, account: { chainId: chain.id, isConnected: true },
    params: new URLSearchParams(), testnets: [sepolia.id, citreaTestnet.id], toasts: [],
    tokenList: { tokens: [erc20], loading: false, error: null },
    Contract: jest.fn().mockImplementation(() => ({
      decimals: jest.fn().mockResolvedValue(6), symbol: jest.fn().mockResolvedValue("USDC"),
      name: jest.fn().mockResolvedValue("USD Coin"),
    })) };
}
const picker = (tree) => find(tree, "TokenPicker");
const customInput = (tree) => findAll(tree, (node) => node.type === "Input" &&
  node.props.placeholder?.includes("token contract address"))[0];

const fallbackNotice = (tree) => findAll(tree, (node) =>
  [].concat(node.props?.children).some((child) =>
    typeof child === "string" && child.includes("Using local fallback")));

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("native metadata and decimals", () => {
  it.each(chains)("uses configured metadata on $name", (chain) => {
    expect(getNativeToken(chain)).toEqual({ ...chain.nativeCurrency,
      address: ZeroAddress, contract_address: ZeroAddress });
  });
  it("does not invent metadata for unsupported chains", () => {
    expect(getNativeToken(undefined)).toBeNull();
  });
  it("falls back to no selection when a chain has no native currency", () => {
    expect(getNativeToken({ id: 999, name: "Bare" })).toBeNull();
  });
  it("resolves native decimals before stale fallback metadata, without an ERC-20 read", async () => {
    const read = jest.fn();
    expect(await resolveTokenDecimals(ZeroAddress, 6, { decimals: 9 }, read)).toBe(9);
    expect(await resolveTokenDecimals(ZeroAddress, 18, undefined, read)).toBeNull();
    expect(read).not.toHaveBeenCalled();
  });
  it("preserves listed and custom ERC-20 decimal resolution", async () => {
    const read = jest.fn().mockResolvedValue(8);
    expect(await resolveTokenDecimals(erc20.contract_address, "6", sepolia.nativeCurrency, read)).toBe(6);
    expect(read).not.toHaveBeenCalled();
    expect(await resolveTokenDecimals(erc20.contract_address, undefined, sepolia.nativeCurrency, read)).toBe(8);
    expect(read).toHaveBeenCalledTimes(1);
  });
});

describe("TokenPicker", () => {
  it.each([mainnet, sepolia, citreaTestnet])("pins selectable native currency on $name", async (chain) => {
    const state = fixture(chain);
    const onSelect = jest.fn();
    const ui = await tokenUiHarness("components/TokenPicker.jsx", state);
    const tree = ui.render({ chainId: chain.id, onSelect });
    expect(find(tree, "Button").props.disabled).toBe(false);
    const rows = findAll(tree, (node) => node.props?.token && node.props?.onSelect);
    expect(rows[0].props.token).toEqual(getNativeToken(chain));
    await rows[0].props.onSelect(rows[0].props.token);
    expect(onSelect).toHaveBeenCalledWith(getNativeToken(chain));
    ui.unmount();
  });
  it.each([
    ["testnetNotice", null],
    ["testnetListUnavailable", "Please manually input the token's contract address instead."],
  ])("localizes %s through useTranslation", async (key, listError) => {
    const state = fixture(sepolia);
    if (listError) state.tokenList = { tokens: [], loading: false, error: listError };
    const ui = await tokenUiHarness("components/TokenPicker.jsx", state);
    const tree = ui.render({ chainId: sepolia.id, onSelect: jest.fn() });
    // The resolved string, not the bare key useTranslation falls back to.
    const copy = en.tokenPicker[key];
    expect(copy).toBeTruthy();
    expect(copy).not.toBe(key);
    expect(findAll(tree, (node) =>
      [].concat(node.props?.children).includes(copy))).toHaveLength(1);
    ui.unmount();
  });
  it.each(["loading", "error"])("keeps native selectable during token-list %s", async (status) => {
    const state = fixture();
    state.tokenList = { tokens: [], loading: status === "loading", error: status === "error" ? "Failed" : null };
    const ui = await tokenUiHarness("components/TokenPicker.jsx", state);
    const tree = ui.render({ chainId: sepolia.id, onSelect: jest.fn() });
    expect(findAll(tree, (node) => node.props?.token && node.props?.onSelect)[0].props.token.address).toBe(ZeroAddress);
    ui.unmount();
  });
  it("refreshes the pinned row after a network change", async () => {
    const state = fixture(sepolia);
    const ui = await tokenUiHarness("components/TokenPicker.jsx", state);
    ui.render({ chainId: sepolia.id, onSelect: jest.fn() });
    const tree = ui.render({ chainId: citreaTestnet.id, onSelect: jest.fn() });
    expect(findAll(tree, (node) => node.props?.token && node.props?.onSelect)[0].props.token)
      .toEqual(getNativeToken(citreaTestnet));
    ui.unmount();
  });
  it("deduplicates zero-address entries and preserves listed ERC-20 and custom input", async () => {
    const state = fixture(mainnet);
    state.tokenList.tokens = [erc20, { ...erc20, contract_address: ZeroAddress }];
    const onSelect = jest.fn();
    const onCustomTokenClick = jest.fn();
    const ui = await tokenUiHarness("components/TokenPicker.jsx", state);
    const tree = ui.render({ chainId: mainnet.id, onSelect, onCustomTokenClick });
    const rows = findAll(tree, (node) => node.props?.token && node.props?.onSelect);
    expect(rows.map((node) => node.props.token.contract_address)).toEqual([ZeroAddress, erc20.contract_address]);
    await rows[1].props.onSelect(erc20);
    expect(onSelect).toHaveBeenCalledWith(erc20);
    const custom = findAll(tree, (node) => node.type === "button" && node.props.onClick &&
      findAll(node, (child) => child.props?.children === "Use Custom Token").length)[0];
    custom.props.onClick();
    expect(onCustomTokenClick).toHaveBeenCalled();
    ui.unmount();
  });
});

describe("token-list error notices", () => {
  it.each([sepolia, citreaTestnet])("shows only the picker's own notice on $name", async (chain) => {
    const state = fixture(chain);
    state.tokenList = { tokens: [], loading: false,
      error: "Please manually input the token's contract address instead." };
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    expect(fallbackNotice(ui.render())).toHaveLength(0);
    ui.unmount();
  });
  it("still surfaces a real token-list failure on a mainnet", async () => {
    const state = fixture(mainnet);
    state.tokenList = { tokens: [], loading: false, error: "Failed to fetch tokens: 500" };
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    expect(fallbackNotice(ui.render())).toHaveLength(1);
    ui.unmount();
  });
});

describe("chains outside the wagmi config", () => {
  it("leaves the picker empty on a chain outside the wagmi config", async () => {
    const state = fixture(sepolia);
    state.account = { chainId: 999, isConnected: true };
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    expect(picker(ui.render()).props.selected).toBeNull();
    ui.unmount();
  });
});

describe("token lists on network changes", () => {
  it("clears a mainnet token list when switching to a testnet", async () => {
    const state = fixture(mainnet);
    state.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [erc20] });
    const ui = await tokenUiHarness("hooks/useTokenList.js", state);
    ui.render(mainnet.id); await settle();
    expect(ui.render(mainnet.id).tokens[0].contract_address).toBe(erc20.contract_address);
    expect(ui.render(citreaTestnet.id)).toMatchObject({ tokens: [], loading: false });
    expect(ui.render(citreaTestnet.id).error).toContain("manually input");
    ui.unmount();
  });
  it("discards a mainnet token fetch that completes after switching to a testnet", async () => {
    const state = fixture(mainnet);
    let complete;
    state.fetch = jest.fn(() => new Promise((resolve) => { complete = resolve; }));
    const ui = await tokenUiHarness("hooks/useTokenList.js", state);
    ui.render(mainnet.id);
    ui.render(sepolia.id);
    complete({ ok: true, json: async () => [erc20] }); await settle();
    expect(ui.render(sepolia.id)).toMatchObject({ tokens: [], loading: false });
    expect(state.fetch).toHaveBeenCalledTimes(1);
    ui.unmount();
  });
});

describe.each(["CreateInvoice", "CreateInvoicesBatch", "GenerateLink"])("%s", (page) => {
  it.each([sepolia, citreaTestnet, classic])("defaults to native on $name and preserves explicit ERC-20 selections", async (chain) => {
    const state = fixture(chain);
    const ui = await tokenUiHarness("page/" + page + ".jsx", state);
    let tree = ui.render();
    expect(picker(tree).props.selected).toEqual(getNativeToken(chain));
    await picker(tree).props.onSelect(erc20);
    tree = ui.render();
    expect(picker(tree).props.selected.address).toBe(erc20.contract_address);
    expect(picker(tree).props.selected.decimals).toBe(6);
    state.tokenList.tokens = [...state.tokenList.tokens];
    expect(picker(ui.render()).props.selected.address).toBe(erc20.contract_address);
    ui.unmount();
  });
  it("defaults without a loaded token list and resets a listed ERC-20 after switching chains", async () => {
    const state = fixture(sepolia);
    state.tokenList = { tokens: [], loading: true, error: null };
    const ui = await tokenUiHarness("page/" + page + ".jsx", state);
    expect(picker(ui.render()).props.selected).toEqual(getNativeToken(sepolia));
    await picker(ui.render()).props.onSelect(erc20);
    state.account = { ...state.account, chainId: citreaTestnet.id };
    expect(picker(ui.render()).props.selected).toEqual(getNativeToken(citreaTestnet));
    ui.unmount();
  });
  it("preserves custom ERC-20 verification on the current network", async () => {
    const state = fixture(sepolia);
    const ui = await tokenUiHarness("page/" + page + ".jsx", state);
    find(ui.render(), "ToggleSwitch").props.onChange(true);
    customInput(ui.render()).props.onChange({ target: { value: erc20.contract_address } });
    await settle();
    const tree = ui.render();
    expect(customInput(tree).props.value).toBe(erc20.contract_address);
    expect(findAll(tree, (node) => [].concat(node.props?.children).includes("USDC")).length).toBeGreaterThan(0);
    ui.unmount();
  });
  it("refreshes native metadata and clears custom ERC-20 state on a network change", async () => {
    const state = fixture();
    const ui = await tokenUiHarness("page/" + page + ".jsx", state);
    find(ui.render(), "ToggleSwitch").props.onChange(true);
    customInput(ui.render()).props.onChange({ target: { value: erc20.contract_address } });
    await settle();
    state.account = { ...state.account, chainId: citreaTestnet.id };
    const tree = ui.render();
    expect(picker(tree).props.selected).toEqual(getNativeToken(citreaTestnet));
    find(tree, "ToggleSwitch").props.onChange(true);
    expect(customInput(ui.render()).props.value).toBe("");
    ui.unmount();
  });
  it("discards a pending ERC-20 verification from the previous network", async () => {
    const state = fixture();
    let finish;
    const decimals = new Promise((resolve) => { finish = resolve; });
    state.Contract.mockImplementation(() => ({ symbol: () => Promise.resolve("OLD"),
      name: () => Promise.resolve("Old token"), decimals: () => decimals }));
    const ui = await tokenUiHarness("page/" + page + ".jsx", state);
    find(ui.render(), "ToggleSwitch").props.onChange(true);
    customInput(ui.render()).props.onChange({ target: { value: erc20.contract_address } });
    state.account = { ...state.account, chainId: citreaTestnet.id };
    ui.render();
    finish(6); await settle();
    const tree = ui.render();
    expect(picker(tree).props.selected).toEqual(getNativeToken(citreaTestnet));
    find(tree, "ToggleSwitch").props.onChange(true);
    expect(findAll(ui.render(), (node) => [].concat(node.props?.children).includes("OLD"))).toHaveLength(0);
    ui.unmount();
  });
});

describe.each(["CreateInvoice", "CreateInvoicesBatch"])("%s decimal lookups", (page) => {
  it("uses native decimals without constructing an ERC-20 contract", async () => {
    const state = fixture(citreaTestnet);
    const ui = await tokenUiHarness("page/" + page + ".jsx", state);
    await picker(ui.render()).props.onSelect({ ...getNativeToken(citreaTestnet), decimals: 6 });
    expect(picker(ui.render()).props.selected.decimals).toBe(citreaTestnet.nativeCurrency.decimals);
    expect(state.Contract).not.toHaveBeenCalled();
    ui.unmount();
  });
  it("discards a pending decimal read after switching networks", async () => {
    const state = fixture(sepolia);
    let finish;
    state.Contract.mockImplementation(() => ({ decimals: () => new Promise((resolve) => { finish = resolve; }) }));
    const ui = await tokenUiHarness("page/" + page + ".jsx", state);
    const selection = picker(ui.render()).props.onSelect({ ...erc20, decimals: undefined });
    state.account = { ...state.account, chainId: citreaTestnet.id };
    ui.render(); finish(6);
    expect(await selection).toBe(false);
    expect(picker(ui.render()).props.selected).toEqual(getNativeToken(citreaTestnet));
    ui.unmount();
  });
});

describe("payment-request links", () => {
  it.each([sepolia, citreaTestnet])("preselects zero-address links on $name without any contract read", async (chain) => {
    const state = fixture(chain);
    state.params = new URLSearchParams({ tokenAddress: ZeroAddress, customToken: "true", chain: String(chain.id) });
    state.tokenList.loading = true;
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    expect(picker(ui.render()).props.selected).toEqual(getNativeToken(chain));
    expect(state.Contract).not.toHaveBeenCalled();
    state.tokenList.loading = false;
    expect(picker(ui.render()).props.selected).toEqual(getNativeToken(chain));
    ui.unmount();
  });
  it("ignores an ERC-20 link whose chain does not match the wallet", async () => {
    const state = fixture(mainnet);
    state.params = new URLSearchParams({
      tokenAddress: erc20.contract_address, chain: String(sepolia.id),
    });
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    ui.render(); await settle();
    expect(picker(ui.render()).props.selected).toEqual(getNativeToken(mainnet));
    ui.unmount();
  });
  it("rejects a native link on a chain with no configured native currency", async () => {
    const state = fixture(mainnet);
    state.account = { chainId: 999, isConnected: true };
    state.params = new URLSearchParams({ tokenAddress: ZeroAddress, chain: "999" });
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    ui.render(); await settle();
    // Nothing selected, and not routed to custom ERC-20 verification.
    expect(picker(ui.render()).props.selected).toBeNull();
    expect(customInput(ui.render())).toBeUndefined();
    expect(state.Contract).not.toHaveBeenCalled();
    expect(state.toasts).toContainEqual(
      ["error", expect.stringContaining("native coin is not supported")]);
    ui.unmount();
  });
  it("honors a listed ERC-20 link and preserves a subsequent user choice", async () => {
    const state = fixture(mainnet);
    state.params = new URLSearchParams({ tokenAddress: erc20.contract_address, chain: "1" });
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    ui.render(); await settle();
    let tree = ui.render();
    expect(picker(tree).props.selected.address).toBe(erc20.contract_address);
    await picker(tree).props.onSelect(getNativeToken(mainnet));
    state.tokenList.tokens = [...state.tokenList.tokens];
    expect(picker(ui.render()).props.selected.address).toBe(ZeroAddress);
    state.account = { ...state.account, chainId: citreaTestnet.id };
    tree = ui.render();
    expect(picker(tree).props.selected).toEqual(getNativeToken(citreaTestnet));
    ui.unmount();
  });
  it("preserves a user choice made while an ERC-20 link is waiting for its token list", async () => {
    const state = fixture(mainnet);
    state.params = new URLSearchParams({ tokenAddress: erc20.contract_address, chain: "1" });
    state.tokenList.loading = true;
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    await picker(ui.render()).props.onSelect(getNativeToken(mainnet));
    state.tokenList.loading = false;
    ui.render(); await settle();
    expect(picker(ui.render()).props.selected.address).toBe(ZeroAddress);
    ui.unmount();
  });
  it("verifies a custom ERC-20 link without a connected wallet", async () => {
    const state = fixture(sepolia);
    state.account = { isConnected: false };
    state.params = new URLSearchParams({ tokenAddress: erc20.contract_address, customToken: "true", chain: String(sepolia.id) });
    const ui = await tokenUiHarness("page/CreateInvoice.jsx", state);
    ui.render(); await settle();
    expect(customInput(ui.render()).props.value).toBe(erc20.contract_address);
    expect(state.Contract).toHaveBeenCalledWith(erc20.contract_address, expect.anything(), expect.anything());
    ui.unmount();
  });
  it("generates a shareable native request link", async () => {
    const state = fixture(citreaTestnet);
    const ui = await tokenUiHarness("page/GenerateLink.jsx", state);
    const link = findAll(ui.render(), (node) => node.type === "Input" && node.props.value?.includes("#/dashboard/create?"))[0].props.value;
    const params = new URLSearchParams(link.split("?")[1]);
    expect(params.get("tokenAddress")).toBe(ZeroAddress);
    expect(params.get("chain")).toBe(String(citreaTestnet.id));
    expect(params.get("customToken")).toBe("false");
    ui.unmount();
  });
});
