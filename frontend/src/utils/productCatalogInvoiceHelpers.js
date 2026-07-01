import { formatUnits, parseUnits } from 'ethers';

import { getSafeLineAmountDisplay } from './invoiceCalculations';

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
  discountType: 'amount',
  taxType: 'percentage',
});

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

  updatedItem.amount = getSafeLineAmountDisplay(updatedItem);

  return updatedItem;
};
