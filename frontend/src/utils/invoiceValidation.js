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
  const { valid, amountWei, qtyWei, unitPriceWei, discountWei, taxRateWei } = getLineAmountDetails(item);

  if (!valid) {
    return `${lineLabel} has invalid number format`;
  }

  if (qtyWei < 0n) {
    return `${lineLabel}: quantity cannot be negative`;
  }

  if (unitPriceWei < 0n) {
    return `${lineLabel}: unit price cannot be negative`;
  }

  if (discountWei < 0n) {
    return `${lineLabel}: discount cannot be negative`;
  }

  if (taxRateWei < 0n) {
    return `${lineLabel}: tax cannot be negative`;
  }

  if (amountWei < 0n) {
    return `${lineLabel} amount cannot be negative. Reduce discount or update values`;
  }

  return null;
};

export const validateSingleInvoiceData = ({
  clientAddress,
  itemData,
  totalAmountDue,
  paymentToken,
  ownerAddress,
}) => {
  const addressError = getClientAddressError(clientAddress, {
    required: true,
    ownerAddress,
  });

  if (addressError) {
    return {
      isValid: false,
      errorMessage: addressError,
      fieldErrors: { clientAddress: addressError },
    };
  }

  for (let i = 0; i < itemData.length; i += 1) {
    const itemError = getLineItemError(`Line item ${i + 1}`, itemData[i]);
    if (itemError) {
      return {
        isValid: false,
        errorMessage: itemError,
        fieldErrors: {},
      };
    }
  }

  const totalWei = parseNumericInputToWei(totalAmountDue);
  if (totalWei === null || totalWei <= 0n) {
    return {
      isValid: false,
      errorMessage: "Invoice total must be greater than 0",
      fieldErrors: {},
    };
  }

  const decimalsError = getTokenDecimalsError(totalAmountDue, paymentToken);
  if (decimalsError) {
    return {
      isValid: false,
      errorMessage: decimalsError,
      fieldErrors: {},
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
}) => {
  const normalizedRows = rows.map((row) => ({
    ...row,
    clientAddress: (row.clientAddress || "").trim(),
  }));

  const duplicateTracker = new Map();
  const pendingAddressErrors = {};

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
      return {
        isValid: false,
        errorMessage: `${rowLabel}: ${addressError}`,
        addressErrors: pendingAddressErrors,
        validInvoices: [],
      };
    }

    const normalizedAddress = row.clientAddress.toLowerCase();
    if (duplicateTracker.has(normalizedAddress)) {
      const firstIndex = duplicateTracker.get(normalizedAddress);
      pendingAddressErrors[firstIndex] = "Duplicate wallet address in batch";
      pendingAddressErrors[rowIndex] = "Duplicate wallet address in batch";

      return {
        isValid: false,
        errorMessage: `Duplicate client wallet found in Invoice #${firstIndex + 1} and Invoice #${rowIndex + 1}`,
        addressErrors: pendingAddressErrors,
        validInvoices: [],
      };
    }
    duplicateTracker.set(normalizedAddress, rowIndex);

    for (let itemIndex = 0; itemIndex < row.itemData.length; itemIndex += 1) {
      const itemError = getLineItemError(`${rowLabel}, line item ${itemIndex + 1}`, row.itemData[itemIndex]);
      if (itemError) {
        return {
          isValid: false,
          errorMessage: itemError,
          addressErrors: pendingAddressErrors,
          validInvoices: [],
        };
      }
    }

    const totalWei = parseNumericInputToWei(row.totalAmountDue);
    if (totalWei === null || totalWei <= 0n) {
      return {
        isValid: false,
        errorMessage: `${rowLabel}: invoice total must be greater than 0`,
        addressErrors: pendingAddressErrors,
        validInvoices: [],
      };
    }

    const tokenDecimals = Number(paymentToken?.decimals);
    const decimalsError = getTokenDecimalsError(row.totalAmountDue, paymentToken);
    if (decimalsError) {
      return {
        isValid: false,
        errorMessage: `${rowLabel}: total supports up to ${tokenDecimals} decimals for ${paymentToken?.symbol || "selected token"}`,
        addressErrors: pendingAddressErrors,
        validInvoices: [],
      };
    }
  }

  const validInvoices = normalizedRows.filter(
    (row) => row.clientAddress && parseFloat(row.totalAmountDue) > 0
  );

  if (validInvoices.length === 0) {
    return {
      isValid: false,
      errorMessage: "Please add at least one valid invoice with client address and amount",
      addressErrors: pendingAddressErrors,
      validInvoices: [],
    };
  }

  return {
    isValid: true,
    errorMessage: "",
    addressErrors: {},
    validInvoices,
  };
};