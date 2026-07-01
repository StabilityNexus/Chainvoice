import { ethers } from "ethers";
import { getLineAmountDetails, parseNumericInputToWei } from "./invoiceCalculations";

export const getClientAddressError = (value, options = {}) => {
  const { required = false, ownerAddress } = options;
  const trimmed = (value || "").trim();

  if (!trimmed) {
    return required ? "Please enter a client wallet address" : "";
  }

  if (!trimmed.startsWith("0x") || trimmed.length !== 42 || !ethers.isAddress(trimmed)) {
    return "Please enter a valid wallet address";
  }

  if (ownerAddress && trimmed.toLowerCase() === ownerAddress.toLowerCase()) {
    return "You cannot create an invoice for your own wallet";
  }

  return "";
};

const getTokenDecimalsError = (amountAsString, paymentToken) => {
  const tokenDecimals = Number(paymentToken?.decimals);
  if (!Number.isInteger(tokenDecimals) || tokenDecimals < 0) {
    return null;
  }

  try {
    ethers.parseUnits(amountAsString.toString(), tokenDecimals);
    return null;
  } catch {
    return `Invoice total supports up to ${tokenDecimals} decimals for ${paymentToken?.symbol || "selected token"}`;
  }
};

const getLineItemError = (lineLabel, item) => {
  let errors = {};
  
  if (!item.description || !item.description.trim()) {
    errors.description = "Required";
  }
  
  const { valid, amountWei, qtyWei, unitPriceWei, discountWei, taxRateWei } = getLineAmountDetails(item);
  
  if (!item.qty || qtyWei === 0n) {
    errors.qty = "Required";
  } else if (qtyWei < 0n) {
    errors.qty = "Cannot be negative";
  }
  
  if (!item.unitPrice || unitPriceWei === 0n) {
    errors.unitPrice = "Required";
  } else if (unitPriceWei < 0n) {
    errors.unitPrice = "Cannot be negative";
  }
  
  if (discountWei < 0n) {
    errors.discount = "Cannot be negative";
  }
  
  if (taxRateWei < 0n) {
    errors.tax = "Cannot be negative";
  }
  
  if (!valid) {
    errors.amount = "Invalid number format";
  } else if (amountWei < 0n) {
    errors.amount = "Amount cannot be negative. Reduce discount or update values";
  }
  
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  
  return null;
};

export const validateSingleInvoiceData = ({
  clientAddress,
  itemData,
  totalAmountDue,
  paymentToken,
  ownerAddress,
  userFname,
  userEmail,
  clientFname,
  clientEmail,
}) => {
  const fieldErrors = {};
  let hasFieldErrors = false;

  const addressError = getClientAddressError(clientAddress, {
    required: true,
    ownerAddress,
  });

  if (addressError) {
    fieldErrors.clientAddress = addressError;
    hasFieldErrors = true;
  }
  
  if (!userFname || !userFname.trim()) {
    fieldErrors.userFname = "First name is required";
    hasFieldErrors = true;
  }
  
  if (!userEmail || !userEmail.trim()) {
    fieldErrors.userEmail = "Email is required";
    hasFieldErrors = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
    fieldErrors.userEmail = "Invalid email address";
    hasFieldErrors = true;
  }
  
  if (!clientFname || !clientFname.trim()) {
    fieldErrors.clientFname = "First name is required";
    hasFieldErrors = true;
  }
  
  if (!clientEmail || !clientEmail.trim()) {
    fieldErrors.clientEmail = "Email is required";
    hasFieldErrors = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    fieldErrors.clientEmail = "Invalid email address";
    hasFieldErrors = true;
  }

  let hasItemErrors = false;
  const itemErrorsObj = {};
  
  for (let i = 0; i < itemData.length; i += 1) {
    const itemErrors = getLineItemError(`Line item ${i + 1}`, itemData[i]);
    if (itemErrors) {
      itemErrorsObj[`item_${i}`] = itemErrors;
      hasItemErrors = true;
    }
  }
  
  if (hasItemErrors || hasFieldErrors) {
    // If there is an address error, we can prioritize its message, otherwise a generic one.
    const errorMessage = addressError || "Please fix the required fields";
    return {
      isValid: false,
      errorMessage,
      fieldErrors: { ...itemErrorsObj, ...fieldErrors },
    };
  }

  const totalWei = parseNumericInputToWei(totalAmountDue);
  if (totalWei === null || totalWei <= 0n) {
    return {
      isValid: false,
      errorMessage: "Invoice total must be greater than 0",
      fieldErrors: { totalAmountDue: "Invoice total must be greater than 0" },
    };
  }

  const decimalsError = getTokenDecimalsError(totalAmountDue, paymentToken);
  if (decimalsError) {
    return {
      isValid: false,
      errorMessage: decimalsError,
      fieldErrors: { totalAmountDue: decimalsError },
    };
  }

  return {
    isValid: true,
    errorMessage: "",
    fieldErrors: {},
  };
};

export const validateBatchInvoiceData = ({
  rows,
  paymentToken,
  ownerAddress,
  userInfo,
}) => {
  const normalizedRows = rows.map((row) => ({
    ...row,
    clientAddress: (row.clientAddress || "").trim(),
  }));

  const duplicateTracker = new Map();
  const pendingAddressErrors = {};
  const pendingTotalErrors = {};
  const pendingItemErrors = {};
  const pendingFieldErrors = {};
  
  let globalHasErrors = false;
  
  if (!userInfo?.userFname || !userInfo.userFname.trim()) {
    pendingFieldErrors.userFname = "First name is required";
    globalHasErrors = true;
  }
  
  if (!userInfo?.userEmail || !userInfo.userEmail.trim()) {
    pendingFieldErrors.userEmail = "Email is required";
    globalHasErrors = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.userEmail)) {
    pendingFieldErrors.userEmail = "Invalid email address";
    globalHasErrors = true;
  }

  for (let rowIndex = 0; rowIndex < normalizedRows.length; rowIndex += 1) {
    const row = normalizedRows[rowIndex];
    const rowLabel = `Invoice #${rowIndex + 1}`;
    const hasMeaningfulInput = row.clientAddress || parseFloat(row.totalAmountDue) > 0;

    if (!hasMeaningfulInput) {
      continue;
    }

    const addressError = getClientAddressError(row.clientAddress, {
      required: true,
      ownerAddress,
    });

    if (addressError) {
      pendingAddressErrors[rowIndex] = addressError;
      globalHasErrors = true;
    }
    
    if (!row.clientFname || !row.clientFname.trim()) {
      pendingFieldErrors[`${rowIndex}_clientFname`] = "First name is required";
      globalHasErrors = true;
    }
    
    if (!row.clientEmail || !row.clientEmail.trim()) {
      pendingFieldErrors[`${rowIndex}_clientEmail`] = "Email is required";
      globalHasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.clientEmail)) {
      pendingFieldErrors[`${rowIndex}_clientEmail`] = "Invalid email address";
      globalHasErrors = true;
    }

    const normalizedAddress = row.clientAddress.toLowerCase();
    if (normalizedAddress && !addressError) {
      if (duplicateTracker.has(normalizedAddress)) {
        const firstIndex = duplicateTracker.get(normalizedAddress);
        pendingAddressErrors[firstIndex] = "Duplicate wallet address in batch";
        pendingAddressErrors[rowIndex] = "Duplicate wallet address in batch";
        globalHasErrors = true;
      } else {
        duplicateTracker.set(normalizedAddress, rowIndex);
      }
    }

    for (let itemIndex = 0; itemIndex < row.itemData.length; itemIndex += 1) {
      const itemErrors = getLineItemError(`${rowLabel}, line item ${itemIndex + 1}`, row.itemData[itemIndex]);
      if (itemErrors) {
        pendingItemErrors[`${rowIndex}_${itemIndex}`] = itemErrors;
        globalHasErrors = true;
      }
    }
    
    const totalWei = parseNumericInputToWei(row.totalAmountDue);
    if (totalWei === null || totalWei <= 0n) {
      pendingTotalErrors[rowIndex] = "Invoice total must be greater than 0";
      globalHasErrors = true;
    }

    const decimalsError = getTokenDecimalsError(row.totalAmountDue, paymentToken);
    if (decimalsError) {
      pendingTotalErrors[rowIndex] = decimalsError;
      globalHasErrors = true;
    }
  }

  const validInvoices = normalizedRows.filter(
    (row) => row.clientAddress && parseFloat(row.totalAmountDue) > 0
  );

  if (globalHasErrors) {
    return {
      isValid: false,
      errorMessage: "Please fix the required fields",
      addressErrors: pendingAddressErrors,
      totalErrors: pendingTotalErrors,
      itemErrors: pendingItemErrors,
      fieldErrors: pendingFieldErrors,
      validInvoices: [],
    };
  }

  if (validInvoices.length === 0) {
    return {
      isValid: false,
      errorMessage: "Please add at least one valid invoice with client address and amount",
      addressErrors: pendingAddressErrors,
      totalErrors: pendingTotalErrors,
      itemErrors: pendingItemErrors,
      fieldErrors: pendingFieldErrors,
      validInvoices: [],
    };
  }

  return {
    isValid: true,
    errorMessage: "",
    addressErrors: {},
    totalErrors: {},
    itemErrors: {},
    fieldErrors: {},
    validInvoices,
  };
};