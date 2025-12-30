// pages/CreateInvoicesBatch.jsx - Clean & Professional
import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  X,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Users,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { createBatchInvoicesSchema } from "@/lib/validationSchemas";
import { ErrorMessage } from "@/components/ui/errorMessage";

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
import { toast } from "react-toastify";

function CreateInvoicesBatch() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const account = useAccount();
  const [dueDate, setDueDate] = useState(new Date());
  const [issueDate, setIssueDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const litClientRef = useRef(null);

  // Token selection state
  const [selectedToken, setSelectedToken] = useState(null);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);
  const [tokenVerificationState, setTokenVerificationState] = useState("idle");
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);

  // UI state for collapsible invoices
  const [expandedInvoice, setExpandedInvoice] = useState(0);

  // React Hook Form setup
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, touchedFields, isSubmitted },
    setValue,
    watch,
    control,
    trigger,
  } = useForm({
    resolver: zodResolver(createBatchInvoicesSchema),
    mode: "onTouched",
    defaultValues: {
      userFname: "",
      userLname: "",
      userEmail: "",
      userCountry: "",
      userCity: "",
      userPostalcode: "",
      invoiceRows: [
        {
          clientAddress: "",
          clientFname: "",
          clientLname: "",
          clientEmail: "",
          clientCountry: "",
          clientCity: "",
          clientPostalcode: "",
          itemData: [
            {
              description: "",
              qty: "",
              unitPrice: "",
              discount: "",
              tax: "",
              amount: "",
            },
          ],
          totalAmountDue: 0,
        },
      ],
    },
  });

  const { fields: invoiceRowFields, append: appendInvoiceRow, remove: removeInvoiceRow } = useFieldArray({
    control,
    name: "invoiceRows",
  });

  // Watch form values
  const invoiceRows = watch("invoiceRows") || [];
  const userInfo = watch();

  // Calculate totals for each invoice
  useEffect(() => {
    const currentRows = invoiceRows || [];
    currentRows.forEach((row, index) => {
      const total = (row.itemData || []).reduce((sum, item) => {
        const qty = parseUnits(item.qty || "0", 18);
        const unitPrice = parseUnits(item.unitPrice || "0", 18);
        const discount = parseUnits(item.discount || "0", 18);
        const tax = parseUnits(item.tax || "0", 18);
        const lineTotal = (qty * unitPrice) / parseUnits("1", 18);
        const adjusted = lineTotal - discount + tax;
        return sum + adjusted;
      }, 0n);
      const newTotal = parseFloat(formatUnits(total, 18));
      // Only update if value actually changed to prevent loops
      if (row.totalAmountDue !== newTotal) {
        setValue(`invoiceRows.${index}.totalAmountDue`, newTotal, { shouldValidate: false });
      }
    });
  }, [invoiceRows, setValue]);

  // Initialize Lit
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

  // Invoice management
  const addInvoiceRow = () => {
    const newIndex = invoiceRows.length;
    appendInvoiceRow({
      clientAddress: "",
      clientFname: "",
      clientLname: "",
      clientEmail: "",
      clientCountry: "",
      clientCity: "",
      clientPostalcode: "",
      itemData: [
        {
          description: "",
          qty: "",
          unitPrice: "",
          discount: "",
          tax: "",
          amount: "",
        },
      ],
      totalAmountDue: 0,
    });
    setExpandedInvoice(newIndex);
  };

  const handleRemoveInvoiceRow = (index) => {
    if (invoiceRows.length > 1) {
      removeInvoiceRow(index);
      if (expandedInvoice === index) {
        setExpandedInvoice(0);
      }
    }
  };

  const updateInvoiceRow = (rowIndex, field, value) => {
    setValue(`invoiceRows.${rowIndex}.${field}`, value, { shouldValidate: true });
    trigger(`invoiceRows.${rowIndex}.${field}`);
  };

  // Item management
  const handleItemData = (e, rowIndex, itemIndex) => {
    const { name, value } = e.target;
    const currentItems = watch(`invoiceRows.${rowIndex}.itemData`) || [];
    
    // Update the item with new value
    const updatedItems = currentItems.map((item, i) => {
      if (i === itemIndex) {
        const updatedItem = { ...item, [name]: value };
        
        // Calculate amount if needed
        if (name === "qty" || name === "unitPrice" || name === "discount" || name === "tax") {
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
    });

    // Update the entire itemData array
    setValue(`invoiceRows.${rowIndex}.itemData`, updatedItems, { shouldValidate: true, shouldDirty: true });
    trigger(`invoiceRows.${rowIndex}.itemData.${itemIndex}.${name}`);
  };

  const addItem = (rowIndex) => {
    const currentItems = watch(`invoiceRows.${rowIndex}.itemData`) || [];
    const newItems = [
      ...currentItems,
      {
        description: "",
        qty: "",
        unitPrice: "",
        discount: "",
        tax: "",
        amount: "",
      },
    ];
    setValue(`invoiceRows.${rowIndex}.itemData`, newItems, { shouldValidate: true });
  };

  // Token verification
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

  // Enhanced error handling for batch creation
  const getErrorMessage = (error) => {
    if (error.code === "ACTION_REJECTED") {
      return "Transaction was cancelled by user";
    } else if (error.message?.includes("insufficient")) {
      return "Insufficient balance to complete transaction";
    } else if (error.message?.includes("network")) {
      return "Network error. Please check your connection and try again";
    } else if (error.reason) {
      return `Transaction failed: ${error.reason}`;
    } else if (error.message) {
      return error.message;
    } else {
      return "Failed to create invoice batch. Please try again.";
    }
  };

  // Create batch invoices
  const createInvoicesRequest = async (data) => {
    if (!isConnected || !walletClient) {
      return;
    }

    try {
      setLoading(true);

      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const paymentToken = useCustomToken ? verifiedToken : selectedToken;

      if (!paymentToken) {
        toast.error("Please select a payment token");
        setLoading(false);
        return;
      }

      // Validate invoices - use form data
      const formInvoiceRows = data.invoiceRows || [];
      const validInvoices = formInvoiceRows.filter(
        (row) => row.clientAddress && parseFloat(row.totalAmountDue) > 0
      );

      if (validInvoices.length === 0) {
        toast.error("No valid invoices to create. Please ensure all invoices have a client address and amount.");
        setLoading(false);
        return;
      }

      // Prepare batch arrays
      const tos = [];
      const amounts = [];
      const encryptedPayloads = [];
      const encryptedHashes = [];

      const litNodeClient = litClientRef.current;
      if (!litNodeClient) {
        toast.error("Encryption service not initialized. Please try again.");
        setLoading(false);
        return;
      }

      // Process each invoice - use form data
      for (const [index, row] of validInvoices.entries()) {

        const invoicePayload = {
          amountDue: row.totalAmountDue.toString(),
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
            country: data.userCountry || "",
            city: data.userCity || "",
            postalcode: data.userPostalcode || "",
          },
          client: {
            address: row.clientAddress,
            fname: row.clientFname,
            lname: row.clientLname,
            email: row.clientEmail,
            country: row.clientCountry,
            city: row.clientCity,
            postalcode: row.clientPostalcode,
          },
          items: row.itemData,
          // Add batch metadata
          batchInfo: {
            batchId: `batch_${Date.now()}`,
            batchSize: validInvoices.length,
            index: index,
            batchType: "user_created",
          },
        };

        const invoiceString = JSON.stringify(invoicePayload);

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
              value: row.clientAddress.toLowerCase(),
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

        // Add to batch arrays
        tos.push(row.clientAddress);
        amounts.push(
          ethers.parseUnits(
            row.totalAmountDue.toString(),
            paymentToken.decimals
          )
        );
        encryptedPayloads.push(encryptedStringBase64);
        encryptedHashes.push(dataToEncryptHash);
      }

      // Send to contract
      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ChainvoiceABI,
        signer
      );

      const tx = await contract.createInvoicesBatch(
        tos,
        amounts,
        paymentToken.address,
        encryptedPayloads,
        encryptedHashes
      );

      const receipt = await tx.wait();

      setTimeout(() => navigate("/dashboard/sent"), 3000);
    } catch (err) {
      console.error("Batch creation failed:", err);
      const errorMsg = getErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    await createInvoicesRequest(data);
  };

  const totalBatchAmount = (invoiceRows || []).reduce((sum, row) => {
    return sum + (parseFloat(row.totalAmountDue) || 0);
  }, 0);

  const validInvoices = (invoiceRows || []).filter(
    (row) => row.clientAddress && parseFloat(row.totalAmountDue) > 0
  ).length;

  const gasSavingsPercent = validInvoices > 1 ? (validInvoices - 1) * 75 : 0;

  return (
    <>
      <div className="flex justify-center px-2 sm:px-4">
        <WalletConnectionAlert
          show={showWalletAlert}
          message="Connect your wallet to create batch invoices"
          onDismiss={() => setShowWalletAlert(false)}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        {/* Simple Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Create Invoices (Batch)
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            Create multiple invoices in a single transaction and save on gas
            fees
          </p>
        </div>

        {/* Clean Date Selection */}
        <div className="w-full bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8 border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="flex items-center justify-center gap-3">
                <Label className="text-sm font-medium text-gray-700 mb-1">
                  Batch Size
                </Label>
                <div className="text-xl font-semibold text-gray-900">
                  {invoiceRows.length}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-gray-700 w-full sm:w-auto">
              <Label className="text-sm font-medium text-gray-700">
                Issued Date
              </Label>
              <Button
                variant="outline"
                className="w-full sm:w-[220px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(issueDate, "PPP")}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-gray-700 w-full sm:w-auto">
              <Label className="text-sm font-medium text-gray-700">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[220px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "PPP")
                    ) : (
                      <span className="text-gray-500">Pick a date</span>
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
                      }
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Clean Summary Stats */}
        <div className="w-full bg-gray-800 text-white p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold">{invoiceRows.length}</div>
              <div className="text-gray-300 text-xs sm:text-sm">Total Invoices</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{validInvoices}</div>
              <div className="text-gray-300 text-xs sm:text-sm">Valid Invoices</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">
                {totalBatchAmount.toFixed(4)}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">
                Total Amount (
                {useCustomToken
                  ? verifiedToken?.symbol || "TOKEN"
                  : selectedToken?.symbol || "TOKEN"}
                )
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">~{gasSavingsPercent}%</div>
              <div className="text-gray-300 text-xs sm:text-sm">Gas Savings</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit(handleSubmit)}>
          {/* Clean User Information */}
          <div className="mb-6 sm:mb-8">
            <div className="w-full bg-white border border-gray-200 p-4 sm:p-6 rounded-lg shadow-sm overflow-hidden">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                From (Your Information)
              </h3>
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Your Wallet Address
                </Label>
                <Input
                  value={account?.address || "Not connected"}
                  className="w-full bg-gray-50 border-gray-300 text-gray-600 font-mono text-sm"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    placeholder="Your First Name"
                    className={cn(
                      "w-full mt-1 border-gray-300 text-black",
                      errors.userFname && "border-red-500"
                    )}
                    {...register("userFname")}
                  />
                  <ErrorMessage message={errors.userFname?.message} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    placeholder="Your Last Name"
                    className={cn(
                      "w-full mt-1 border-gray-300 text-black",
                      errors.userLname && "border-red-500"
                    )}
                    {...register("userLname")}
                  />
                  <ErrorMessage message={errors.userLname?.message} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Email *
                  </Label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className={cn(
                      "w-full mt-1 border-gray-300 text-black",
                      errors.userEmail && "border-red-500"
                    )}
                    {...register("userEmail")}
                  />
                  <ErrorMessage message={errors.userEmail?.message} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Country
                  </Label>
                  <div className="mt-1">
                    <CountryPicker
                      value={watch("userCountry") || ""}
                      onChange={(value) => {
                        setValue("userCountry", value, { shouldValidate: true });
                      }}
                      placeholder="Select country"
                      className={cn(
                        "w-full border-gray-300 text-black",
                        errors.userCountry && "border-red-500"
                      )}
                      disabled={loading}
                    />
                  </div>
                  <ErrorMessage message={errors.userCountry?.message} />
                </div>
              </div>
            </div>
          </div>

          {/* Clean Token Selection */}
          <div className="w-full mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Currency
            </h3>

            <div className="space-y-4">
              <ToggleSwitch
                enabled={useCustomToken}
                onChange={setUseCustomToken}
                leftLabel="Select Token"
                rightLabel="Input Custom Token"
              />

              <div className="w-full">
                {!useCustomToken ? (
                  <>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose from Available Tokens
                    </Label>
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
                      allowCustom={false}
                    />
                  </>
                ) : (
                  <>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Token Contract Address
                    </Label>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Coins className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">
                            Custom Token Setup
                          </h4>
                          <p className="text-sm text-blue-700">
                            Enter the contract address of the ERC-20 token you
                            want to use.
                          </p>
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
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 mt-3">
                        <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                        <span className="text-yellow-700 text-sm">
                          Verifying token contract...
                        </span>
                      </div>
                    )}

                    {tokenVerificationState === "success" && verifiedToken && (
                      <div className="mt-3">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-medium text-green-800">
                                  {verifiedToken.name} ({verifiedToken.symbol})
                                </p>
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  Verified
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-green-600 font-mono">
                                  {verifiedToken.address}
                                </span>
                                <CopyButton
                                  textToCopy={verifiedToken.address}
                                />
                              </div>
                              <p className="text-xs text-green-600">
                                Decimals: {String(verifiedToken.decimals)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <TokenIntegrationRequest address={customTokenAddress} />
                      </div>
                    )}

                    {tokenVerificationState === "error" && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200 mt-3">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="text-sm text-red-600 font-medium">
                              Token verification failed
                            </p>
                            <p className="text-xs text-red-500 mt-1">
                              Please check the contract address and try again.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Clean Invoice Rows */}
          <div className="w-full mb-6 sm:mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Invoices</h3>
              <Button
                type="button"
                onClick={addInvoiceRow}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Invoice
              </Button>
            </div>

            {invoiceRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="border border-gray-200 rounded-lg bg-white shadow-sm"
              >
                {/* Clean Invoice Header */}
                <div
                  className={cn(
                    "flex items-center justify-between p-4 cursor-pointer transition-colors",
                    expandedInvoice === rowIndex
                      ? "bg-gray-50 border-b"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() =>
                    setExpandedInvoice(
                      expandedInvoice === rowIndex ? -1 : rowIndex
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    {expandedInvoice === rowIndex ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                    <span className="font-semibold text-gray-800">
                      Invoice #{rowIndex + 1}
                    </span>
                    {row.clientAddress && parseFloat(row.totalAmountDue) > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {row.clientAddress
                          ? `${row.clientAddress.slice(
                              0,
                              8
                            )}...${row.clientAddress.slice(-6)}`
                          : "No client"}
                      </div>
                      <div className="font-semibold text-gray-800">
                        {(() => {
                          const currentRow = watch(`invoiceRows.${rowIndex}`) || row;
                          const calculatedTotal = (currentRow.itemData || []).reduce((sum, item) => {
                            const qty = parseFloat(item.qty || "0");
                            const unitPrice = parseFloat(item.unitPrice || "0");
                            const discount = parseFloat(item.discount || "0");
                            const tax = parseFloat(item.tax || "0");
                            const lineTotal = qty * unitPrice;
                            const adjusted = lineTotal - discount + tax;
                            return sum + adjusted;
                          }, 0);
                          return calculatedTotal.toFixed(4);
                        })()}{" "}
                        {useCustomToken
                          ? verifiedToken?.symbol || "TOKEN"
                          : selectedToken?.symbol || "TOKEN"}
                      </div>
                    </div>
                    {invoiceRows.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveInvoiceRow(rowIndex);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Clean Invoice Content */}
                {expandedInvoice === rowIndex && (
                  <div className="p-6">
                    {/* Clean Client Information */}
                    <div className="w-full border border-gray-200 p-3 sm:p-4 rounded-lg bg-gray-50 mb-4 sm:mb-6 overflow-hidden">
                      <h4 className="text-md font-semibold mb-4 text-gray-800">
                        Client Information
                      </h4>
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                          Client Wallet Address *
                        </Label>
                        <Input
                          placeholder="0x... (Client's wallet address)"
                          className={cn(
                            "w-full border-gray-300 text-black font-mono",
                            errors.invoiceRows?.[rowIndex]?.clientAddress && "border-red-500"
                          )}
                          {...register(`invoiceRows.${rowIndex}.clientAddress`, {
                            onChange: (e) => {
                              updateInvoiceRow(rowIndex, "clientAddress", e.target.value);
                            },
                          })}
                        />
                        <ErrorMessage message={errors.invoiceRows?.[rowIndex]?.clientAddress?.message} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            First Name
                          </Label>
                          <Input
                            placeholder="Client First Name"
                            className={cn(
                              "w-full mt-1 border-gray-300 text-black",
                              errors.invoiceRows?.[rowIndex]?.clientFname && "border-red-500"
                            )}
                            {...register(`invoiceRows.${rowIndex}.clientFname`, {
                              onChange: (e) => {
                                updateInvoiceRow(rowIndex, "clientFname", e.target.value);
                              },
                            })}
                          />
                          <ErrorMessage message={errors.invoiceRows?.[rowIndex]?.clientFname?.message} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Last Name
                          </Label>
                          <Input
                            placeholder="Client Last Name"
                            className={cn(
                              "w-full mt-1 border-gray-300 text-black",
                              errors.invoiceRows?.[rowIndex]?.clientLname && "border-red-500"
                            )}
                            {...register(`invoiceRows.${rowIndex}.clientLname`, {
                              onChange: (e) => {
                                updateInvoiceRow(rowIndex, "clientLname", e.target.value);
                              },
                            })}
                          />
                          <ErrorMessage message={errors.invoiceRows?.[rowIndex]?.clientLname?.message} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Email
                          </Label>
                          <Input
                            type="email"
                            placeholder="client@example.com"
                            className={cn(
                              "w-full mt-1 border-gray-300 text-black",
                              errors.invoiceRows?.[rowIndex]?.clientEmail && "border-red-500"
                            )}
                            {...register(`invoiceRows.${rowIndex}.clientEmail`, {
                              onChange: (e) => {
                                updateInvoiceRow(rowIndex, "clientEmail", e.target.value);
                              },
                            })}
                          />
                          <ErrorMessage message={errors.invoiceRows?.[rowIndex]?.clientEmail?.message} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Country
                          </Label>
                          <div className="mt-1">
                            <CountryPicker
                              value={watch(`invoiceRows.${rowIndex}.clientCountry`) || ""}
                              onChange={(value) => {
                                updateInvoiceRow(rowIndex, "clientCountry", value);
                              }}
                              placeholder="Select country"
                              className={cn(
                                "w-full border-gray-300 text-black",
                                errors.invoiceRows?.[rowIndex]?.clientCountry && "border-red-500"
                              )}
                              disabled={loading}
                            />
                          </div>
                          <ErrorMessage message={errors.invoiceRows?.[rowIndex]?.clientCountry?.message} />
                        </div>
                      </div>
                    </div>

                    {/* Clean Invoice Items */}
                    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-100 px-4 py-3 rounded-t-lg">
                        <h4 className="font-semibold text-gray-800">
                          Invoice Items
                        </h4>
                      </div>

                      <div className="hidden md:grid grid-cols-12 bg-gray-50 text-gray-700 py-3 px-4 font-medium text-sm border-b">
                        <div className="col-span-4">DESCRIPTION</div>
                        <div className="col-span-1">QTY</div>
                        <div className="col-span-2">UNIT PRICE</div>
                        <div className="col-span-1">DISCOUNT</div>
                        <div className="col-span-1">TAX(%)</div>
                        <div className="col-span-2">AMOUNT</div>
                        <div className="col-span-1">ACTION</div>
                      </div>

                      <div className="p-2 sm:p-4">
                        {row.itemData.map((item, itemIndex) => (
                          <div
                            className="flex flex-col md:grid md:grid-cols-12 gap-2 mb-3 pb-3 md:pb-0 border-b md:border-b-0 border-gray-200 md:items-start"
                            key={itemIndex}
                          >
                            <div className="md:col-span-4 w-full">
                              <label className="text-xs font-medium text-gray-600 mb-1 block md:hidden">Description</label>
                              <Input
                                placeholder="Enter Description"
                                className={cn(
                                  "w-full border-gray-300 text-black",
                                  errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.description && (touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.description || isSubmitted) && "border-red-500"
                                )}
                                {...register(`invoiceRows.${rowIndex}.itemData.${itemIndex}.description`, {
                                  onChange: (e) => handleItemData(e, rowIndex, itemIndex)
                                })}
                              />
                              <ErrorMessage 
                                message={errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.description?.message}
                                show={!!touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.description || isSubmitted}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2 md:contents">
                              <div className="md:col-span-1">
                                <label className="text-xs font-medium text-gray-600 mb-1 block md:hidden">Qty</label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className={cn(
                                    "w-full border-gray-300 text-black",
                                    errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.qty && (touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.qty || isSubmitted) && "border-red-500"
                                  )}
                                  {...register(`invoiceRows.${rowIndex}.itemData.${itemIndex}.qty`, {
                                    onChange: (e) => handleItemData(e, rowIndex, itemIndex)
                                  })}
                                />
                                <ErrorMessage 
                                  message={errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.qty?.message}
                                  show={!!touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.qty || isSubmitted}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-xs font-medium text-gray-600 mb-1 block md:hidden">Unit Price</label>
                                <Input
                                  type="text"
                                  placeholder="0"
                                  className={cn(
                                    "w-full border-gray-300 text-black",
                                    errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.unitPrice && (touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.unitPrice || isSubmitted) && "border-red-500"
                                  )}
                                  {...register(`invoiceRows.${rowIndex}.itemData.${itemIndex}.unitPrice`, {
                                    onChange: (e) => handleItemData(e, rowIndex, itemIndex)
                                  })}
                                />
                                <ErrorMessage 
                                  message={errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.unitPrice?.message}
                                  show={!!touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.unitPrice || isSubmitted}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 md:contents">
                              <div className="md:col-span-1">
                                <label className="text-xs font-medium text-gray-600 mb-1 block md:hidden">Discount</label>
                                <Input
                                  type="text"
                                  placeholder="0"
                                  className={cn(
                                    "w-full border-gray-300 text-black",
                                    errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.discount && (touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.discount || isSubmitted) && "border-red-500"
                                  )}
                                  {...register(`invoiceRows.${rowIndex}.itemData.${itemIndex}.discount`, {
                                    onChange: (e) => handleItemData(e, rowIndex, itemIndex)
                                  })}
                                />
                                <ErrorMessage 
                                  message={errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.discount?.message}
                                  show={!!touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.discount || isSubmitted}
                                />
                              </div>
                              <div className="md:col-span-1">
                                <label className="text-xs font-medium text-gray-600 mb-1 block md:hidden">Tax (%)</label>
                                <Input
                                  type="text"
                                  placeholder="0"
                                  className={cn(
                                    "w-full border-gray-300 text-black",
                                    errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.tax && (touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.tax || isSubmitted) && "border-red-500"
                                  )}
                                  {...register(`invoiceRows.${rowIndex}.itemData.${itemIndex}.tax`, {
                                    onChange: (e) => handleItemData(e, rowIndex, itemIndex)
                                  })}
                                />
                                <ErrorMessage 
                                  message={errors.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.tax?.message}
                                  show={!!touchedFields.invoiceRows?.[rowIndex]?.itemData?.[itemIndex]?.tax || isSubmitted}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between md:contents">
                              <div className="md:col-span-2 flex-1">
                                <label className="text-xs font-medium text-gray-600 mb-1 block md:hidden">Amount</label>
                                <div className="bg-gray-100 px-3 py-2 rounded border text-gray-700 font-mono text-sm">
                                  {(
                                    (parseFloat(item.qty) || 0) *
                                      (parseFloat(item.unitPrice) || 0) -
                                    (parseFloat(item.discount) || 0) +
                                    (parseFloat(item.tax) || 0)
                                  ).toFixed(4)}
                                </div>
                              </div>
                              <div className="md:col-span-1 flex justify-center md:justify-center">
                                {row.itemData.length > 1 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => {
                                      const currentItems = watch(`invoiceRows.${rowIndex}.itemData`) || [];
                                      const newItems = currentItems.filter((_, ii) => ii !== itemIndex);
                                      setValue(`invoiceRows.${rowIndex}.itemData`, newItems, { shouldValidate: true });
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 border-t">
                        <Button
                          type="button"
                          onClick={() => addItem(rowIndex)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 flex items-center justify-center gap-2"
                        >
                          <PlusIcon className="h-4 w-4" />
                          Add Item
                        </Button>

                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
                            <span className="font-medium text-gray-700 text-sm sm:text-base">
                              Total:
                            </span>
                            <span className="font-bold text-base sm:text-lg text-gray-900">
                              {(() => {
                                const currentRow = watch(`invoiceRows.${rowIndex}`) || row;
                                const calculatedTotal = (currentRow.itemData || []).reduce((sum, item) => {
                                  const qty = parseFloat(item.qty || "0");
                                  const unitPrice = parseFloat(item.unitPrice || "0");
                                  const discount = parseFloat(item.discount || "0");
                                  const tax = parseFloat(item.tax || "0");
                                  const lineTotal = qty * unitPrice;
                                  const adjusted = lineTotal - discount + tax;
                                  return sum + adjusted;
                                }, 0);
                                return calculatedTotal.toFixed(4);
                              })()}{" "}
                              {useCustomToken
                                ? verifiedToken?.symbol || "TOKEN"
                                : selectedToken?.symbol || "TOKEN"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Clean Form Actions */}
          <div className="flex flex-col items-center gap-4 px-4">
            {/* Consolidated validation message */}
            {(errors.invoiceRows && typeof errors.invoiceRows.message === "string") || validInvoices === 0 ? (
              <div className="w-full max-w-2xl">
                <div className={cn(
                  "border rounded-lg p-4 flex items-start gap-3",
                  errors.invoiceRows && typeof errors.invoiceRows.message === "string"
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200" 
                )}>
                  <AlertTriangle className={cn(
                    "h-5 w-5 flex-shrink-0 mt-0.5",
                    errors.invoiceRows && typeof errors.invoiceRows.message === "string"
                      ? "text-red-500"
                      : "text-yellow-600"
                  )} />
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm font-medium",
                      errors.invoiceRows && typeof errors.invoiceRows.message === "string"
                        ? "text-red-600"
                        : "text-yellow-800"
                    )}>
                      {errors.invoiceRows && typeof errors.invoiceRows.message === "string"
                        ? errors.invoiceRows.message
                        : "Please add at least one valid invoice with client address and items"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <Button
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto px-6 sm:px-8 py-3 text-white text-base sm:text-lg font-semibold"
              type="submit"
              disabled={loading || !isConnected || validInvoices === 0}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Creating {validInvoices} Invoices...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Create {validInvoices} Invoices (Batch)</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateInvoicesBatch;
