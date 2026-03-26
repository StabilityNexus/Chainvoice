import { ethers } from "ethers";

export const resolveInvoicePaymentContext = (invoice, network) => {
  // If no payment token is set, it's a native currency payment
  const isNativePayment = !invoice.paymentToken || !invoice.paymentToken.address;
  
  // Use Wagmi network info to get correct native token symbol, name, and decimals
  // wagmi chain object typically has nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 }
  const nativeSymbol = network?.nativeCurrency?.symbol || "ETH";
  const nativeDecimals = network?.nativeCurrency?.decimals || 18;
  const nativeName = network?.nativeCurrency?.name || "Ether";

  // Use provided token info, or default to the native chain info
  const tokenName = invoice.paymentToken?.name || nativeName;
  const tokenSymbol = invoice.paymentToken?.symbol || nativeSymbol;
  const tokenDecimals = invoice.paymentToken?.decimals || nativeDecimals;

  return {
    nativeSymbol,
    nativeDecimals,
    isNativePayment,
    tokenName,
    tokenSymbol,
    tokenDecimals,
  };
};

export const formatNetworkFeeValue = (fee, nativeDecimals) => {
  try {
    return ethers.formatUnits(fee || "0", nativeDecimals || 18);
  } catch {
    return "0.0";
  }
};

export const buildInvoiceTotalText = ({
  isNativePayment,
  amountDue,
  tokenSymbol,
  tokenDecimals,
  fee,
  networkFee,
  nativeSymbol,
}) => {
  // If payment is in native currency, sum up the amount due and network fee safely using BigInt
  if (isNativePayment) {
    let amountDueWei, networkFeeWei;
    
    try {
      amountDueWei = ethers.parseUnits(amountDue || "0", tokenDecimals || 18);
    } catch {
      amountDueWei = 0n;
    }

    try {
      networkFeeWei = BigInt(fee || "0");
    } catch {
      networkFeeWei = 0n;
    }

    const totalWei = amountDueWei + networkFeeWei;
    const totalAmount = ethers.formatUnits(totalWei, tokenDecimals || 18);
    
    // Using .toFixed(6) to prevent extremely long decimals
    return `${Number(totalAmount).toFixed(6)} ${nativeSymbol}`;
  }

  // If ERC20 payment, show token amount + network fee in native token
  return `${amountDue || "0"} ${tokenSymbol} + ${networkFee} ${nativeSymbol}`;
};
