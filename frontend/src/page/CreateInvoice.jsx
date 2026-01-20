import { useEffect, useRef, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  BrowserProvider,
  Contract,
  ethers,
  formatUnits,
  parseUnits,
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

import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { encryptString } from "@lit-protocol/encryption/src/lib/encryption.js";
import { LIT_ABILITY, LIT_NETWORK } from "@lit-protocol/constants";
import {
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitAccessControlConditionResource,
} from "@lit-protocol/auth-helpers";

import TokenIntegrationRequest from "@/components/TokenIntegrationRequest";
import { ERC20_ABI } from "@/contractsABI/ERC20_ABI";

import WalletConnectionAlert from "../components/WalletConnectionAlert";
import TokenPicker, { ToggleSwitch } from "@/components/TokenPicker";
import { CopyButton } from "@/components/ui/copyButton";
import CountryPicker from "@/components/CountryPicker";
import { useTokenList } from "@/hooks/useTokenList";
import {
  getFromStorage,
  saveToStorage,
  clearStorage,
  StorageKeys,
} from "@/utils/localStorage";

function CreateInvoice() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const account = useAccount();
  const [dueDate, setDueDate] = useState(new Date());
  const [issueDate, setIssueDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { tokens, loading: loadingTokens, error: tokenListError } = useTokenList(account?.chainId || 1);
  const navigate = useNavigate();
  const litClientRef = useRef(null);

  const [searchParams] = useSearchParams();
  const [clientAddress, setClientAddress] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [clientCountry, setClientCountry] = useState("");

  // User form fields
  const [userFname, setUserFname] = useState("");
  const [userLname, setUserLname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userPostalcode, setUserPostalcode] = useState("");

  // Client form fields
  const [clientFname, setClientFname] = useState("");
  const [clientLname, setClientLname] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientPostalcode, setClientPostalcode] = useState("");

  // Token selection state
  const [selectedToken, setSelectedToken] = useState(null);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);

  const [tokenVerificationState, setTokenVerificationState] = useState("idle");
  const [verifiedToken, setVerifiedToken] = useState(null);

  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);

  // const TESTNET_TOKEN = ["0xB5E9C6e57C9d312937A059089B547d0036c155C7"]; //sepolia based chainvoice test token (CIN)

  const [itemData, setItemData] = useState([
    {
      description: "",
      qty: "",
      unitPrice: "",
      discount: "",
      tax: "",
      amount: "",
    },
  ]);

  const [totalAmountDue, setTotalAmountDue] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = getFromStorage(StorageKeys.CREATE_INVOICE);
    if (savedData) {
      // Restore dates
      if (savedData.dueDate) {
        setDueDate(new Date(savedData.dueDate));
      }
      if (savedData.issueDate) {
        setIssueDate(new Date(savedData.issueDate));
      }

      // Restore user info
      if (savedData.userFname) setUserFname(savedData.userFname);
      if (savedData.userLname) setUserLname(savedData.userLname);
      if (savedData.userEmail) setUserEmail(savedData.userEmail);
      if (savedData.userCountry) setUserCountry(savedData.userCountry);
      if (savedData.userCity) setUserCity(savedData.userCity);
      if (savedData.userPostalcode) setUserPostalcode(savedData.userPostalcode);

      // Restore client info (only if no URL params)
      const urlClientAddress = searchParams.get("clientAddress");
      if (!urlClientAddress) {
        if (savedData.clientAddress) setClientAddress(savedData.clientAddress);
        if (savedData.clientFname) setClientFname(savedData.clientFname);
        if (savedData.clientLname) setClientLname(savedData.clientLname);
        if (savedData.clientEmail) setClientEmail(savedData.clientEmail);
        if (savedData.clientCountry) setClientCountry(savedData.clientCountry);
        if (savedData.clientCity) setClientCity(savedData.clientCity);
        if (savedData.clientPostalcode)
          setClientPostalcode(savedData.clientPostalcode);
      }

      // Restore token selection
      if (savedData.selectedToken) {
        setSelectedToken(savedData.selectedToken);
        setUseCustomToken(false);
      }
      if (savedData.useCustomToken && savedData.customTokenAddress) {
        setUseCustomToken(true);
        setCustomTokenAddress(savedData.customTokenAddress);
        if (savedData.verifiedToken) {
          setVerifiedToken(savedData.verifiedToken);
          setTokenVerificationState("success");
        }
      }

      // Restore item data
      if (savedData.itemData && savedData.itemData.length > 0) {
        setItemData(savedData.itemData);
      }
    }
    setIsInitialLoad(false);
  }, []);

  // Handle URL params (should override localStorage)
  useEffect(() => {
    if (isInitialLoad) return;

    console.log("account address : ", account.address);
    const urlClientAddress = searchParams.get("clientAddress");
    const urlTokenAddress = searchParams.get("tokenAddress");
    const isCustomFromURL = searchParams.get("customToken") === "true";

    if (urlClientAddress) {
      setClientAddress(urlClientAddress);
    }

    const processUrlToken = async () => {
      if (urlTokenAddress && !loadingTokens) {
        if (isCustomFromURL) {
          setUseCustomToken(true);
          setCustomTokenAddress(urlTokenAddress);
          verifyToken(urlTokenAddress);
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
                   // Try to fetch decimals
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
              // Fallback to manual verification if we can't determine decimals safely
              console.warn("Could not determine token decimals, falling back to manual verification.");
              setUseCustomToken(true);
              setCustomTokenAddress(urlTokenAddress);
              verifyToken(urlTokenAddress);
            }
          } else {
            // Not in list, treat as custom
            setUseCustomToken(true);
            setCustomTokenAddress(urlTokenAddress);
            verifyToken(urlTokenAddress);
          }
        }
      }
    };

    processUrlToken();
  }, [searchParams, walletClient, tokens, loadingTokens, account.address, isInitialLoad]);

  useEffect(() => {
    const total = itemData.reduce((sum, item) => {
      const qty = parseUnits(item.qty || "0", 18);
      const unitPrice = parseUnits(item.unitPrice || "0", 18);
      const discount = parseUnits(item.discount || "0", 18);
      const tax = parseUnits(item.tax || "0", 18);
      const lineTotal = (qty * unitPrice) / parseUnits("1", 18);
      const adjusted = lineTotal - discount + tax;

      return sum + adjusted;
    }, 0n);

    setTotalAmountDue(formatUnits(total, 18));
  }, [itemData]);

  useEffect(() => {
    const initLit = async () => {
      if (!litClientRef.current) {
        const client = new LitNodeClient({
          litNetwork: LIT_NETWORK.DatilDev,
          debug: false,
        });
        await client.connect();
        litClientRef.current = client;
      }
    };
    initLit();
  }, []);

  useEffect(() => {
    setShowWalletAlert(!isConnected);
  }, [isConnected]);

  // Save form data to localStorage (debounced)
  useEffect(() => {
    if (isInitialLoad) return;

    const saveData = () => {
      const dataToSave = {
        dueDate: dueDate?.toISOString(),
        issueDate: issueDate?.toISOString(),
        clientAddress,
        userFname,
        userLname,
        userEmail,
        userCountry,
        userCity,
        userPostalcode,
        clientFname,
        clientLname,
        clientEmail,
        clientCountry,
        clientCity,
        clientPostalcode,
        selectedToken,
        customTokenAddress,
        useCustomToken,
        verifiedToken,
        itemData,
      };

      saveToStorage(StorageKeys.CREATE_INVOICE, dataToSave);
    };

    // Debounce save operations
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [
    dueDate,
    issueDate,
    clientAddress,
    userFname,
    userLname,
    userEmail,
    userCountry,
    userCity,
    userPostalcode,
    clientFname,
    clientLname,
    clientEmail,
    clientCountry,
    clientCity,
    clientPostalcode,
    selectedToken,
    customTokenAddress,
    useCustomToken,
    verifiedToken,
    itemData,
    isInitialLoad,
  ]);

  const handleItemData = (e, index) => {
    const { name, value } = e.target;

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
            const qty = parseUnits(updatedItem.qty || "0", 18);
            const unitPrice = parseUnits(updatedItem.unitPrice || "0", 18);
            const discount = parseUnits(updatedItem.discount || "0", 18);
            const tax = parseUnits(updatedItem.tax || "0", 18);

            const lineTotal = (qty * unitPrice) / parseUnits("1", 18);
            const finalAmount = lineTotal - discount + tax;

            updatedItem.amount = formatUnits(finalAmount, 18);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    setItemData((prev) => [
      ...prev,
      {
        description: "",
        qty: "",
        unitPrice: "",
        discount: "",
        tax: "",
        amount: "",
      },
    ]);
  };

  
const verifyToken = async (address, targetChainId = null) => {
  setTokenVerificationState("verifying");
  
  // Determine which chain to verify on
  const chainIdToUse = targetChainId || searchParams.get("chain") || account?.chainId;

  try {
    let provider;
    

    // for UNKNOWN symbol and name unknown update this rpc with some better one
    const rpcUrls = {
      1: "https://eth.llamarpc.com",                 // Ethereum (very fast)
      61: "https://etc.rivet.link",                  // Ethereum Classic
      137: "https://polygon.llamarpc.com",           // Polygon
      56: "https://bsc.llamarpc.com",                // BNB Smart Chain
      8453: "https://base.llamarpc.com",             // Base
      11155111: "https://rpc.ankr.com/eth_sepolia",  // Sepolia
    };
    if (typeof window !== "undefined" && isConnected) {
      // Fallback to wallet provider if no chainId specified
      provider = new BrowserProvider(walletClient);
    // If chainId is available, always use public RPC (works without wallet)
    } else if (chainIdToUse) {
      const rpcUrl = rpcUrls[chainIdToUse];
      
      if (!rpcUrl) {
        console.error(`Unsupported chain ${chainIdToUse}. Supported chains: Ethereum (1), Ethereum Classic (61), Polygon (137), BNB Smart Chain (56), Base (8453), Sepolia (11155111)`);
        setTokenVerificationState("error");
        return;
      }
      
      // Use JsonRpcProvider with timeout for faster response
      provider = new ethers.JsonRpcProvider(rpcUrl, Number(chainIdToUse));
    }

    const contract = new ethers.Contract(address, ERC20_ABI, provider);
  
    const [symbol, name, decimals] = await Promise.all([
        contract.symbol().catch(() => "UNKNOWN"),
        contract.name().catch(() => "Unknown Token"),
        contract.decimals().catch(() => 18),
    ]);

    console.log([symbol, name, decimals]);
    setVerifiedToken({ 
      address, 
      symbol, 
      name, 
      decimals: Number(decimals),
      chainId: chainIdToUse 
    });
    setTokenVerificationState("success");
  } catch (error) {
    console.error("Verification failed:", error);
    setTokenVerificationState("error");
  }
};

  const createInvoiceRequest = async (data) => {
    if (!isConnected || !walletClient) {
      alert("Please connect your wallet");
      return;
    }

    try {
      setLoading(true);
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const paymentToken = useCustomToken ? verifiedToken : selectedToken;

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
          address: data.clientAddress,
          fname: data.clientFname,
          lname: data.clientLname,
          email: data.clientEmail,
          country: data.clientCountry,
          city: data.clientCity,
          postalcode: data.clientPostalcode,
        },
        items: itemData,
      };

      const invoiceString = JSON.stringify(invoicePayload);

      // 2. Setup Lit
      const litNodeClient = litClientRef.current;
      if (!litNodeClient) {
        alert("Lit client not initialized");
        return;
      }
      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "ethereum",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: account.address.toLowerCase(),
          },
        },
        { operator: "or" },
        {
          contractAddress: "",
          standardContractType: "",
          chain: "ethereum",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: data.clientAddress.toLowerCase(),
          },
        },
      ];

      const { ciphertext, dataToEncryptHash } = await encryptString(
        {
          accessControlConditions,
          dataToEncrypt: invoiceString,
        },
        litNodeClient
      );

      const sessionSigs = await litNodeClient.getSessionSigs({
        chain: "ethereum",
        resourceAbilityRequests: [
          {
            resource: new LitAccessControlConditionResource("*"),
            ability: LIT_ABILITY.AccessControlConditionDecryption,
          },
        ],
        authNeededCallback: async ({
          uri,
          expiration,
          resourceAbilityRequests,
        }) => {
          const nonce = await litNodeClient.getLatestBlockhash();
          const toSign = await createSiweMessageWithRecaps({
            uri,
            expiration,
            resources: resourceAbilityRequests,
            walletAddress: account.address,
            nonce,
            litNodeClient,
          });

          return await generateAuthSig({
            signer,
            toSign,
          });
        },
      });

      const encryptedStringBase64 = btoa(ciphertext);

      if (!account?.chainId) {
        throw new Error("Missing chainId: wallet connected but chain not configured");
      }

      const chainId = account?.chainId;
      const contractAddress = import.meta.env[
        `VITE_CONTRACT_ADDRESS_${account.chainId}`
      ];

      if (!contractAddress) {
        throw new Error("Unsupported network or contract address missing");
      }

      const contract = new Contract(contractAddress, ChainvoiceABI, signer);

      const tx = await contract.createInvoice(
        data.clientAddress,
        ethers.parseUnits(totalAmountDue.toString(), paymentToken.decimals),
        paymentToken.address,
        encryptedStringBase64,
        dataToEncryptHash
      );

      const receipt = await tx.wait();
      
      // Clear localStorage on successful submission
      clearStorage(StorageKeys.CREATE_INVOICE);
      
      setTimeout(() => navigate("/dashboard/sent"), 4000);
    } catch (err) {
      console.error("Encryption or transaction failed:", err);
      alert("Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      userAddress: account?.address?.toString(),
      userFname,
      userLname,
      userEmail,
      userCountry,
      userCity,
      userPostalcode,
      clientAddress,
      clientFname,
      clientLname,
      clientEmail,
      clientCountry,
      clientCity,
      clientPostalcode,
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
                      First Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Your First Name"
                      className="w-full mt-1 border-gray-300 text-black "
                      name="userFname"
                      value={userFname}
                      onChange={(e) => setUserFname(e.target.value)}
                    />
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
                      value={userLname}
                      onChange={(e) => setUserLname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="userEmail"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
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
                      value={userCity}
                      onChange={(e) => setUserCity(e.target.value)}
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
                      value={userPostalcode}
                      onChange={(e) => setUserPostalcode(e.target.value)}
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
              <Input
                placeholder="Client Wallet Address"
                className="w-full mb-4 border-gray-300 text-black"
                name="clientAddress"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Client First Name"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="clientFname"
                      value={clientFname}
                      onChange={(e) => setClientFname(e.target.value)}
                    />
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
                      value={clientLname}
                      onChange={(e) => setClientLname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="clientEmail"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
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
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
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
                      value={clientPostalcode}
                      onChange={(e) => setClientPostalcode(e.target.value)}
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
                        onSelect={(token) => {
                          setSelectedToken({
                            address: token.contract_address,
                            symbol: token.symbol,
                            name: token.name,
                            logo: token.image,
                            decimals: 18,
                          });
                        }}
                        chainId={account?.chainId || 1}
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
                                • Address should start with "0x" followed by 40
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
                                Make sure it's a valid ERC-20 token.
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
            <div className="hidden md:grid grid-cols-12 bg-green-500 text-white py-3 px-4 rounded-t-lg font-medium text-sm gap-2">
              <div className="col-span-4">DESCRIPTION</div>
              <div className="col-span-1">QTY</div>
              <div className="col-span-2">UNIT PRICE</div>
              <div className="col-span-1">DISCOUNT</div>
              <div className="col-span-1">TAX(%)</div>
              <div className="col-span-2">AMOUNT</div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden bg-green-500 text-white py-3 px-4 rounded-t-lg">
              <h3 className="font-semibold text-sm">Invoice Items</h3>
            </div>

            <div className="border border-gray-200 rounded-b-lg bg-white overflow-hidden">
              <div className="p-3 sm:p-4 space-y-4 md:space-y-3">
                {itemData.map((_, index) => (
                  <div className="relative" key={index}>
                    {/* Mobile Layout - Stacked */}
                    <div className="md:hidden space-y-3 pb-4 border-b border-gray-200 last:border-b-0">
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">
                          Description
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Description"
                          className="w-full border-gray-300 text-black"
                          name="description"
                          value={itemData[index].description || ""}
                          onChange={(e) => handleItemData(e, index)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-600 mb-1 block">
                            Qty
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-full border-gray-300 text-black"
                            name="qty"
                            value={itemData[index].qty || ""}
                            onChange={(e) => handleItemData(e, index)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600 mb-1 block">
                            Unit Price
                          </Label>
                          <Input
                            type="text"
                            placeholder="0"
                            className="w-full border-gray-300 text-black"
                            name="unitPrice"
                            value={itemData[index].unitPrice || ""}
                            onChange={(e) => handleItemData(e, index)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-600 mb-1 block">
                            Discount
                          </Label>
                          <Input
                            type="text"
                            placeholder="0"
                            className="w-full border-gray-300 text-black"
                            name="discount"
                            value={itemData[index].discount || ""}
                            onChange={(e) => handleItemData(e, index)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600 mb-1 block">
                            Tax (%)
                          </Label>
                          <Input
                            type="text"
                            placeholder="0"
                            className="w-full border-gray-300 text-black"
                            name="tax"
                            value={itemData[index].tax || ""}
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
                          value={
                            (parseFloat(itemData[index].qty) || 0) *
                              (parseFloat(itemData[index].unitPrice) || 0) -
                            (parseFloat(itemData[index].discount) || 0) +
                            (parseFloat(itemData[index].tax) || 0)
                          }
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

                    {/* Desktop Layout - Grid */}
                    <div className="hidden md:grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <Input
                          type="text"
                          placeholder="Enter Description"
                          className="w-full border-gray-300 text-black"
                          name="description"
                          value={itemData[index].description || ""}
                          onChange={(e) => handleItemData(e, index)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          placeholder="0"
                          className="w-full border-gray-300 text-black py-2"
                          name="qty"
                          value={itemData[index].qty || ""}
                          onChange={(e) => handleItemData(e, index)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="text"
                          placeholder="0"
                          className="w-full border-gray-300 text-black py-2"
                          name="unitPrice"
                          value={itemData[index].unitPrice || ""}
                          onChange={(e) => handleItemData(e, index)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="text"
                          placeholder="0"
                          className="w-full border-gray-300 text-black py-2"
                          name="discount"
                          value={itemData[index].discount || ""}
                          onChange={(e) => handleItemData(e, index)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="text"
                          placeholder="0"
                          className="w-full border-gray-300 text-black py-2"
                          name="tax"
                          value={itemData[index].tax || ""}
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
                          value={
                            (parseFloat(itemData[index].qty) || 0) *
                              (parseFloat(itemData[index].unitPrice) || 0) -
                            (parseFloat(itemData[index].discount) || 0) +
                            (parseFloat(itemData[index].tax) || 0)
                          }
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
