export const DEFAULT_DISCOUNT_TYPE = "amount";
export const DEFAULT_TAX_TYPE = "percentage";

const normalizedValue = (value) => {
  const raw = value === undefined || value === null ? "" : String(value).trim();
  return raw.replace(/\s*%$/, "").trim() || "0";
};

const endsWithSymbol = (value, symbol) => {
  if (!symbol) return false;
  const escaped = symbol.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  return new RegExp(`\\s*${escaped}$`).test(value);
};

export const formatAdjustment = (value, type, tokenSymbol, fallbackType) => {
  const raw = normalizedValue(value);
  if ((type || fallbackType) === "percentage") return `${raw}%`;

  const symbol = tokenSymbol === undefined || tokenSymbol === null ? "" : String(tokenSymbol).trim();
  if (!symbol || endsWithSymbol(raw, symbol)) return raw;
  return `${raw} ${symbol}`;
};

export const formatInvoiceDiscount = (item, tokenSymbol) =>
  formatAdjustment(item?.discount, item?.discountType, tokenSymbol, DEFAULT_DISCOUNT_TYPE);

export const formatInvoiceTax = (item, tokenSymbol) =>
  formatAdjustment(item?.tax, item?.taxType, tokenSymbol, DEFAULT_TAX_TYPE);
