import { formatUnits, parseUnits } from "ethers";

export const INVOICE_DECIMALS = 18;
const ONE_INVOICE_UNIT = parseUnits("1", INVOICE_DECIMALS);
const HUNDRED_INVOICE_UNITS = parseUnits("100", INVOICE_DECIMALS);

export const parseNumericInputToWei = (value) => {
  const normalized = String(value ?? "").trim();

  if (!normalized) return 0n;
  if (
    normalized === "-" ||
    normalized === "." ||
    normalized === "-." ||
    !/^-?\d*(\.\d*)?$/.test(normalized)
  ) {
    return null;
  }

  try {
    return parseUnits(normalized, INVOICE_DECIMALS);
  } catch {
    return null;
  }
};

export const getLineAmountDetails = (item) => {
  const qtyWei = parseNumericInputToWei(item?.qty);
  const unitPriceWei = parseNumericInputToWei(item?.unitPrice);
  const discountWei = parseNumericInputToWei(item?.discount);
  const taxRateWei = parseNumericInputToWei(item?.tax);

  if (
    qtyWei === null ||
    unitPriceWei === null ||
    discountWei === null ||
    taxRateWei === null
  ) {
    return {
      valid: false,
      amountWei: 0n,
      lineTotalWei: 0n,
      qtyWei: 0n,
      unitPriceWei: 0n,
      discountWei: 0n,
      taxRateWei: 0n,
      taxAmountWei: 0n,
    };
  }

  const lineTotalWei = (qtyWei * unitPriceWei) / ONE_INVOICE_UNIT;
  // Discount is a flat token amount; tax is a percentage of the line total.
  const taxAmountWei = (lineTotalWei * taxRateWei) / HUNDRED_INVOICE_UNITS;
  const amountWei = lineTotalWei - discountWei + taxAmountWei;

  return {
    valid: true,
    amountWei,
    lineTotalWei,
    qtyWei,
    unitPriceWei,
    discountWei,
    taxRateWei,
    taxAmountWei,
  };
};

export const getSafeLineAmountDisplay = (item) => {
  const { valid, amountWei } = getLineAmountDetails(item);
  if (!valid) return "";
  const safeAmount = amountWei < 0n ? 0n : amountWei;
  return formatUnits(safeAmount, INVOICE_DECIMALS);
};
