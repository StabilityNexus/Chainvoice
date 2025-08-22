import React, { useEffect, useRef, useState } from "react";
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
  CalendarIcon,
  CheckCircle2,
  Loader2,
  PlusIcon,
  XCircle,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOKEN_PRESETS } from "@/utils/erc20_token";
import TokenIntegrationRequest from "@/components/TokenIntegrationRequest";
import { ERC20_ABI } from "@/contractsABI/ERC20_ABI";

import WalletConnectionAlert from "../components/WalletConnectionAlert";

function CreateInvoice() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const account = useAccount();
  const [dueDate, setDueDate] = useState(new Date());
  const [issueDate, setIssueDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const litClientRef = useRef(null);

  const [searchParams] = useSearchParams();

  const [clientAddress, setClientAddress] = useState("");

  // Token selection state
  const [selectedToken, setSelectedToken] = useState(TOKEN_PRESETS[0]);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);
  const [tokenVerificationState, setTokenVerificationState] = useState("idle");
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);

  const filteredTokens = TOKEN_PRESETS.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const POPULAR_TOKENS = [
    "0x0000000000000000000000000000000000000000", // ETH
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
    "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
  ];

  const TESTNET_TOKEN = ["0xB5E9C6e57C9d312937A059089B547d0036c155C7"]; //sepolia based chainvoice test token (CIN)
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

  useEffect(() => {
    console.log("account address : ", account.address);
    const urlClientAddress = searchParams.get("clientAddress");
    const urlTokenAddress = searchParams.get("tokenAddress");
    const isCustomFromURL = searchParams.get("customToken") === "true";

    if (urlClientAddress) {
      setClientAddress(urlClientAddress);
    }

    if (urlTokenAddress) {
      if (isCustomFromURL) {
        setUseCustomToken(true);
        setCustomTokenAddress(urlTokenAddress);
        verifyToken(urlTokenAddress);
      } else {
        const preselectedToken = TOKEN_PRESETS.find(
          (token) =>
            token.address.toLowerCase() === urlTokenAddress.toLowerCase()
        );
        if (preselectedToken) {
          setSelectedToken(preselectedToken);
          setUseCustomToken(false);
        } else {
          setUseCustomToken(true);
          setCustomTokenAddress(urlTokenAddress);
          verifyToken(urlTokenAddress);
        }
      }
    }
  }, [searchParams]);

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

  const verifyToken = async (address) => {
    setTokenVerificationState("verifying");
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(address, ERC20_ABI, provider);

        const [symbol, name, decimals] = await Promise.all([
          contract.symbol().catch(() => "UNKNOWN"),
          contract.name().catch(() => "Unknown Token"),
          contract.decimals().catch(() => 18),
        ]);

        setVerifiedToken({ address, symbol, name, decimals });
        setTokenVerificationState("success");
      } else {
        console.error("No Ethereum provider found");
        setTokenVerificationState("error");
      }
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

      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ChainvoiceABI,
        signer
      );

      const tx = await contract.createInvoice(
        data.clientAddress,
        ethers.parseUnits(totalAmountDue.toString(), paymentToken.decimals),
        paymentToken.address,
        encryptedStringBase64,
        dataToEncryptHash
      );

      const receipt = await tx.wait();
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
      userAddress: formData.get("userAddress"),
      userFname: formData.get("userFname"),
      userLname: formData.get("userLname"),
      userEmail: formData.get("userEmail"),
      userCountry: formData.get("userCountry"),
      userCity: formData.get("userCity"),
      userPostalcode: formData.get("userPostalcode"),
      clientAddress: formData.get("clientAddress"),
      clientFname: formData.get("clientFname"),
      clientLname: formData.get("clientLname"),
      clientEmail: formData.get("clientEmail"),
      clientCountry: formData.get("clientCountry"),
      clientCity: formData.get("clientCity"),
      clientPostalcode: formData.get("clientPostalcode"),
      itemData,
    };

    await createInvoiceRequest(data);
  };

  return (
    <>
      <div className="flex justify-center">
        <WalletConnectionAlert
          show={showWalletAlert}
          message="Connect your wallet to create and manage invoices"
          onDismiss={() => setShowWalletAlert(false)}
        />
      </div>

      <div className="mx-6">
        {(searchParams.get("clientAddress") ||
          searchParams.get("amount") ||
          searchParams.get("description")) && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
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

        <h2 className="text-2xl font-bold mb-6 text-white">
          Create New Invoice Request
        </h2>

        <div className="flex flex-wrap items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <Label className="text-md font-medium text-gray-700">
              Invoice #
            </Label>
            <Input
              value="1"
              className="w-24 bg-gray-100 border-gray-300 text-gray-700"
              disabled
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label className="text-md font-medium text-gray-700">
              Issued Date
            </Label>
            <Button
              className={cn(
                "w-[200px] justify-start text-left font-normal bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
                !issueDate && "text-black"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(issueDate, "PPP")}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Label className="text-md font-medium text-gray-700">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[260px] justify-start text-left font-normal text-gray-700",
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
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="border border-gray-200 flex-1 p-6 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                From (Your Information)
              </h3>
              <Input
                value={account?.address}
                className="w-full mb-4 bg-gray-50 border-gray-300 text-gray-500"
                readOnly
                name="userAddress"
              />

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Your First Name"
                      className="w-full mt-1 border-gray-300 text-black "
                      name="userFname"
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
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Country
                    </Label>
                    <Input
                      type="text"
                      placeholder="Country"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="userCountry"
                    />
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
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Country
                    </Label>
                    <Input
                      type="text"
                      placeholder="Country"
                      className="w-full mt-1 border-gray-300 text-black"
                      name="clientCountry"
                    />
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
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
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-auto flex-1">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Token
                  </Label>
                  <Select
                    value={useCustomToken ? "custom" : selectedToken.address}
                    onValueChange={(value) => {
                      if (value === "custom") {
                        setUseCustomToken(true);
                        setSelectedToken(null);
                      } else {
                        setUseCustomToken(false);
                        const token = TOKEN_PRESETS.find(
                          (t) => t.address === value
                        );
                        if (token) {
                          setSelectedToken(token);
                          setCustomTokenAddress("");
                          setTokenVerificationState("idle");
                          setVerifiedToken(null);
                        }
                      }
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full h-12 bg-gray-50 hover:bg-gray-100 border-gray-200">
                      <SelectValue placeholder="Choose a token" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                      {/* Search input for filtering */}
                      <div className="p-2 border-b">
                        <Input
                          ref={inputRef}
                          placeholder="Search tokens..."
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {!searchTerm && (
                        <>
                          <div className="p-1">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500">
                              Popular
                            </div>
                            {TOKEN_PRESETS.filter((token) =>
                              POPULAR_TOKENS.includes(token.address)
                            ).map((token) => (
                              <SelectItem
                                key={token.address}
                                value={token.address}
                                className="hover:bg-gray-50 focus:bg-gray-50"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={token.logo}
                                      alt={token.name}
                                      width={28}
                                      height={28}
                                      className="object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/tokenImages/generic.png";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">
                                      {token.name}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-2">
                                      {token.symbol}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                          <div className="p-1">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500">
                              Testnet Token
                            </div>
                            {TOKEN_PRESETS.filter((token) =>
                              TESTNET_TOKEN.includes(token.address)
                            ).map((token) => (
                              <SelectItem
                                key={token.address}
                                value={token.address}
                                className="hover:bg-gray-50 focus:bg-gray-50"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={token.logo}
                                      alt={token.name}
                                      width={28}
                                      height={28}
                                      className="object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/tokenImages/generic.png";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">
                                      {token.name}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-2">
                                      {token.symbol}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        </>
                      )}
                      <div className="p-1">
                        <div className="px-3 py-1 text-xs font-medium text-gray-500">
                          {searchTerm ? "Search Results" : "All Tokens"}
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredTokens
                            .filter(
                              (token) =>
                                !POPULAR_TOKENS.includes(token.address) &&
                                !TESTNET_TOKEN.includes(token.address)
                            )
                            .map((token) => (
                              <SelectItem
                                key={token.address}
                                value={token.address}
                                className="hover:bg-gray-50 focus:bg-gray-50"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={token.logo}
                                      alt={token.name}
                                      width={28}
                                      height={28}
                                      className="object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/tokenImages/generic.png";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">
                                      {token.name}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-2">
                                      {token.symbol}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                        </div>
                        {filteredTokens.length === 0 && (
                          <div className="p-4 text-center text-sm text-gray-500">
                            No tokens found
                          </div>
                        )}
                      </div>

                      <SelectItem
                        value="custom"
                        className="hover:bg-gray-50 focus:bg-gray-50 border-t border-gray-100 mt-1 pt-2"
                      >
                        <div className="flex items-center gap-3 py-1.5">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                            <PlusIcon className="h-4 w-4 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900">
                            Custom Token
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!useCustomToken && (
                  <div className="w-full sm:w-auto flex-1">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Token Details
                    </Label>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            // src={`/tokenImages/${selectedToken.symbol.toLowerCase()}.png`}
                            src={selectedToken.logo}
                            alt={selectedToken.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">
                            {selectedToken.name}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">
                            {selectedToken.symbol}
                          </span>
                          <div className="text-xs text-gray-500 break-all">
                            {selectedToken.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {useCustomToken && (
                <div className="space-y-3">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Token Contract Address
                    </Label>
                    <Input
                      placeholder="0x..."
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
                      className="h-10 bg-gray-50 text-gray-700 border-gray-200 focus:ring-2 focus:ring-blue-100"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 my-2">
                      Enter a valid ERC-20 token contract address
                    </p>
                  </div>

                  {tokenVerificationState === "verifying" && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying token...
                    </div>
                  )}

                  {tokenVerificationState === "success" && verifiedToken && (
                    <div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-10 w-10 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {verifiedToken.name} ({verifiedToken.symbol})
                            </p>
                            <p className="text-xs text-gray-500 break-all">
                              {verifiedToken.address}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              <p>Decimals: {String(verifiedToken.decimals)}</p>
                            </p>
                          </div>
                        </div>
                      </div>
                      <TokenIntegrationRequest address={customTokenAddress} />
                    </div>
                  )}

                  {tokenVerificationState === "error" && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-600">
                          Failed to verify token. Please check the address.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {useCustomToken ? (
                    verifiedToken ? (
                      <>
                        <span className="font-medium text-gray-700">Note:</span>{" "}
                        Payments will be processed in {verifiedToken?.symbol}.
                        Ensure your client has sufficient balance of this token.
                      </>
                    ) : (
                      ""
                    )
                  ) : (
                    <>
                      <span className="font-medium text-gray-700">Note:</span>{" "}
                      Payments will be processed in {selectedToken.symbol}.
                      Ensure your client has sufficient balance of this token.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Invoice Items Section */}
          <div className="mb-8">
            <div className="grid grid-cols-12 bg-green-500 text-white py-3 px-4 rounded-t-lg font-medium text-sm">
              <div className="col-span-4 md:col-span-4">DESCRIPTION</div>
              <div className="col-span-2 md:col-span-1">QTY</div>
              <div className="col-span-2">UNIT PRICE</div>
              <div className="col-span-2 md:col-span-1">DISCOUNT</div>
              <div className="col-span-2 md:col-span-1">TAX(%)</div>
              <div className="col-span-2">AMOUNT</div>
              {/* <div className="col-span-1">AMOUNT</div> */}
            </div>

            <div className="border border-gray-200 p-4 rounded-b-lg bg-white">
              {itemData.map((_, index) => (
                <div
                  className="grid grid-cols-12 gap-2 mb-3 items-center relative"
                  key={index}
                >
                  {/* Item Fields */}
                  <div className="col-span-4 md:col-span-4">
                    <Input
                      type="text"
                      placeholder="Enter Description"
                      className="w-full border-gray-300 text-black"
                      name="description"
                      onChange={(e) => handleItemData(e, index)}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-full border-gray-300 text-black py-2"
                      name="qty"
                      onChange={(e) => handleItemData(e, index)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="text"
                      placeholder="0"
                      className="w-full border-gray-300 text-black py-2"
                      name="unitPrice"
                      onChange={(e) => handleItemData(e, index)}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      type="text"
                      placeholder="0"
                      className="w-full border-gray-300 text-black py-2"
                      name="discount"
                      onChange={(e) => handleItemData(e, index)}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Input
                      type="text"
                      placeholder="0"
                      className="w-full border-gray-300 text-black py-2"
                      name="tax"
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
                      className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
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
              ))}
            </div>
            <div className="flex justify-between mt-4">
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
                      ? verifiedToken?.symbol
                      : selectedToken.symbol}
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
