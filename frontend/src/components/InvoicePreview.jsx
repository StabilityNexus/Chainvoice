// Helper to map chainId to human-friendly network name
const CHAIN_ID_TO_NAME = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia Testnet",
  137: "Polygon Mainnet",
  80001: "Polygon Mumbai",
  56: "BNB Smart Chain",
  97: "BSC Testnet",
  8453: "Base Mainnet",
  84531: "Base Goerli",
  534352: "Scroll Mainnet",
  534351: "Scroll Sepolia",
  42161: "Arbitrum One",
  421613: "Arbitrum Goerli",
  10: "Optimism Mainnet",
  420: "Optimism Goerli",
  11155420: "Optimism Sepolia",
  5000: "Mantle Mainnet",
  5001: "Mantle Testnet",
  59144: "Linea Mainnet",
  59140: "Linea Goerli",
  59141: "Linea Sepolia",
  1111: "WEMIX3.0 Testnet",
  1112: "WEMIX3.0 Mainnet",
  // Add more as needed
};

function getNetworkName(chainId) {
  if (!chainId) return "Unknown network";
  const id = Number(chainId);
  return CHAIN_ID_TO_NAME[id] || "Unknown network";
}
import React from "react";
import { ethers } from "ethers";
import { Chip, Typography } from "@mui/material";
import PaidIcon from "@mui/icons-material/CheckCircle";
import UnpaidIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

const InvoicePreview = ({
  invoice,
  fee = 0,
  cancelledMessage = null,
}) => {
  if (!invoice) return null;

  const formatFee = (feeValue) => {
    try {
      return ethers.formatUnits(feeValue);
    } catch {
      return "0";
    }
  };

  const networkFee = formatFee(fee);

  return (
    <div className="flex flex-col h-full">
      <div
        id="invoice-print"
        className="bg-white p-5 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto w-full my-4 sm:my-6"
      >
        {/* Header - Enhanced Layout with Bigger Logo */}
        <div className="border-b-2 border-gray-200 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3.5 rounded-xl border-2 border-gray-200 shadow-lg flex-shrink-0 hover:shadow-xl transition-shadow duration-200">
                <img
                  src="/logo.png"
                  alt="Chainvoice"
                  className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = e.target.parentElement.querySelector(
                      ".logo-fallback"
                    );
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="logo-fallback hidden h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl">
                    CV
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 leading-tight">
                  <span className="text-green-500">Cha</span>
                  <span className="text-gray-600">in</span>
                  <span className="text-green-500">voice</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Powered by Chainvoice
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">
                INVOICE
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 font-semibold mb-2 font-mono">
                #{invoice.id.toString().padStart(6, "0")}
              </p>
              <div>
                {invoice.isCancelled ? (
                  <Chip
                    label="CANCELLED"
                    color="error"
                    size="small"
                    icon={<CancelIcon />}
                    sx={{
                      bgcolor: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                ) : invoice.isPaid ? (
                  <Chip
                    label="PAID"
                    color="success"
                    size="small"
                    icon={<PaidIcon />}
                    sx={{
                      bgcolor: "#dcfce7",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                ) : (
                  <Chip
                    label="UNPAID"
                    color="warning"
                    size="small"
                    icon={<UnpaidIcon />}
                    sx={{
                      bgcolor: "#fef3c7",
                      color: "#d97706",
                      border: "1px solid #fde68a",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cancelled Invoice Alert */}
        {invoice.isCancelled && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-start">
              <CancelIcon
                className="text-red-600 mr-2 mt-0.5"
                fontSize="small"
              />
              <div>
                <Typography
                  variant="subtitle2"
                  className="font-semibold text-red-900 text-sm"
                >
                  Invoice Cancelled
                </Typography>
                <Typography
                  variant="body2"
                  className="text-red-700 mt-0.5 text-xs"
                >
                  {cancelledMessage ||
                    `This invoice was cancelled by ${
                      invoice.user?.fname || "The sender"
                    } ${invoice.user?.lname || ""}. You no longer need to make payment for this invoice.`}
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* From and Bill To Section - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5">
          <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mr-2"></div>
              From
            </h3>
            <p className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
              {invoice.user?.fname || ""} {invoice.user?.lname || ""}
            </p>
            <p className="text-gray-600 text-xs font-mono mb-1 break-all">
              {invoice.user?.address || ""}
            </p>
            <p className="text-gray-700 text-xs mb-2">
              {invoice.user?.city || ""}, {invoice.user?.country || ""},{" "}
              {invoice.user?.postalcode || ""}
            </p>
            <p className="text-gray-600 text-xs flex items-center">
              <span className="mr-1">✉</span>
              {invoice.user?.email || ""}
            </p>
          </div>

          <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mr-2"></div>
              Bill To
            </h3>
            <p className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
              {invoice.client?.fname || ""} {invoice.client?.lname || ""}
            </p>
            <p className="text-gray-600 text-xs font-mono mb-1 break-all">
              {invoice.client?.address || ""}
            </p>
            <p className="text-gray-700 text-xs mb-2">
              {invoice.client?.city || ""}, {invoice.client?.country || ""},{" "}
              {invoice.client?.postalcode || ""}
            </p>
            <p className="text-gray-600 text-xs flex items-center">
              <span className="mr-1">✉</span>
              {invoice.client?.email || ""}
            </p>
          </div>
        </div>

        {/* Payment Currency Section - Compact */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-lg mb-5 border border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
            <CurrencyExchangeIcon
              className="mr-1.5 text-gray-600"
              fontSize="small"
            />
            Payment Currency
          </h3>
          <div className="flex items-center">
            {invoice.paymentToken?.logo ? (
              <div className="bg-white p-1.5 rounded-lg border border-gray-200 mr-3">
                <img
                  src={invoice.paymentToken.logo}
                  alt={invoice.paymentToken.symbol}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                  onError={(e) => {
                    e.target.src = "/tokenImages/generic.png";
                  }}
                />
              </div>
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-gray-200 mr-3 flex items-center justify-center">
                <CurrencyExchangeIcon
                  className="text-gray-500"
                  fontSize="small"
                />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base text-gray-900">
                {invoice.paymentToken?.name || "Ether"}
                <span className="text-gray-600 ml-1.5 font-normal text-xs sm:text-sm">
                  ({invoice.paymentToken?.symbol || "ETH"})
                </span>
              </p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                {invoice.paymentToken?.address
                  ? `${invoice.paymentToken.address.substring(0, 10)}......${invoice.paymentToken.address.substring(33)}`
                  : "Native Currency"}
              </p>
              {invoice.paymentToken?.address && (
                <div className="mt-1.5 flex flex-wrap gap-2 sm:gap-3 text-xs text-gray-600">
                  <span>
                    <strong className="text-gray-700">Decimals:</strong>{" "}
                    {invoice.paymentToken.decimals || 18}
                  </span>
                  <span>
                    <strong className="text-gray-700">Chain:</strong>{" "}
                    {getNetworkName(
                      invoice.paymentToken?.chainId || invoice.chainId
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dates Section - Compact */}
        <div className="mb-5 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 mr-2 min-w-[50px]">
                Issued:
              </span>
              <span className="text-gray-600">
                {new Date(invoice.issueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC", // Fix: Forces the date to render in absolute UTC
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 mr-2 min-w-[50px]">
                Due:
              </span>
              <span className="text-gray-600">
                {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC", // Fix: Forces the date to render in absolute UTC
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table - Production Ready with Perfect Alignment */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-5">
          <div className="overflow-x-auto">
            <table
              className="w-full min-w-[700px]"
              style={{ tableLayout: "fixed", borderCollapse: "collapse" }}
            >
              <colgroup>
                <col style={{ width: "35%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {invoice.items?.map((item, index) => {
                  // Check if unitPrice already ends with the symbol (with optional whitespace)
                  const unitPriceStr = String(item.unitPrice || "");
                  const symbol = invoice.paymentToken?.symbol || "";
                  let unitPriceDisplay = unitPriceStr;
                  if (symbol) {
                    const trimmed = unitPriceStr.trim();
                    const regex = new RegExp(`\\s*${symbol.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`);
                    if (!regex.test(trimmed)) {
                      unitPriceDisplay = `${trimmed} ${symbol}`;
                    } else {
                      unitPriceDisplay = unitPriceStr;
                    }
                  }

                  return (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-right text-gray-700">
                        {item.qty}
                      </td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-right text-gray-700 whitespace-nowrap">
                        {unitPriceDisplay}
                      </td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-right text-gray-700 whitespace-nowrap">
                        {item.discount || "0"}
                      </td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-right text-gray-700 whitespace-nowrap">
                        {item.tax || "0%"}
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-semibold text-right text-gray-900 whitespace-nowrap">
                        {item.amount} {invoice.paymentToken?.symbol}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section - Compact */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-1">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Subtotal:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {invoice.amountDue} {invoice.paymentToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Network Fee:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {networkFee} ETH
              </span>
            </div>
            <div className="border-t-2 border-gray-300 pt-2 mt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  {invoice.paymentToken?.symbol === "ETH"
                    ? (() => {
                        // Normalize and validate numeric inputs
                        let amountDueNum = 0;
                        let networkFeeNum = 0;
                        if (invoice.amountDue !== undefined && invoice.amountDue !== null && !isNaN(Number(invoice.amountDue))) {
                          amountDueNum = Number(invoice.amountDue);
                        }
                        if (networkFee !== undefined && networkFee !== null && !isNaN(Number(networkFee))) {
                          networkFeeNum = Number(networkFee);
                        }
                        const total = amountDueNum + networkFeeNum;
                        return `${total.toFixed(6)} ETH`;
                      })()
                    : `${invoice.amountDue} ${invoice.paymentToken?.symbol} + ${networkFee} ETH`}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoicePreview;

