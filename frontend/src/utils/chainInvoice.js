import { ethers } from "ethers";
import { ERC20_ABI } from "../contractsABI/ERC20_ABI.js";
import {
  evaluateOnChainInvoice,
  VERIFY_FIELD_MISMATCH,
  VERIFY_HASH_MISMATCH,
} from "../services/share/invoiceShareMatch.js";
import { resolveInvoiceDecimals } from "./invoiceAmounts.js";

/**
 * Turn the contract's invoice records into what the invoice pages show and pay.
 *
 * The contract is the authority on sender, recipient, token and amount; the
 * payload only adds detail. So the amount and token always come from the
 * chain and the token contract, and a payload is shown only when it agrees
 * with the record it claims to describe. See `evaluateOnChainInvoice` for why
 * a hash match alone does not prove that.
 */

/**
 * Create a cached reader for payment token metadata.
 *
 * Decimals are read from the token contract every time, never from a token
 * list or a payload, because they scale both the amount shown and the amount
 * approved. Symbol, name and logo are display-only, so a listed token keeps
 * its curated values and an unlisted one falls back to what its contract says.
 *
 * @param {Object} params
 * @param {ethers.ContractRunner} params.runner - provider used for reads
 * @param {Array<Object>} [params.tokens] - token list for the current chain
 * @param {{symbol: string, name: string, decimals: number}} [params.nativeCurrency]
 * @param {string} [params.fallbackLogo] - logo for tokens the list lacks
 * @returns {(address: string) => Promise<Object>} resolves to
 *   `{address, symbol, name, decimals, logo}`; `decimals` is null when the
 *   token contract could not be read
 */
export function createTokenMetadataReader({
  runner,
  tokens = [],
  nativeCurrency,
  fallbackLogo,
}) {
  const cache = new Map();

  const findListed = (address) =>
    tokens.find(
      (token) =>
        token.contract_address?.toLowerCase() === address ||
        token.address?.toLowerCase() === address
    );

  const read = async (address) => {
    const key = address.toLowerCase();
    const listed = findListed(key);
    const logo = listed?.image || listed?.logo || fallbackLogo;

    if (address === ethers.ZeroAddress) {
      return {
        address,
        symbol: nativeCurrency?.symbol ?? "ETH",
        name: nativeCurrency?.name ?? "Ether",
        decimals: nativeCurrency?.decimals ?? 18,
        logo,
      };
    }

    const contract = new ethers.Contract(address, ERC20_ABI, runner);
    const [decimals, symbol, name] = await Promise.all([
      contract
        .decimals()
        .then(Number)
        .catch(() => null),
      listed?.symbol ?? contract.symbol().catch(() => "UNKNOWN"),
      listed?.name ?? contract.name().catch(() => "Unknown Token"),
    ]);
    return { address, symbol, name, decimals, logo };
  };

  return (address) => {
    const key = address.toLowerCase();
    if (!cache.has(key)) cache.set(key, read(address));
    return cache.get(key);
  };
}

/**
 * Decide which payload, if any, may be shown for an on-chain record.
 *
 * @returns {{trusted: boolean, hashMismatch?: boolean, mismatch?: string}}
 */
function classifyPayload(raw, payload, decimals) {
  if (!payload) return { trusted: false };

  const { code, mismatch } = evaluateOnChainInvoice(raw, payload);
  if (code === VERIFY_HASH_MISMATCH) return { trusted: false, hashMismatch: true };
  if (code === VERIFY_FIELD_MISMATCH) return { trusted: false, mismatch };

  // `evaluateOnChainInvoice` compares the amount at the payload's own
  // decimals. If those differ from the token's, the payload's amount and line
  // items describe a different sum from the one the contract will charge.
  if (payload.paymentToken.decimals !== decimals) {
    return { trusted: false, mismatch: "token decimals" };
  }
  return { trusted: true };
}

/**
 * Build the invoice a page displays and pays from one on-chain record.
 *
 * A payload that agrees with the record is shown in full. Otherwise the page
 * gets a stub holding only the on-chain facts, flagged with why:
 * - `_hashMismatch`: the stored payload is not the one the sender committed
 *   to. Anyone could have put it there, so it is ignored and the invoice is
 *   still payable from the chain's values.
 * - `_payloadMismatch`: the sender committed to a payload that contradicts
 *   their own invoice (the value names the field). That is the sender
 *   misrepresenting it, so `isInvoicePayable` refuses it.
 *
 * @param {Array} raw - `InvoiceDetails` tuple from the contract
 * @param {Object|null|undefined} payload - stored invoice payload, if any
 * @param {Object} token - metadata from `createTokenMetadataReader` for `raw[4]`
 * @returns {Object|null} the invoice, or null when the token's decimals are
 *   unknown and no amount can be shown or paid safely
 */
export function buildChainInvoice(raw, payload, token) {
  const decimals = resolveInvoiceDecimals({
    address: raw[4],
    decimals: token?.decimals,
  });
  if (decimals === null) return null;

  const { trusted, hashMismatch, mismatch } = classifyPayload(
    raw,
    payload,
    decimals
  );

  const base = trusted
    ? { ...payload }
    : {
        user: { address: raw[1].toLowerCase() },
        client: { address: raw[2].toLowerCase() },
        issueDate: null,
        dueDate: null,
      };

  return {
    ...base,
    _onChainOnly: !trusted,
    _hashMismatch: Boolean(hashMismatch),
    _payloadMismatch: mismatch ?? null,
    id: BigInt(raw[0]),
    // A trusted payload's amount was just proven equal to the chain's, and it
    // keeps the sender's formatting ("100" rather than "100.0").
    amountDue: trusted
      ? String(payload.amountDue)
      : ethers.formatUnits(raw[3], decimals),
    amountDueBaseUnits: raw[3].toString(),
    paymentToken: {
      address: raw[4],
      symbol: token.symbol,
      name: token.name,
      decimals,
      logo: token.logo,
    },
    isPaid: raw[5],
    isCancelled: raw[6],
  };
}

/**
 * Whether the UI may offer to pay an invoice.
 *
 * @param {Object} invoice - an invoice from `buildChainInvoice`
 * @returns {boolean}
 */
export function isInvoicePayable(invoice) {
  return Boolean(
    invoice && !invoice.isPaid && !invoice.isCancelled && !invoice._payloadMismatch
  );
}

/**
 * Sum the base-unit amounts of invoices that share one payment token.
 *
 * @param {Array<{amountDueBaseUnits: string}>} invoices
 * @returns {bigint}
 */
export function sumBaseUnits(invoices) {
  return invoices.reduce(
    (total, invoice) => total + BigInt(invoice.amountDueBaseUnits),
    0n
  );
}
