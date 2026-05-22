import { formatUnits, parseUnits } from 'ethers';

const PRECISION = 18;
const ONE = parseUnits('1', PRECISION);

export const createEmptyInvoiceItem = () => ({
  id: crypto.randomUUID(),
  description: '',
  qty: '',
  unitPrice: '',
  discount: '',
  tax: '',
  amount: '',
});

/**
 * Computes the line-item amount from qty, unitPrice, discount, and tax.
 * Returns a formatted string or "0" on invalid input.
 */
const computeLineAmount = (qty, unitPrice, discount, tax) => {
  try {
    const qtyBN = parseUnits(qty || '0', PRECISION);
    const priceBN = parseUnits(unitPrice || '0', PRECISION);
    const discountBN = parseUnits(discount || '0', PRECISION);
    const taxBN = parseUnits(tax || '0', PRECISION);

    const lineTotal = (qtyBN * priceBN) / ONE;
    const finalAmount = lineTotal - discountBN + taxBN;
    return formatUnits(finalAmount, PRECISION);
  } catch {
    return '0';
  }
};

/**
 * Applies product catalog data onto an existing invoice item,
 * filling description, price, and optional fields.
 */
export const applyProductToInvoiceItem = (item, product) => {
  const updatedItem = {
    ...item,
    description: product.name || product.description || '',
    unitPrice: String(product.price ?? item.unitPrice ?? ''),
    tax: String(product.tax ?? item.tax ?? ''),
    discount: String(product.discount ?? item.discount ?? ''),
    qty: String(product.qty ?? (item.qty || '1')),
  };

  updatedItem.amount = computeLineAmount(
    updatedItem.qty,
    updatedItem.unitPrice,
    updatedItem.discount,
    updatedItem.tax,
  );

  return updatedItem;
};
