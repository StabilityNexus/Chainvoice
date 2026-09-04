import { ethers } from "ethers";
import { getLineAmountDetails, parseNumericInputToWei } from "./invoiceCalculations";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Required-text check shared by the invoice forms and the saved user profile,
 * so a value accepted in Settings is never rejected at invoice submit time.
 */
export const getRequiredTextError = (value, label) =>
  String(value ?? "").trim() ? "" : `${label} is required`;

/**
 * Email check shared by the same callers as getRequiredTextError.
 */
export const getEmailError = (value) => {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "Email is required";
  return EMAIL_PATTERN.test(trimmed) ? "" : "Invalid email address";
};

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
  
  const HUNDRED_PERCENT_WEI = 100000000000000000000n; // 100 * 10^18

  if (discountWei < 0n) {
    errors.discount = "Cannot be negative";
  } else if (item.discountType === "percentage" && discountWei > HUNDRED_PERCENT_WEI) {
    errors.discount = "Cannot exceed 100%";
  }
  
  if (taxRateWei < 0n) {
    errors.tax = "Cannot be negative";
  } else if (item.taxType === "percentage" && taxRateWei > HUNDRED_PERCENT_WEI) {
    errors.tax = "Cannot exceed 100%";
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
  
  const partyErrors = {
    userFname: getRequiredTextError(userFname, "First name"),
    userEmail: getEmailError(userEmail),
    clientFname: getRequiredTextError(clientFname, "First name"),
    clientEmail: getEmailError(clientEmail),
  };

  for (const [field, error] of Object.entries(partyErrors)) {
    if (error) {
      fieldErrors[field] = error;
      hasFieldErrors = true;
    }
  }

  let hasItemErrors = false;
  const itemErrorsObj = {};
  
  const isItemBlank = (item) => {
    return !item.description && !item.qty && !item.unitPrice && !item.discount && !item.tax;
  };

  for (let i = 0; i < itemData.length; i += 1) {
    if (itemData.length > 1 && isItemBlank(itemData[i])) {
      continue;
    }
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
  
  const userInfoErrors = {
    userFname: getRequiredTextError(userInfo?.userFname, "First name"),
    userEmail: getEmailError(userInfo?.userEmail),
  };

  for (const [field, error] of Object.entries(userInfoErrors)) {
    if (error) {
      pendingFieldErrors[field] = error;
      globalHasErrors = true;
    }
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
    
    const rowClientErrors = {
      clientFname: getRequiredTextError(row.clientFname, "First name"),
      clientEmail: getEmailError(row.clientEmail),
    };

    for (const [field, error] of Object.entries(rowClientErrors)) {
      if (error) {
        pendingFieldErrors[`${rowIndex}_${field}`] = error;
        globalHasErrors = true;
      }
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

    const isItemBlank = (item) => {
      return !item.description && !item.qty && !item.unitPrice && !item.discount && !item.tax;
    };

    for (let itemIndex = 0; itemIndex < row.itemData.length; itemIndex += 1) {
      if (row.itemData.length > 1 && isItemBlank(row.itemData[itemIndex])) {
        continue;
      }
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