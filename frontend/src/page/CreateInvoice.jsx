import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  BrowserProvider,
  Contract,
  ethers,
  formatUnits,
  JsonRpcProvider,
} from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { ChainvoiceABI } from "../contractsABI/ChainvoiceABI";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Badge,
  CalendarIcon,
  CheckCircle2,
  Coins,
  Loader2,
  PlusIcon,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "../components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";


import TokenIntegrationRequest from "@/components/TokenIntegrationRequest";
import { ERC20_ABI } from "@/contractsABI/ERC20_ABI";

import WalletConnectionAlert from "../components/WalletConnectionAlert";
import TokenPicker, { ToggleSwitch } from "@/components/TokenPicker";
import { CopyButton } from "@/components/ui/copyButton";
import CountryPicker from "@/components/CountryPicker";
import { useTokenList } from "@/hooks/useTokenList";
import {
  getLineAmountDetails,
  getSafeLineAmountDisplay,
  INVOICE_DECIMALS,
} from "@/utils/invoiceCalculations";
import {
  getClientAddressError,
  validateSingleInvoiceData,
} from "@/utils/invoiceValidation";
import toast from "react-hot-toast";
import { storeInvoice } from "../services/invoiceStorage/invoiceDB.js";
import { computeInvoiceHash } from "../services/relay/invoiceHashUtils.js";
import { sendEncryptedInvoice } from "../services/relay/relayInvoiceMessaging.js";
import { fetchPublicKeyFromChain } from "../services/relay/relayKeyManager.js";


import { AmountTypeToggle } from "../components/AmountTypeToggle";
import ProductAutocompleteInput from "@/components/ProductAutocompleteInput";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import {
  applyProductToInvoiceItem,
  createEmptyInvoiceItem,
} from "@/utils/productCatalogInvoiceHelpers";

/** Public RPC URLs by chain ID for token verification when visitor has no wallet (e.g. opening invoice request link in incognito). */
const CHAIN_ID_TO_PUBLIC_RPC = {
  1: "https://eth.llamarpc.com",
  61: "https://etc.blockscout.com",
  137: "https://polygon-rpc.com",
  56: "https://bsc-dataseed.binance.org",
  8453: "https://mainnet.base.org",
  11155111: "https://rpc.ankr.com/eth_sepolia",
  5115: "https://rpc.testnet.citrea.xyz",
};

function CreateInvoice() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const account = useAccount();
  const [searchParams] = useSearchParams();
  const urlChainParam = searchParams.get("chain");
  const chainIdForTokens =
    urlChainParam && !Number.isNaN(parseInt(urlChainParam, 10))
      ? parseInt(urlChainParam, 10)
      : account?.chainId ?? 1;
  const { tokens, loading: loadingTokens, error: tokenListError } = useTokenList(chainIdForTokens);
  const [dueDate, setDueDate] = useState(new Date());
  const [issueDate] = useState(() => new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const itemRefsMobile = useRef([]);
  const itemRefsDesktop = useRef([]);
  const [clientAddress, setClientAddress] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [clientCountry, setClientCountry] = useState("");

  // Token selection state
  const [selectedToken, setSelectedToken] = useState(null);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);

  const [tokenVerificationState, setTokenVerificationState] = useState("idle");
  const [verifiedToken, setVerifiedToken] = useState(null);

  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);
  // Holds inline validation error for client wallet address
// Used instead of browser alerts for better, non blocking UX
  const [clientAddressError, setClientAddressError] = useState("");
  const [totalAmountError, setTotalAmountError] = useState("");
  const [itemErrors, setItemErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  // const TESTNET_TOKEN = ["0xB5E9C6e57C9d312937A059089B547d0036c155C7"]; //sepolia based chainvoice test token (CIN)

  const [itemData, setItemData] = useState([createEmptyInvoiceItem()]);

  const { catalogMetadata } = useProductCatalog();

  const handleProductSelect = useCallback((product, index) => {
    setItemData((prevItemData) => {
      const newData = prevItemData.map((item, i) => {
        if (i === index) {
          return applyProductToInvoiceItem(item, product);
        }
        return item;
      });

      if (index === prevItemData.length - 1) {
        newData.push(createEmptyInvoiceItem());
      }

      return newData;
    });

    setTimeout(() => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      const nextInput = isDesktop
        ? itemRefsDesktop.current[index + 1]
        : itemRefsMobile.current[index + 1];
      nextInput?.focus();
    }, 50);
  }, []);

  const [totalAmountDue, setTotalAmountDue] = useState(0);

  /**
   * Fetches ERC-20 token symbol, name, and decimals.
   * When chainIdForRpc is provided (e.g. from invoice link URL), uses public RPC so it works without a connected wallet.
   */
  const verifyToken = useCallback(async (address, chainIdForRpc) => {
    setTokenVerificationState("verifying");
    setVerifiedToken(null);

    try {
      let provider;
      const rpcUrl = chainIdForRpc && CHAIN_ID_TO_PUBLIC_RPC[chainIdForRpc];
      if (rpcUrl) {
        provider = new JsonRpcProvider(rpcUrl);
      } else if (typeof window !== "undefined" && window.ethereum) {
        provider = new BrowserProvider(window.ethereum);
      } else {
        console.error("No Ethereum provider found");
        setTokenVerificationState("error");
        return;
      }

      const contract = new ethers.Contract(address, ERC20_ABI, provider);
      const [symbol, name, decimals] = await Promise.all([
        contract.symbol().catch(() => "UNKNOWN"),
        contract.name().catch(() => "Unknown Token"),
        contract.decimals().catch(() => 18),
      ]);

      const symbolStr = typeof symbol === "string" ? symbol.trim() : "";
      if (!symbolStr || symbolStr === "UNKNOWN") {
        setTokenVerificationState("error");
        return;
      }
      setVerifiedToken({ address, symbol: symbolStr, name, decimals });
      setTokenVerificationState("success");
    } catch (error) {
      console.error("Verification failed:", error);
      setTokenVerificationState("error");
    }
  }, []);

  const resolveTokenDecimals = useCallback(
    async (tokenAddress, fallbackDecimals) => {
      if (
        fallbackDecimals !== undefined &&
        fallbackDecimals !== null &&
        !Number.isNaN(Number(fallbackDecimals))
      ) {
        return Number(fallbackDecimals);
      }

      try {
        let provider;
        const rpcUrl =
          chainIdForTokens && CHAIN_ID_TO_PUBLIC_RPC[Number(chainIdForTokens)];

        if (rpcUrl) {
          provider = new JsonRpcProvider(rpcUrl);
        } else if (typeof window !== "undefined" && window.ethereum) {
          provider = new BrowserProvider(window.ethereum);
        } else {
          return null;
        }

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const decimals = await contract.decimals();
        return Number(decimals);
      } catch (error) {
        console.warn("Failed to resolve token decimals:", error);
        return null;
      }
    },
    [chainIdForTokens]
  );

   
  useEffect(() => {
    const urlClientAddress = searchParams.get("clientAddress");
    const urlTokenAddress = searchParams.get("tokenAddress");
    const isCustomFromURL = searchParams.get("customToken") === "true";
    const urlAmount = searchParams.get("amount");
    const urlDescription = searchParams.get("description");

    if (urlClientAddress) {
      setClientAddress(urlClientAddress);
      validateClientAddress(urlClientAddress);
    }

    if (urlDescription || urlAmount) {
      setItemData((prev) => {
        const first = prev[0] ?? {
          ...createEmptyInvoiceItem(),
        };
        const isFirstLineEmpty = !first.description && !first.unitPrice;
        if (!isFirstLineEmpty) return prev;
        const updatedFirst = {
          ...first,
          ...(urlDescription && { description: urlDescription }),
          ...(urlAmount && { qty: "1", unitPrice: urlAmount }),
        };
        updatedFirst.amount = getSafeLineAmountDisplay(updatedFirst);
        return [updatedFirst, ...prev.slice(1)];
      });
    }

    const processUrlToken = async () => {
      if (urlTokenAddress && !loadingTokens) {
        if (isCustomFromURL) {
          setUseCustomToken(true);
          setCustomTokenAddress(urlTokenAddress);
          verifyToken(urlTokenAddress, chainIdForTokens);
        } else {
          const preselectedToken = tokens.find(
            (token) =>
              (token.contract_address || token.address).toLowerCase() === urlTokenAddress.toLowerCase()
          );

          if (preselectedToken) {
            let decimals = preselectedToken.decimals;

            // If decimals are missing/null, try to fetch them from chain
            if (decimals === undefined || decimals === null) {
              try {
                if (typeof window !== "undefined" && window.ethereum) {
                  const provider = new BrowserProvider(window.ethereum);
                  const contract = new ethers.Contract(urlTokenAddress, ERC20_ABI, provider);
                  decimals = await contract.decimals();
                }
              } catch (err) {
                console.warn("Failed to fetch decimals for preselected token:", err);
              }
            }

            // If we successfully resolved decimals (from list or chain)
            if (decimals !== undefined && decimals !== null) {
              setSelectedToken({
                address: preselectedToken.contract_address || preselectedToken.address,
                symbol: preselectedToken.symbol,
                name: preselectedToken.name,
                logo: preselectedToken.image,
                decimals: Number(decimals) 
              });
              setUseCustomToken(false);
            } else {
              // Fallback to manual verification when decimals cannot be determined from list or wallet
              setUseCustomToken(true);
              setCustomTokenAddress(urlTokenAddress);
              verifyToken(urlTokenAddress, chainIdForTokens);
            }
          } else {
            // Not in list: fetch token info via public RPC (works without wallet) or wallet
            setUseCustomToken(true);
            setCustomTokenAddress(urlTokenAddress);
            verifyToken(urlTokenAddress, chainIdForTokens);
          }
        }
      }
    };

    processUrlToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, tokens, loadingTokens, account.address, chainIdForTokens, verifyToken]);

  useEffect(() => {
    const total = itemData.reduce((sum, item) => {
      const { valid, amountWei } = getLineAmountDetails(item);
      if (!valid || amountWei < 0n) return sum;
      return sum + amountWei;
    }, 0n);

    setTotalAmountDue(formatUnits(total, INVOICE_DECIMALS));
  }, [itemData]);


  useEffect(() => {
    setShowWalletAlert(!isConnected);
  }, [isConnected]);

  const handleItemData = (e, index) => {
    const { name, value } = e.target;

    if (["qty", "unitPrice", "discount", "tax"].includes(name) && value !== "") {
      if (/[^0-9.]/.test(value)) return;
      const parts = value.split(".");
      if (parts.length > 2) return;
      
      const numValue = parseFloat(value);
      if (
        (name === "discount" && itemData[index]?.discountType === "percentage" && (numValue < 0 || numValue > 100)) ||
        (name === "tax" && itemData[index]?.taxType === "percentage" && (numValue < 0 || numValue > 100))
      ) {
        return;
      }
    }

    setItemData((prevItemData) =>
      prevItemData.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [name]: value };
          if (
            name === "qty" ||
            name === "unitPrice" ||
            name === "discount" ||
            name === "tax"
          ) {
            updatedItem.amount = getSafeLineAmountDisplay(updatedItem);
          }
          return updatedItem;
        }
        return item;
      })
    );

    setItemErrors((prev) => {
      if (prev[index] && prev[index][name]) {
        const newErrors = [...prev];
        const rowErrors = { ...newErrors[index] };
        delete rowErrors[name];
        newErrors[index] = rowErrors;
        return newErrors;
      }
      return prev;
    });
  };

  const addItem = () => {
    setItemData((prev) => [...prev, createEmptyInvoiceItem()]);
  };

  const handleFieldChange = (e) => {
    const { name } = e.target;
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    let error = "";
    if (name === "userFname" || name === "clientFname") {
      if (!value.trim()) error = "First name is required";
    } else if (name === "userEmail" || name === "clientEmail") {
      if (!value.trim()) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
    }
    
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };
  const validateClientAddress = useCallback((value, options = {}) => {
    const error = getClientAddressError(value, {
      ...options,
      ownerAddress: account.address,
    });
    setClientAddressError(error);
    return !error;
  }, [account.address]);

  const validateInvoiceBeforeSubmit = useCallback((data, paymentToken) => {
    const validation = validateSingleInvoiceData({
      clientAddress: data.clientAddress,
      itemData,
      totalAmountDue,
      paymentToken,
      ownerAddress: account.address,
      userFname: data.userFname,
      userEmail: data.userEmail,
      clientFname: data.clientFname,
      clientEmail: data.clientEmail,
    });

    if (!validation.isValid) {
      if (validation.fieldErrors.clientAddress) {
        setClientAddressError(validation.fieldErrors.clientAddress);
      } else {
        setClientAddressError("");
      }

      if (validation.fieldErrors.totalAmountDue) {
        setTotalAmountError(validation.fieldErrors.totalAmountDue);
      } else {
        setTotalAmountError("");
      }

      const newItemErrors = [];
      const newFieldErrors = {};
      Object.keys(validation.fieldErrors).forEach(key => {
        if (key.startsWith("item_")) {
           const idx = parseInt(key.split("_")[1]);
           newItemErrors[idx] = validation.fieldErrors[key];
        } else {
           newFieldErrors[key] = validation.fieldErrors[key];
        }
      });
      setItemErrors(newItemErrors);
      setFieldErrors(newFieldErrors);

      toast.error(validation.errorMessage || "Please fix the required fields");
      return false;
    }

    setTotalAmountError("");
    setItemErrors([]);
    setFieldErrors({});

    return true;
  }, [account.address, itemData, totalAmountDue]);

  const createInvoiceRequest = async (data) => {
    if (!isConnected || !walletClient) {
      toast.error("Please connect your wallet");
      return;
    }

    const paymentToken = useCustomToken ? verifiedToken : selectedToken;
    if (!paymentToken?.address) {
      toast.error("Please select or verify a payment token.");
      return;
    }

    const tokenDecimals = Number(paymentToken?.decimals);
    if (!Number.isInteger(tokenDecimals) || tokenDecimals < 0) {
      toast.error("Selected token has invalid decimals");
      return;
    }

    const normalizedData = {
      ...data,
      clientAddress: (data.clientAddress || "").trim(),
    };

    if (!validateInvoiceBeforeSubmit(normalizedData, paymentToken)) {
      return;
    }

    setClientAddressError("");
    try {
      setLoading(true);
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const invoicePayload = {
        amountDue: totalAmountDue.toString(),
        dueDate,
        issueDate,
        paymentToken: {
          address: paymentToken.address,
          symbol: paymentToken.symbol,
          decimals: Number(paymentToken.decimals),
        },
        user: {
          address: account?.address.toString(),
          fname: data.userFname,
          lname: data.userLname,
          email: data.userEmail,
          country: data.userCountry,
          city: data.userCity,
          postalcode: data.userPostalcode,
        },
        client: {
          address: normalizedData.clientAddress,
          fname: normalizedData.clientFname,
          lname: normalizedData.clientLname,
          email: normalizedData.clientEmail,
          country: normalizedData.clientCountry,
          city: normalizedData.clientCity,
          postalcode: normalizedData.clientPostalcode,
        },
        items: itemData.map((item) => ({
          ...item,
          amount: getSafeLineAmountDisplay(item),
        })),
      };

      // Only a commitment to the invoice goes on-chain. The payload itself
      // reaches the client encrypted over the relay, and they recompute this
      // hash to prove it arrived untampered.
      const invoiceDataHash = computeInvoiceHash(invoicePayload);

      if (!account?.chainId) {
        throw new Error("Missing chainId: wallet connected but chain not configured");
      }

      const contractAddress = import.meta.env[
        `VITE_CONTRACT_ADDRESS_${account.chainId}`
      ];

      if (!contractAddress) {
        throw new Error("Unsupported network or contract address missing");
      }

      const contract = new Contract(contractAddress, ChainvoiceABI, signer);

      const tx = await contract.createInvoice(
        normalizedData.clientAddress,
        ethers.parseUnits(totalAmountDue.toString(), tokenDecimals),
        paymentToken.address,
        invoiceDataHash
      );

      const receipt = await tx.wait();

      const iface = new ethers.Interface(ChainvoiceABI);
      let invoiceId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === 'InvoiceCreated') {
            invoiceId = parsed.args[0].toString();
            break;
          }
        } catch {
          // ignore
        }
      }

      let relayDelivered = false;
      if (invoiceId) {
        // Delivery is best-effort: the invoice already exists on-chain, and
        // the client can still be sent the payload later.
        try {
          const receiverPublicKey = await fetchPublicKeyFromChain(
            contract,
            normalizedData.clientAddress
          );
          if (receiverPublicKey) {
            await sendEncryptedInvoice({
              invoiceData: invoicePayload,
              receiverPublicKey,
              receiverAddress: normalizedData.clientAddress,
              senderAddress: account.address,
              chainId: account.chainId,
              invoiceId,
            });
            relayDelivered = true;
          } else {
            toast(
              "Invoice created. Your client has not registered a messaging key yet, so they will only see the on-chain summary until they do.",
              { icon: "ℹ️" }
            );
          }
        } catch (relayErr) {
          console.warn(
            `Relay delivery for invoice ${invoiceId} failed (non-critical):`,
            relayErr
          );
          toast(
            "Invoice created on-chain, but delivering the encrypted details to your client failed. You can resend from Sent Invoices.",
            { icon: "⚠️" }
          );
        }

        try {
          await storeInvoice({
            invoiceId,
            chainId: account.chainId,
            from: account.address.toLowerCase(),
            to: data.clientAddress.toLowerCase(),
            isPaid: false,
            isCancelled: false,
            relayDelivered,
            invoiceDataHash,
            data: invoicePayload,
          });
        } catch (storageErr) {
          console.error("Invoice created, but local persistence failed:", storageErr);
          toast.error(
            "Invoice was created on-chain, but could not be saved locally. Please do not leave this page until you back up the invoice details."
          );
          return;
        }
      } else {
        console.warn("InvoiceCreated event not found in transaction logs");
        toast.error(
          "Invoice was created on-chain, but could not be detected in the transaction. Please check your Sent Invoices page."
        );
      }

      setTimeout(() => navigate("/dashboard/sent"), 4000);
    } catch (err) {
      // Declining in the wallet is a deliberate choice, not a failure — saying
      // "Failed to create invoice" sends people hunting for a bug that is not
      // there. MetaMask surfaces this as 4001, ethers as ACTION_REJECTED.
      if (err?.code === "ACTION_REJECTED" || err?.code === 4001) {
        toast("Transaction cancelled in your wallet.", { icon: "✋" });
        return;
      }
      console.error("Invoice creation failed:", err);
      toast.error("Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      userAddress: formData.get("userAddress"),
      userFname: formData.get("userFname"),
      userLname: formData.get("userLname"),
      userEmail: formData.get("userEmail"),
      userCountry: userCountry || formData.get("userCountry") || "",
      userCity: formData.get("userCity"),
      userPostalcode: formData.get("userPostalcode"),
      clientAddress: formData.get("clientAddress"),
      clientFname: formData.get("clientFname"),
      clientLname: formData.get("clientLname"),
      clientEmail: formData.get("clientEmail"),
      clientCountry: clientCountry || formData.get("clientCountry") || "",
      clientCity: formData.get("clientCity"),
      clientPostalcode: formData.get("clientPostalcode"),
      itemData,
    };
    await createInvoiceRequest(data);
  };

  return (
    <>
      <div className="flex justify-center px-2 sm:px-4">
        <WalletConnectionAlert
          show={showWalletAlert}
          message="Connect your wallet to create and manage invoices"
          onDismiss={() => setShowWalletAlert(false)}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        {(searchParams.get("clientAddress") ||
          searchParams.get("amount") ||
          searchParams.get("description")) && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 overflow-hidden">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Form Pre-filled from Link
                </p>
                <p className="text-xs text-green-600">
                  Some fields have been automatically filled based on the shared
                  link. You can modify them if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
          Create New Invoice
        </h2>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 bg-gray-50 p-4 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Label className="text-sm sm:text-md font-medium text-gray-700">
              Invoice #
            </Label>
            <Input
              value="1"
              className="w-24 bg-gray-100 border-gray-300 text-gray-700"
              disabled
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Label className="text-sm sm:text-md font-medium text-gray-700">
              Issued Date
            </Label>
            <Button
              className={cn(
                "w-full sm:w-[220px] justify-start text-left font-normal bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
                !issueDate && "text-black"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(issueDate, "PPP")}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Label className="text-sm sm:text-md font-medium text-gray-700">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[220px] justify-start text-left font-normal text-gray-700",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    format(dueDate, "PPP")
                  ) : (
                    <span className="text-gray-700">Pick a due date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    if (date) {
                      setDueDate(date);
                      document.dispatchEvent(
                        new KeyboardEvent("keydown", { key: "Escape" })
                      );
                    }
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-full border border-gray-200 flex-1 p-4 sm:p-6 rounded-lg shadow-sm bg-white overflow-hidden">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                From (Your Information)
              </h3>
              <Input
                value={account?.address}
                className="w-full mb-4 bg-gray-50 border-gray-300 text-gray-500 text-xs sm:text-sm font-mono"
                readOnly
                name="userAddress"
              />

              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Your First Name"
                      className={`w-full mt-1 border-gray-300 text-black ${fieldErrors.userFname ? "border-red-500" : ""}`}
                      name="userFname"
                      onChange={handleFieldChange}
                      onBlur={handleFieldBlur}
                    />
                    {fieldErrors.userFname && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{fieldErrors.userFname}</span></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Your Last Name"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="userLname"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      className={`w-full mt-1 border-gray-300 text-black ${fieldErrors.userEmail ? "border-red-500" : ""}`}
                      name="userEmail"
                      onChange={handleFieldChange}
                      onBlur={handleFieldBlur}
                    />
                    {fieldErrors.userEmail && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{fieldErrors.userEmail}</span></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Country
                    </Label>
                    <div className="mt-1">
                      <CountryPicker
                        value={userCountry}
                        onChange={setUserCountry}
                        placeholder="Select country"
                        className="w-full border-gray-300 text-black"
                        disabled={loading}
                      />
                      <input
                        type="hidden"
                        name="userCountry"
                        value={userCountry}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      type="text"
                      placeholder="City"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="userCity"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Postal Code
                    </Label>
                    <Input
                      type="text"
                      placeholder="Postal Code"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="userPostalcode"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Client Information */}
            <div className="border border-gray-200 flex-1 p-6 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Client Information
              </h3>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Client Wallet Address <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Client Wallet Address"
                className={`w-full mb-4 border-gray-300 text-black ${clientAddressError ? "border-red-500" : ""}`}
                name="clientAddress"
                value={clientAddress}
                onChange={(e) => {const value = e.target.value;
                         setClientAddress(value);
                      validateClientAddress(value);
                     }}
                     onBlur={(e) => {
    validateClientAddress(e.target.value);
  }}
              />
              {clientAddressError && (
                 <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                        <span>{clientAddressError}</span>
                            </div>
                               )}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Client First Name"
                      className={`w-full mt-1 border-gray-300 text-black ${fieldErrors.clientFname ? "border-red-500" : ""}`}
                      name="clientFname"
                      onChange={handleFieldChange}
                      onBlur={handleFieldBlur}
                    />
                    {fieldErrors.clientFname && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{fieldErrors.clientFname}</span></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Client Last Name"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="clientLname"
                    />
                  </div>
                </div>


                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="Client Email"
                      className={`w-full mt-1 border-gray-300 text-black ${fieldErrors.clientEmail ? "border-red-500" : ""}`}
                      name="clientEmail"
                      onChange={handleFieldChange}
                      onBlur={handleFieldBlur}
                    />
                    {fieldErrors.clientEmail && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{fieldErrors.clientEmail}</span></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Country
                    </Label>
                    <div className="mt-1">
                      <CountryPicker
                        value={clientCountry}
                        onChange={setClientCountry}
                        placeholder="Select country"
                        className="w-full border-gray-300 text-black"
                        disabled={loading}
                      />
                      <input
                        type="hidden"
                        name="clientCountry"
                        value={clientCountry}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      type="text"
                      placeholder="City"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="clientCity"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Postal Code
                    </Label>
                    <Input
                      type="text"
                      placeholder="Postal Code"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="clientPostalcode"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <circle cx="8" cy="8" r="6"></circle>
                <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                <path d="M7 6h1v4"></path>
                <path d="m16.71 13.88.7.71-2.82 2.82"></path>
              </svg>
              Payment Currency
            </h3>

            <div className="space-y-4">
              {/* Toggle Switch */}
              <ToggleSwitch
                enabled={useCustomToken}
                onChange={setUseCustomToken}
                leftLabel="Select Token"
                rightLabel="Input Custom Token"
              />

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-auto flex-1">
                  {!useCustomToken ? (
                    <>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose from Available Tokens
                      </Label>
                      {tokenListError && (
                        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>{tokenListError}. Using local fallback or custom input recommended.</span>
                        </div>
                      )}
                      <TokenPicker
                        selected={selectedToken}
                        onSelect={async (token) => {
                          const address = token.contract_address || token.address;
                          const decimals = await resolveTokenDecimals(
                            address,
                            token.decimals
                          );

                          if (decimals === null) {
                            toast.error(
                              "Failed to fetch token decimals for selected token"
                            );
                            return false;
                          }

                          setSelectedToken({
                            address,
                            symbol: token.symbol,
                            name: token.name,
                            logo: token.image,
                            decimals,
                          });

                          return true;
                        }}
                        chainId={chainIdForTokens}
                        disabled={loading}
                        className="w-full"
                        allowCustom={false} // Remove custom token option from picker since we have toggle
                      />
                    </>
                  ) : (
                    <>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Token Contract Address
                      </Label>

                      {/* Custom Token Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Coins className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">
                              Custom Token Setup
                            </h4>
                            <p className="text-sm text-blue-700 mb-2">
                              Enter the contract address of the ERC-20 token you
                              want to use for payments.
                            </p>
                            <ul className="text-xs text-blue-600 space-y-1">
                              <li>
                                • Make sure the token contract is deployed and
                                verified
                              </li>
                              <li>
                                • Address should start with &quot;0x&quot; followed by 40
                                characters
                              </li>
                              <li>
                                • Token will be verified automatically after
                                entering
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <Input
                        placeholder="0x... (Enter token contract address)"
                        value={customTokenAddress}
                        onChange={(e) => {
                          const address = e.target.value;
                          setCustomTokenAddress(address);
                          if (!address || !ethers.isAddress(address)) {
                            setTokenVerificationState("idle");
                            setVerifiedToken(null);
                          } else if (ethers.isAddress(address)) {
                            verifyToken(address);
                          }
                        }}
                        className="h-12 bg-gray-50 text-gray-700 border-gray-200"
                        disabled={loading}
                      />

                      {tokenVerificationState === "verifying" && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg border border-yellow-200 mt-3">
                          <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                          <span className="text-yellow-700">
                            Verifying token contract...
                          </span>
                        </div>
                      )}

                      {tokenVerificationState === "success" &&
                        verifiedToken && (
                          <div className="mt-3">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-medium text-green-800">
                                      {verifiedToken.name} (
                                      {verifiedToken.symbol})
                                    </p>
                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                      Verified ✓
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm text-green-600 font-mono">
                                      {verifiedToken.address}
                                    </span>
                                    <CopyButton
                                      textToCopy={verifiedToken.address}
                                    />
                                  </div>
                                  <p className="text-xs text-green-600">
                                    Decimals: {String(verifiedToken.decimals)} •
                                    Contract verified and ready to use
                                  </p>
                                </div>
                              </div>
                            </div>
                            <TokenIntegrationRequest
                              address={customTokenAddress}
                            />
                          </div>
                        )}

                      {tokenVerificationState === "error" && (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 mt-3">
                          <div className="flex items-center gap-3">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="text-sm text-red-600 font-medium">
                                Token verification failed
                              </p>
                              <p className="text-xs text-red-500 mt-1">
                                Please check the contract address and try again.
                                Make sure it&apos;s a valid ERC-20 token.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {useCustomToken ? (
                    verifiedToken ? (
                      <>
                        <span className="font-medium text-gray-700">Note:</span>{" "}
                        Your client will need to have sufficient balance of the
                        chosen token to be able to pay your invoice.
                      </>
                    ) : customTokenAddress ? (
                      <>
                        <span className="font-medium text-gray-700">Note:</span>{" "}
                        Please wait for token verification to complete before
                        proceeding.
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-gray-700">Note:</span>{" "}
                        Enter a valid ERC-20 token contract address above to
                        proceed.
                      </>
                    )
                  ) : selectedToken ? (
                    <>
                      <span className="font-medium text-gray-700">Note:</span>{" "}
                      Your client will need to have sufficient balance of{" "}
                      <strong>{selectedToken.symbol}</strong> to be able to pay
                      your invoice.
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-gray-700">Note:</span>{" "}
                      Please select a payment token to continue with invoice
                      creation.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>


          {/* Invoice Items Section */}
          <div className="mb-6 sm:mb-8">
            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden md:grid bg-green-500 text-white py-3 px-4 rounded-t-lg font-medium text-sm gap-2 items-center" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
              <div className="col-span-4">DESCRIPTION</div>
              <div className="col-span-1">QTY</div>
              <div className="col-span-2">UNIT PRICE</div>
              <div className="col-span-3">
                <div className="flex flex-row gap-1 items-center whitespace-nowrap">
                  DISCOUNT
                  <AmountTypeToggle
                    value={itemData[0]?.discountType || "amount"}
                    onChange={(newType) => {
                      setItemData((prev) =>
                        prev.map((item) => {
                          const updated = { ...item, discountType: newType };
                          updated.amount = getSafeLineAmountDisplay(updated);
                          return updated;
                        })
                      );
                    }}
                  />
                </div>
              </div>
              <div className="col-span-3">
                <div className="flex flex-row gap-1 items-center whitespace-nowrap">
                  TAX
                  <AmountTypeToggle
                    value={itemData[0]?.taxType || "percentage"}
                    onChange={(newType) => {
                      setItemData((prev) =>
                        prev.map((item) => {
                          const updated = { ...item, taxType: newType };
                          updated.amount = getSafeLineAmountDisplay(updated);
                          return updated;
                        })
                      );
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2">AMOUNT</div>
              <div className="col-span-1"></div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden bg-green-500 text-white py-3 px-4 rounded-t-lg">
              <h3 className="font-semibold text-sm">Invoice Items</h3>
            </div>

            <div className="border border-gray-200 rounded-b-lg bg-white">
              <div className="p-3 sm:p-4 space-y-4 md:space-y-3">
                {itemData.map((item, index) => (
                  <div className="relative" key={item.id} style={{ zIndex: Math.max(1, 50 - index) }}>
                    {/* Mobile Layout - Stacked */}
                    <div className="md:hidden space-y-3 pb-4 border-b border-gray-200 last:border-b-0">
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <ProductAutocompleteInput
                          inputRef={(el) => (itemRefsMobile.current[index] = el)}
                          placeholder="Enter Description"
                          className={`w-full border-gray-300 text-black ${itemErrors[index]?.description ? "border-red-500" : ""}`}
                          name="description"
                          value={itemData[index]?.description ?? ""}
                          onChange={(e) => handleItemData(e, index)}
                          onSelectProduct={(product) => handleProductSelect(product, index)}
                          catalogMetadata={catalogMetadata}
                        />
                        {itemErrors[index]?.description && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{itemErrors[index].description}</span></div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-600 mb-1 block">
                            Qty <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className={`w-full border-gray-300 text-black ${itemErrors[index]?.qty ? "border-red-500" : ""}`}
                            name="qty"
                            min="0"
                            step="any"
                            value={itemData[index]?.qty ?? ""}
                            onChange={(e) => handleItemData(e, index)}
                          />
                          {itemErrors[index]?.qty && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{itemErrors[index].qty}</span></div>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600 mb-1 block">
                            Unit Price <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className={`w-full border-gray-300 text-black ${itemErrors[index]?.unitPrice ? "border-red-500" : ""}`}
                            name="unitPrice"
                            min="0"
                            step="any"
                            value={itemData[index]?.unitPrice ?? ""}
                            onChange={(e) => handleItemData(e, index)}
                          />
                          {itemErrors[index]?.unitPrice && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{itemErrors[index].unitPrice}</span></div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-600 mb-1 flex items-center justify-between">
                            Discount
                            <AmountTypeToggle
                              value={itemData[index]?.discountType || "amount"}
                              onChange={(newType) => {
                                setItemData((prev) =>
                                  prev.map((item, i) => {
                                    if (i !== index) return item;
                                    const updated = { ...item, discountType: newType };
                                    updated.amount = getSafeLineAmountDisplay(updated);
                                    return updated;
                                  })
                                );
                              }}
                            />
                          </Label>
                          <Input
                            type="number"
                            placeholder={itemData[index]?.discountType === "percentage" ? "0" : "Flat amount"}
                            className="w-full border-gray-300 text-black"
                            name="discount"
                            min="0"
                            step="any"
                            value={itemData[index]?.discount ?? ""}
                            onChange={(e) => handleItemData(e, index)}
                            onKeyDown={(e) => {
                              if (['e', 'E', '+', '-'].includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600 mb-1 flex items-center justify-between">
                            Tax
                            <AmountTypeToggle
                              value={itemData[index]?.taxType || "percentage"}
                              onChange={(newType) => {
                                setItemData((prev) =>
                                  prev.map((item, i) => {
                                    if (i !== index) return item;
                                    const updated = { ...item, taxType: newType };
                                    updated.amount = getSafeLineAmountDisplay(updated);
                                    return updated;
                                  })
                                );
                              }}
                            />
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-full border-gray-300 text-black"
                            name="tax"
                            min="0"
                            step="any"
                            value={itemData[index]?.tax ?? ""}
                            onChange={(e) => handleItemData(e, index)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">
                          Amount
                        </Label>
                        <Input
                          type="text"
                          placeholder="0.00"
                          className="w-full bg-gray-100 border-gray-300 text-gray-700 font-semibold"
                          name="amount"
                          disabled
                          value={getSafeLineAmountDisplay(itemData[index]) || "0"}
                        />
                      </div>

                      {index > 0 && (
                        <Button
                          type="button"
                          onClick={() => {
                            const newItems = [...itemData];
                            newItems.splice(index, 1);
                            setItemData(newItems);
                          }}
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Remove Item
                        </Button>
                      )}
                    </div>

                    <div className="hidden md:grid gap-2 items-start" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                      <div className="col-span-4">
                        <ProductAutocompleteInput
                          inputRef={(el) => (itemRefsDesktop.current[index] = el)}
                          placeholder="Enter Description"
                          className={`w-full border-gray-300 text-black py-2 ${itemErrors[index]?.description ? "border-red-500" : ""}`}
                          name="description"
                          value={itemData[index]?.description ?? ""}
                          onChange={(e) => handleItemData(e, index)}
                          onSelectProduct={(product) => handleProductSelect(product, index)}
                          catalogMetadata={catalogMetadata}
                        />
                        {itemErrors[index]?.description && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{itemErrors[index].description}</span></div>
                        )}
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          placeholder="0"
                          className={`w-full border-gray-300 text-black py-2 ${itemErrors[index]?.qty ? "border-red-500" : ""}`}
                          name="qty"
                          min="0"
                          step="any"
                          value={itemData[index]?.qty ?? ""}
                          onChange={(e) => handleItemData(e, index)}
                        />
                        {itemErrors[index]?.qty && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{itemErrors[index].qty}</span></div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="0"
                          className={`w-full border-gray-300 text-black py-2 ${itemErrors[index]?.unitPrice ? "border-red-500" : ""}`}
                          name="unitPrice"
                          min="0"
                          step="any"
                          value={itemData[index]?.unitPrice ?? ""}
                          onChange={(e) => handleItemData(e, index)}
                        />
                        {itemErrors[index]?.unitPrice && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3 shrink-0" /><span>{itemErrors[index].unitPrice}</span></div>
                        )}
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder={itemData[index]?.discountType === "percentage" ? "0" : "Flat amount"}
                          className="w-full border-gray-300 text-black py-2"
                          name="discount"
                          min="0"
                          step="any"
                          value={itemData[index]?.discount ?? ""}
                          onChange={(e) => handleItemData(e, index)}
                          onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder={itemData[index]?.taxType === "amount" ? "Flat amount" : "0"}
                          className="w-full border-gray-300 text-black py-2"
                          name="tax"
                          min="0"
                          step="any"
                          value={itemData[index]?.tax ?? ""}
                          onChange={(e) => handleItemData(e, index)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="text"
                          placeholder="0.00"
                          className="w-full bg-gray-50 border-gray-300 text-gray-700 py-2"
                          name="amount"
                          disabled
                          value={getSafeLineAmountDisplay(itemData[index]) || "0"}
                        />
                      </div>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...itemData];
                            newItems.splice(index, 1);
                            setItemData(newItems);
                          }}
                          className="col-span-1 flex justify-center bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors mx-auto"
                          aria-label="Delete item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-4">
              <Button
                className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 px-6 py-2 flex items-center gap-2"
                onClick={addItem}
                type="button"
              >
                <PlusIcon className="h-5 w-5" />
                Add Item
              </Button>

              <div className="bg-gray-50 p-2 rounded-lg w-full md:w-1/3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="font-bold text-lg text-black">
                    {totalAmountDue}{" "}
                    {useCustomToken
                      ? verifiedToken?.symbol || "TOKEN"
                      : selectedToken?.symbol || "TOKEN"}
                  </span>
                </div>
                {totalAmountError && (
                  <div className="flex items-center justify-end gap-1.5 mt-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{totalAmountError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6">
            <Button
              className="bg-green-600 hover:bg-green-700 px-8 py-2 text-white"
              type="submit"
              disabled={loading || !isConnected}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Creating Invoice...
                </div>
              ) : (
                "Create Invoice"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateInvoice;
