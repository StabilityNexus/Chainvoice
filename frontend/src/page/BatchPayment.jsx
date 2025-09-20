// pages/BatchPayment.jsx - Complete Enhanced Version
import React, { useEffect, useState, useRef } from "react";
import { ChainvoiceABI } from "../contractsABI/ChainvoiceABI";
import { BrowserProvider, Contract, ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import html2canvas from "html2canvas";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { decryptToString } from "@lit-protocol/encryption/src/lib/encryption.js";
import { LIT_ABILITY, LIT_NETWORK } from "@lit-protocol/constants";
import {
  createSiweMessageWithRecaps,
    generateAuthSig,
  LitAccessControlConditionResource,
} from "@lit-protocol/auth-helpers";
import { ERC20_ABI } from "../contractsABI/ERC20_ABI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle2,
  Loader2,
  X,
  Eye,
  Download,
  CreditCard,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  Lightbulb,
  Layers,
} from "lucide-react";
import { useTokenList } from "../hooks/useTokenList";
import WalletConnectionAlert from "../components/WalletConnectionAlert";

function BatchPayment() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: walletClient } = useWalletClient();
  const { address, isConnected, chainId } = useAccount();
  const [loading, setLoading] = useState(true);
  const [receivedInvoices, setReceivedInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState(new Set());
  const [batchLoading, setBatchLoading] = useState(false);
  const [fee, setFee] = useState(0);
  const [error, setError] = useState(null);
  const [litReady, setLitReady] = useState(false);
  const litClientRef = useRef(null);
  const [paymentLoading, setPaymentLoading] = useState({});
  const [networkLoading, setNetworkLoading] = useState(false);
  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);
  const [balanceErrors, setBalanceErrors] = useState([]);
  const [batchSuggestions, setBatchSuggestions] = useState([]);

  // Drawer state (exact same as ReceivedInvoice)
  const [drawerState, setDrawerState] = useState({
    open: false,
    selectedInvoice: null,
  });

  // Get tokens from the hook
    const { tokens } = useTokenList(chainId || 1);
    
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Helper function to get token info
  const getTokenInfo = (tokenAddress) => {
    if (!tokens || tokens.length === 0) return null;
    return tokens.find(
      (token) =>
        token.contract_address?.toLowerCase() === tokenAddress?.toLowerCase() ||
        token.address?.toLowerCase() === tokenAddress?.toLowerCase()
    );
  };

  // Helper function to get token symbol
  const getTokenSymbol = (tokenAddress, fallbackSymbol = "TOKEN") => {
    const tokenInfo = getTokenInfo(tokenAddress);
    return tokenInfo?.symbol || fallbackSymbol;
  };

  // Detect batch information from invoice metadata
  const detectBatchFromMetadata = (invoice) => {
    if (invoice.batchInfo) {
      return {
        batchId: invoice.batchInfo.batchId,
        batchSize: invoice.batchInfo.batchSize,
        index: invoice.batchInfo.index,
        batchType: invoice.batchInfo.batchType,
      };
    }
    return null;
  };

  // Find smart batch suggestions
  const findBatchSuggestions = (invoices) => {
    const suggestions = [];

    // Group by sender + same day + same token for unpaid invoices
    const groups = invoices
      .filter((inv) => !inv.isPaid && !inv.isCancelled)
      .reduce((acc, inv) => {
        const issueDate = new Date(inv.issueDate).toDateString();
        const key = `${inv.user?.address}_${
          inv.paymentToken?.address || "ETH"
        }_${issueDate}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(inv);
        return acc;
      }, {});

    // Suggest batches for groups with 2+ invoices
    Object.entries(groups).forEach(([key, invoices]) => {
      if (invoices.length >= 2) {
        const totalAmount = invoices.reduce(
          (sum, inv) => sum + parseFloat(inv.amountDue),
          0
        );
        suggestions.push({
          id: key,
          invoices,
          sender: invoices[0].user,
          token: invoices[0].paymentToken,
          totalAmount,
          reason: `${invoices.length} invoices from same sender on same day`,
          type: "same_day_sender",
        });
      }
    });

    // Also suggest batches by same token type (different approach)
    const tokenGroups = invoices
      .filter((inv) => !inv.isPaid && !inv.isCancelled)
      .reduce((acc, inv) => {
        const tokenAddress = inv.paymentToken?.address || "ETH";
        if (!acc[tokenAddress]) acc[tokenAddress] = [];
        acc[tokenAddress].push(inv);
        return acc;
      }, {});

    Object.entries(tokenGroups).forEach(([tokenAddress, invoices]) => {
      if (invoices.length >= 3) {
        const totalAmount = invoices.reduce(
          (sum, inv) => sum + parseFloat(inv.amountDue),
          0
        );
        const symbol = invoices[0].paymentToken?.symbol || "ETH";
        suggestions.push({
          id: `token_${tokenAddress}`,
          invoices,
          token: invoices[0].paymentToken,
          totalAmount,
          reason: `${invoices.length} invoices payable in ${symbol}`,
          type: "same_token",
        });
      }
    });

    return suggestions;
  };

  // Balance check function
  const checkPaymentCapability = async (group, signer) => {
    const { tokenAddress, symbol, invoices, totalAmount } = group;
    const userAddress = await signer.getAddress();

    if (tokenAddress === ethers.ZeroAddress) {
      // Check ETH balance
      const balance = await signer.provider.getBalance(userAddress);
      const totalFee = BigInt(fee) * BigInt(invoices.length);
      const totalRequired =
        ethers.parseUnits(totalAmount.toString(), 18) + totalFee;

      if (balance < totalRequired) {
        throw new Error(
          `Insufficient ETH balance. Required: ${ethers.formatEther(
            totalRequired
          )} ETH, Available: ${ethers.formatEther(balance)} ETH`
        );
      }
    } else {
      // Check ERC20 balance
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
      const balance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      const requiredAmount = ethers.parseUnits(
        totalAmount.toString(),
        decimals
      );

      if (balance < requiredAmount) {
        const availableFormatted = ethers.formatUnits(balance, decimals);
        throw new Error(
          `Insufficient ${symbol} balance. Required: ${totalAmount} ${symbol}, Available: ${availableFormatted} ${symbol}`
        );
      }

      // Check ETH balance for fees
      const ethBalance = await signer.provider.getBalance(userAddress);
      const totalFee = BigInt(fee) * BigInt(invoices.length);

      if (ethBalance < totalFee) {
        throw new Error(
          `Insufficient ETH for fees. Required: ${ethers.formatEther(
            totalFee
          )} ETH, Available: ${ethers.formatEther(ethBalance)} ETH`
        );
      }
    }
  };

  // Select batch suggestion
  const selectBatchSuggestion = (suggestion) => {
    const invoiceIds = suggestion.invoices.map((inv) => inv.id);
    setSelectedInvoices(new Set(invoiceIds));
    toast.success(`Selected ${invoiceIds.length} invoices for batch payment`);
  };

  // Pay entire batch by batch ID
  const payEntireBatch = async (batchId) => {
    const batchInvoices = receivedInvoices.filter(
      (inv) =>
        inv.batchInfo?.batchId === batchId && !inv.isPaid && !inv.isCancelled
    );

    if (batchInvoices.length === 0) {
      toast.error("No unpaid invoices found in this batch");
      return;
    }

    setSelectedInvoices(new Set(batchInvoices.map((inv) => inv.id)));
    toast.info(
      `Selected ${batchInvoices.length} invoices from batch #${batchId}`
    );

    // Auto-trigger batch payment after selection
    setTimeout(() => {
      handleBatchPayment();
    }, 1000);
  };

  // Batch selection handlers
  const handleSelectInvoice = (invoiceId) => {
    const invoice = receivedInvoices.find((inv) => inv.id === invoiceId);
    if (invoice?.isPaid || invoice?.isCancelled) return;

    setSelectedInvoices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(invoiceId)) {
        newSet.delete(invoiceId);
      } else {
        newSet.add(invoiceId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const unpaidInvoices = receivedInvoices.filter(
      (inv) => !inv.isPaid && !inv.isCancelled
    );
    setSelectedInvoices(new Set(unpaidInvoices.map((inv) => inv.id)));
  };

  const handleClearAll = () => {
    setSelectedInvoices(new Set());
  };

  // Group selected invoices by token
  const getGroupedInvoices = () => {
    const grouped = new Map();

    receivedInvoices.forEach((invoice) => {
      if (!selectedInvoices.has(invoice.id)) return;

      const tokenAddress = invoice.paymentToken?.address || ethers.ZeroAddress;
      const tokenKey = `${tokenAddress}_${
        invoice.paymentToken?.symbol || "ETH"
      }`;

      if (!grouped.has(tokenKey)) {
        grouped.set(tokenKey, {
          tokenAddress,
          symbol: invoice.paymentToken?.symbol || "ETH",
          logo: invoice.paymentToken?.logo,
          decimals: invoice.paymentToken?.decimals || 18,
          invoices: [],
          totalAmount: 0,
        });
      }

      const group = grouped.get(tokenKey);
      group.invoices.push(invoice);
      group.totalAmount += parseFloat(invoice.amountDue);
    });

    return grouped;
  };

  // Initialize Lit Protocol
  useEffect(() => {
    const initLit = async () => {
      try {
        setLoading(true);
        if (!litClientRef.current) {
          const client = new LitNodeClient({
            litNetwork: LIT_NETWORK.DatilDev,
            debug: false,
          });
          await client.connect();
          litClientRef.current = client;
          setLitReady(true);
        }
      } catch (error) {
        console.error("Error initializing Lit client:", error);
      } finally {
        setLoading(false);
      }
    };
    initLit();
  }, []);

  useEffect(() => {
    setShowWalletAlert(!isConnected);
  }, [isConnected]);

  // Fetch invoices with batch awareness
  useEffect(() => {
    if (!walletClient || !address || !litReady) return;

    const fetchReceivedInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        if (network.chainId != 11155111) {
          setError(
            `You're connected to ${network.name}. Please switch to Sepolia network to view your invoices.`
          );
          setLoading(false);
          return;
        }

        const litNodeClient = litClientRef.current;
        if (!litNodeClient) {
          alert("Lit client not initialized");
          return;
        }

        const contract = new Contract(
          import.meta.env.VITE_CONTRACT_ADDRESS,
          ChainvoiceABI,
          signer
        );

        const res = await contract.getReceivedInvoices(address);

        if (!res || !Array.isArray(res) || res.length === 0) {
          setReceivedInvoices([]);
          setLoading(false);
          return;
        }

        const decryptedInvoices = [];

        for (const invoice of res) {
          try {
            const id = invoice[0];
            const from = invoice[1].toLowerCase();
            const to = invoice[2].toLowerCase();
            const isPaid = invoice[5];
            const isCancelled = invoice[6];
            const encryptedStringBase64 = invoice[7];
            const dataToEncryptHash = invoice[8];

            if (!encryptedStringBase64 || !dataToEncryptHash) continue;

            const currentUserAddress = address.toLowerCase();
            if (currentUserAddress !== from && currentUserAddress !== to) {
              continue;
            }

            const ciphertext = atob(encryptedStringBase64);
            const accessControlConditions = [
              {
                contractAddress: "",
                standardContractType: "",
                chain: "ethereum",
                method: "",
                parameters: [":userAddress"],
                returnValueTest: {
                  comparator: "=",
                  value: from,
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
                  value: to,
                },
              },
            ];

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
                  walletAddress: address,
                  nonce,
                  litNodeClient,
                });
                return await generateAuthSig({ signer, toSign });
              },
            });

            const decryptedString = await decryptToString(
              {
                accessControlConditions,
                chain: "ethereum",
                ciphertext,
                dataToEncryptHash,
                sessionSigs,
              },
              litNodeClient
            );

            const parsed = JSON.parse(decryptedString);
            parsed["id"] = id;
            parsed["isPaid"] = isPaid;
            parsed["isCancelled"] = isCancelled;

            // Detect batch information
            const batchInfo = detectBatchFromMetadata(parsed);
            if (batchInfo) {
              parsed.batchInfo = batchInfo;
            }

            // Enhanced token info
            if (parsed.paymentToken?.address) {
              const tokenInfo = getTokenInfo(parsed.paymentToken.address);
              if (tokenInfo) {
                parsed.paymentToken = {
                  ...parsed.paymentToken,
                  logo: tokenInfo.image || tokenInfo.logo,
                  decimals: tokenInfo.decimals || parsed.paymentToken.decimals,
                  name: tokenInfo.name || parsed.paymentToken.name,
                  symbol: tokenInfo.symbol || parsed.paymentToken.symbol,
                };
              } else {
                try {
                  const tokenContract = new ethers.Contract(
                    parsed.paymentToken.address,
                    ERC20_ABI,
                    provider
                  );

                  const [symbol, name, decimals] = await Promise.all([
                    tokenContract
                      .symbol()
                      .catch(() => parsed.paymentToken.symbol || "UNKNOWN"),
                    tokenContract
                      .name()
                      .catch(() => parsed.paymentToken.name || "Unknown Token"),
                    tokenContract
                      .decimals()
                      .catch(() => parsed.paymentToken.decimals || 18),
                  ]);

                  parsed.paymentToken = {
                    ...parsed.paymentToken,
                    symbol,
                    name,
                    decimals: Number(decimals),
                    logo: "/tokenImages/generic.png",
                  };
                } catch (error) {
                  console.error("Failed to fetch token info:", error);
                  parsed.paymentToken.logo =
                    parsed.paymentToken.logo || "/tokenImages/generic.png";
                }
              }
            }

            decryptedInvoices.push(parsed);
          } catch (err) {
            console.error(`Error processing invoice ${invoice[0]}:`, err);
          }
        }

        setReceivedInvoices(decryptedInvoices);

        // Generate batch suggestions
        const suggestions = findBatchSuggestions(decryptedInvoices);
        setBatchSuggestions(suggestions);

        const fee = await contract.fee();
        setFee(fee);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedInvoices();
  }, [walletClient, litReady, address, tokens]);

  // ENHANCED Batch payment function with pre-checks
  const handleBatchPayment = async () => {
    if (!walletClient || selectedInvoices.size === 0) return;

    setBatchLoading(true);
    setBalanceErrors([]);

    try {
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ChainvoiceABI,
        signer
      );

      const grouped = getGroupedInvoices();

      // PRE-CHECK ALL BALANCES BEFORE ANY TRANSACTIONS
      toast.info("Checking balances...");
      const errors = [];

      for (const [tokenKey, group] of grouped.entries()) {
        try {
          await checkPaymentCapability(group, signer);
        } catch (error) {
          errors.push(`${group.symbol}: ${error.message}`);
        }
      }

      if (errors.length > 0) {
        setBalanceErrors(errors);
        toast.error(
          "Insufficient balance detected. Please check the errors above."
        );
        setBatchLoading(false);
        return;
      }

      toast.success("Balance checks passed! Processing payments...");

      // Process payments only after all checks pass
      for (const [tokenKey, group] of grouped.entries()) {
        const { tokenAddress, symbol, decimals, invoices } = group;
        const invoiceIds = invoices.map((inv) => BigInt(inv.id));

        if (invoiceIds.length > 50) {
          throw new Error(
            `Batch size limit exceeded for ${symbol}. Max 50 invoices per batch.`
          );
        }

        // Calculate total amount for this batch
        let totalAmount = BigInt(0);
        for (const invoice of invoices) {
          const amount = ethers.parseUnits(
            invoice.amountDue.toString(),
            decimals
          );
          totalAmount += amount;
        }

        // Get fee per invoice
        const feePerInvoice = await contract.fee();
        const totalFee = feePerInvoice * BigInt(invoiceIds.length);

        const isNativeToken = tokenAddress === ethers.ZeroAddress;

        if (!isNativeToken) {
          // For ERC20 tokens: Check and approve allowance
          const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);

          const currentAllowance = await tokenContract.allowance(
            await signer.getAddress(),
            import.meta.env.VITE_CONTRACT_ADDRESS
          );

          if (currentAllowance < totalAmount) {
            toast.info(`Approving ${symbol} for spending...`);
            const approveTx = await tokenContract.approve(
              import.meta.env.VITE_CONTRACT_ADDRESS,
              totalAmount
            );
            await approveTx.wait();
            toast.success(`${symbol} approved successfully!`);
          }

          // Pay batch with ERC20 token (fee paid in ETH)
          const tx = await contract.payInvoicesBatch(invoiceIds, {
            value: totalFee, // Only fee in ETH
          });

          await tx.wait();
          toast.success(
            `Successfully paid ${invoices.length} invoices with ${symbol}!`
          );
        } else {
          // Pay batch with native ETH (total amount + fees)
          const tx = await contract.payInvoicesBatch(invoiceIds, {
            value: totalAmount + totalFee, // Total amount + fees in ETH
          });

          await tx.wait();
          toast.success(
            `Successfully paid ${invoices.length} invoices with ETH!`
          );
        }

        // Update invoice statuses locally
        const updatedInvoices = receivedInvoices.map((inv) =>
          invoiceIds.some((id) => id === BigInt(inv.id))
            ? { ...inv, isPaid: true }
            : inv
        );
        setReceivedInvoices(updatedInvoices);
      }

      setSelectedInvoices(new Set());
      toast.success("All batch payments completed successfully!");
    } catch (error) {
      console.error("Batch payment error details:", {
        error: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data,
      });

      if (error.code === "ACTION_REJECTED") {
        toast.error("Transaction was rejected by user");
      } else if (error.message.includes("insufficient")) {
        toast.error("Insufficient balance for this transaction");
      } else if (error.message.includes("Batch size")) {
        toast.error(error.message);
      } else {
        toast.error(`Batch payment failed: ${error.reason || error.message}`);
      }
    } finally {
      setBatchLoading(false);
    }
  };

  // Individual payment function (same as ReceivedInvoice)
  const payInvoice = async (invoiceId, amountDue, tokenAddress) => {
    if (!walletClient) {
      console.error("Wallet not connected");
      return;
    }

    setPaymentLoading((prev) => ({ ...prev, [invoiceId]: true }));

    try {
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ChainvoiceABI,
        signer
      );
      const invoice = receivedInvoices.find((inv) => inv.id === invoiceId);
      if (invoice?.isCancelled) {
        throw new Error("Cannot pay a cancelled invoice");
      }
      const fee = await contract.fee();
      const isNativeToken = tokenAddress === ethers.ZeroAddress;

      if (!ethers.isAddress(tokenAddress)) {
        throw new Error(`Invalid token address: ${tokenAddress}`);
      }

      const tokenSymbol = getTokenSymbol(tokenAddress, "Token");

      if (!isNativeToken) {
        const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);

        const currentAllowance = await tokenContract.allowance(
          await signer.getAddress(),
          import.meta.env.VITE_CONTRACT_ADDRESS
        );

        const decimals = await tokenContract.decimals();
        const amountDueInWei = ethers.parseUnits(String(amountDue), decimals);

        if (currentAllowance < amountDueInWei) {
          const approveTx = await tokenContract.approve(
            import.meta.env.VITE_CONTRACT_ADDRESS,
            amountDueInWei
          );

          await approveTx.wait();
          alert(
            `Approval for ${tokenSymbol} completed! Now processing payment...`
          );
        }

        const tx = await contract.payInvoice(BigInt(invoiceId), {
          value: fee,
        });

        await tx.wait();
        alert(`Payment successful in ${tokenSymbol}!`);
      } else {
        const amountDueInWei = ethers.parseUnits(String(amountDue), 18);
        const total = amountDueInWei + BigInt(fee);

        const tx = await contract.payInvoice(BigInt(invoiceId), {
          value: total,
        });

        await tx.wait();
        alert("Payment successful in ETH!");
      }

      // Refresh invoice status
      const updatedInvoices = receivedInvoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, isPaid: true } : inv
      );
      setReceivedInvoices(updatedInvoices);
    } catch (error) {
      console.error("Payment failed:", error);
      if (error.code === "ACTION_REJECTED") {
        toast.error("Transaction was rejected by user");
      } else if (error.message.includes("insufficient balance")) {
        toast.error("Insufficient balance for this transaction");
      } else if (error.message.includes("cancelled")) {
        toast.error("Cannot pay a cancelled invoice");
      } else {
        toast.error(`Payment failed: ${error.reason || error.message}`);
      }
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [invoiceId]: false }));
    }
  };

  // Drawer functions (exact same as ReceivedInvoice)
  const toggleDrawer = (invoice) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerState({
      open: !drawerState.open,
      selectedInvoice: invoice || null,
    });
  };

  const handlePrint = async () => {
    const element = document.getElementById("invoice-print");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = `invoice-${drawerState.selectedInvoice.id}.png`;
    link.href = data;
    link.click();
  };

  const switchNetwork = async () => {
    try {
      setNetworkLoading(true);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
      });
      setError(null);
    } catch (error) {
      console.error("Network switch failed:", error);
      alert("Failed to switch network. Please switch to Sepolia manually.");
    } finally {
      setNetworkLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 10)}...${address.substring(
      address.length - 10
    )}`;
  };

  const formatDate = (issueDate) => {
    const date = new Date(issueDate);
    return date.toLocaleString();
  };

  const unpaidInvoices = receivedInvoices.filter(
    (inv) => !inv.isPaid && !inv.isCancelled
  );
  const selectedCount = selectedInvoices.size;
  const grouped = getGroupedInvoices();

  return (
    <>
      <div className="flex justify-center">
        <WalletConnectionAlert
          show={showWalletAlert}
          message="Connect your wallet to pay multiple invoices"
          onDismiss={() => setShowWalletAlert(false)}
        />
      </div>
      <div className=" md:p-6 ">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white">Batch Payment</h2>
              <p className=" text-gray-50">
                Select and pay multiple invoices in one transaction
              </p>
            </div>
            {error && (
              <button
                onClick={switchNetwork}
                disabled={networkLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {networkLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Switching...
                  </>
                ) : (
                  "Switch to Sepolia"
                )}
              </button>
            )}
          </div>

          {/* Balance Error Alerts */}
          {balanceErrors.length > 0 && (
            <div className="mb-4 bg-red-900 border border-red-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-red-200">
                  Insufficient Balance Detected
                </span>
              </div>
              <div className="space-y-1">
                {balanceErrors.map((error, index) => (
                  <div key={index} className="text-red-300 text-sm">
                    • {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Batch Suggestions */}
          {batchSuggestions.length > 0 && (
            <div className="mb-6 bg-blue-900 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-blue-200">
                  💡 Smart Batch Suggestions
                </span>
              </div>
              <div className="space-y-3">
                {batchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between bg-blue-800 p-3 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-white">
                        {suggestion.invoices.length} invoices
                        {suggestion.sender
                          ? ` from ${suggestion.sender.fname}`
                          : ""}
                      </span>
                      <span className="text-blue-200 text-sm ml-2">
                        ({suggestion.reason})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-200">
                        {suggestion.totalAmount.toFixed(4)}{" "}
                        {suggestion.token?.symbol || "ETH"}
                      </span>
                      <button
                        onClick={() => selectBatchSuggestion(suggestion)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Select & Pay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batch Actions Panel */}
          {unpaidInvoices.length > 0 && (
            <div className="mb-6 p-4 bg-gray-900 rounded-lg shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-400" />
                  <span className="text-lg font-semibold text-white">
                    Batch Payment
                  </span>
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    {selectedCount} selected
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    disabled={unpaidInvoices.length === 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Select All ({unpaidInvoices.length})
                  </button>
                  <button
                    onClick={handleClearAll}
                    disabled={selectedCount === 0}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              {/* Payment Summary */}
              {selectedCount > 0 && (
                <>
                  <div className="border-t border-gray-600 pt-4 mb-4">
                    <h4 className="font-semibold text-lg text-white mb-3">
                      Payment Summary:
                    </h4>
                    <div className="space-y-2">
                      {Array.from(grouped.entries()).map(
                        ([tokenKey, group]) => (
                          <div
                            key={tokenKey}
                            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {group.logo ? (
                                <img
                                  src={group.logo}
                                  alt={group.symbol}
                                  className="w-6 h-6"
                                  onError={(e) => {
                                    e.target.src = "/tokenImages/generic.png";
                                  }}
                                />
                              ) : (
                                <DollarSign className="w-6 h-6 text-gray-400" />
                              )}
                              <span className="font-medium text-white">
                                {group.symbol}
                              </span>
                              <span className="text-gray-400">
                                ({group.invoices.length} invoices)
                              </span>
                            </div>
                            <span className="font-bold text-green-400">
                              {group.totalAmount.toFixed(6)} {group.symbol}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleBatchPayment}
                    disabled={batchLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {batchLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Batch Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay {selectedCount} Selected Invoices
                      </>
                    )}
                  </button>
                </>
              )}

              {selectedCount === 0 && (
                <div className="bg-blue-900 border border-blue-700 text-blue-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>
                      Select one or more unpaid invoices to enable batch payment
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Invoices Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Loading invoices...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            ) : receivedInvoices.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No Invoices Found
                  </h3>
                  <p className="text-gray-600">
                    You don't have any received invoices yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={
                            selectedCount === unpaidInvoices.length &&
                            unpaidInvoices.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleSelectAll();
                            } else {
                              handleClearAll();
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {receivedInvoices
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((invoice) => (
                        <tr
                          key={invoice.id}
                          className={`hover:bg-gray-50 ${
                            selectedInvoices.has(invoice.id)
                              ? "bg-green-50"
                              : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedInvoices.has(invoice.id)}
                              onChange={() => handleSelectInvoice(invoice.id)}
                              disabled={invoice.isPaid || invoice.isCancelled}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-blue-600">
                                  {invoice.user?.fname?.charAt(0) || "C"}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {invoice.user?.fname} {invoice.user?.lname}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {invoice.user?.email}
                                </div>
                                {/* Batch indicator */}
                                {invoice.batchInfo && (
                                  <div className="mt-1 flex items-center">
                                    <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                      <Layers className="w-3 h-3" />
                                      Batch #
                                      {invoice.batchInfo.batchId.slice(-4)}(
                                      {invoice.batchInfo.index + 1}/
                                      {invoice.batchInfo.batchSize})
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                              {formatAddress(invoice.user?.address)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end">
                              {invoice.paymentToken?.logo ? (
                                <img
                                  src={invoice.paymentToken.logo}
                                  alt={invoice.paymentToken.symbol}
                                  className="w-5 h-5 mr-2"
                                  onError={(e) => {
                                    e.target.src = "/tokenImages/generic.png";
                                  }}
                                />
                              ) : (
                                <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                              )}
                              <span className="font-medium">
                                {invoice.amountDue}{" "}
                                {invoice.paymentToken?.symbol}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {invoice.isCancelled ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <X className="w-3 h-3 mr-1" />
                                Cancelled
                              </span>
                            ) : invoice.isPaid ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Unpaid
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(invoice.issueDate)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={toggleDrawer(invoice)}
                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>

                              {/* Pay Entire Batch Button */}
                              {invoice.batchInfo &&
                                !invoice.isPaid &&
                                !invoice.isCancelled && (
                                  <button
                                    onClick={() =>
                                      payEntireBatch(invoice.batchInfo.batchId)
                                    }
                                    className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200 transition-colors"
                                  >
                                    <Layers className="w-4 h-4 mr-1" />
                                    Pay Batch ({invoice.batchInfo.batchSize})
                                  </button>
                                )}

                              {!invoice.isPaid && !invoice.isCancelled && (
                                <button
                                  onClick={() =>
                                    payInvoice(
                                      invoice.id,
                                      invoice.amountDue,
                                      invoice.paymentToken?.address ??
                                        ethers.ZeroAddress
                                    )
                                  }
                                  disabled={paymentLoading[invoice.id]}
                                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                                    paymentLoading[invoice.id]
                                      ? "bg-gray-300 text-gray-600"
                                      : "bg-green-600 hover:bg-green-700 text-white"
                                  }`}
                                >
                                  {paymentLoading[invoice.id] ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                      Processing...
                                    </>
                                  ) : (
                                    "Pay Now"
                                  )}
                                </button>
                              )}
                              {invoice.isCancelled && (
                                <button
                                  disabled={true}
                                  className="px-3 py-1 rounded-md text-sm font-medium flex items-center bg-gray-300 text-gray-600"
                                >
                                  Cancelled
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {receivedInvoices.length > rowsPerPage && (
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">
                    Showing {page * rowsPerPage + 1} to{" "}
                    {Math.min(
                      (page + 1) * rowsPerPage,
                      receivedInvoices.length
                    )}{" "}
                    of {receivedInvoices.length} results
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={
                      (page + 1) * rowsPerPage >= receivedInvoices.length
                    }
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Detail Drawer - EXACT SAME AS RECEIVED INVOICE */}
        <SwipeableDrawer
          anchor="right"
          open={drawerState.open}
          onClose={toggleDrawer(null)}
          onOpen={toggleDrawer(null)}
          PaperProps={{
            sx: { width: { xs: "100%", sm: "800px" }, p: 3 },
          }}
        >
          {drawerState.selectedInvoice && (
            <>
              <div
                id="invoice-print"
                className="bg-white p-6 rounded-lg shadow-none"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <img src="/logo.png" alt="Chainvoice" className="h-8" />
                      <p className="text-3xl font-bold text-green-500">
                        Cha
                        <span className="text-3xl font-bold text-gray-600">
                          in
                        </span>
                        voice
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      Powered by Chainvoice
                    </p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">
                      INVOICE
                    </h1>
                    <p className="text-gray-600 text-sm">
                      #
                      {drawerState.selectedInvoice.id
                        .toString()
                        .padStart(6, "0")}
                    </p>
                    <div className="mt-2">
                      {drawerState.selectedInvoice.isCancelled ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X className="w-3 h-3 mr-1" />
                          CANCELLED
                        </span>
                      ) : drawerState.selectedInvoice.isPaid ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          UNPAID
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {drawerState.selectedInvoice.isCancelled && (
                  <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-start">
                      <div>
                        <div className="font-medium text-red-800">
                          Invoice Cancelled by{" "}
                          {drawerState.selectedInvoice.user?.fname ||
                            "The sender"}{" "}
                          {drawerState.selectedInvoice.user?.lname || ""}{" "}
                        </div>
                        <div className="text-red-600 mt-2 text-sm">
                          You no longer need to make payment for this invoice.
                        </div>
                      </div>
                    </div>

                    {!drawerState.selectedInvoice.isPaid && (
                      <div className="mt-2 pt-2 border-t border-red-100">
                        <div className="text-red-500 text-xs">
                          Note: This invoice was cancelled before payment was
                          completed
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      From
                    </h3>
                    <p className="font-medium">
                      {drawerState.selectedInvoice.user.fname}{" "}
                      {drawerState.selectedInvoice.user.lname}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {drawerState.selectedInvoice.user.address}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {drawerState.selectedInvoice.user.city},{" "}
                      {drawerState.selectedInvoice.user.country},{" "}
                      {drawerState.selectedInvoice.user.postalcode}
                    </p>
                    <p className="text-blue-500 text-sm mt-1">
                      {drawerState.selectedInvoice.user.email}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Bill To
                    </h3>
                    <p className="font-medium">
                      {drawerState.selectedInvoice.client.fname}{" "}
                      {drawerState.selectedInvoice.client.lname}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {drawerState.selectedInvoice.client.address}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {drawerState.selectedInvoice.client.city},{" "}
                      {drawerState.selectedInvoice.client.country},{" "}
                      {drawerState.selectedInvoice.client.postalcode}
                    </p>
                    <p className="text-blue-500 text-sm mt-1">
                      {drawerState.selectedInvoice.client.email}
                    </p>
                  </div>
                </div>

                <div className=" p-4 rounded-lg mb-6 border border-gray-200">
                  <h3 className="text-base font-bold text-gray-700  ">
                    Payment Currency
                  </h3>
                  <div className="mt-2 flex items-center">
                    {drawerState.selectedInvoice.paymentToken?.logo ? (
                      <img
                        src={drawerState.selectedInvoice.paymentToken.logo}
                        alt={drawerState.selectedInvoice.paymentToken.symbol}
                        className="w-6 h-6 mr-2"
                        onError={(e) => {
                          e.target.src = "/tokenImages/generic.png";
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                        <DollarSign className="text-gray-500 w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {drawerState.selectedInvoice.paymentToken?.name ||
                          "Ether "}
                        {"("}
                        {drawerState.selectedInvoice.paymentToken?.symbol ||
                          "ETH"}
                        {")"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {drawerState.selectedInvoice.paymentToken?.address
                          ? `${drawerState.selectedInvoice.paymentToken.address.substring(
                              0,
                              10
                            )}......${drawerState.selectedInvoice.paymentToken.address.substring(
                              33
                            )}`
                          : "Native Currency"}
                      </p>
                    </div>
                  </div>
                  {drawerState.selectedInvoice.paymentToken?.address && (
                    <div className="mt-2 text-xs text-gray-600">
                      <p>
                        Decimals:{" "}
                        {drawerState.selectedInvoice.paymentToken.decimals ||
                          18}
                      </p>
                      <p>Chain: Sepolia Testnet</p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>
                      Issued:{" "}
                      {new Date(
                        drawerState.selectedInvoice.issueDate
                      ).toLocaleDateString()}
                    </span>
                    <span>
                      Due:{" "}
                      {new Date(
                        drawerState.selectedInvoice.dueDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-sm font-medium text-gray-700">
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Discount</th>
                        <th className="p-3 text-right">Tax</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {drawerState.selectedInvoice.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="p-3 text-sm">{item.description}</td>
                          <td className="p-3 text-sm text-right">{item.qty}</td>
                          <td className="p-3 text-sm text-right">
                            {item.unitPrice}{" "}
                            {drawerState.selectedInvoice.paymentToken?.symbol}
                          </td>
                          <td className="p-3 text-sm text-right">
                            {item.discount || "0"}
                          </td>
                          <td className="p-3 text-sm text-right">
                            {item.tax || "0%"}
                          </td>
                          <td className="p-3 text-sm font-medium text-right">
                            {item.amount}{" "}
                            {drawerState.selectedInvoice.paymentToken?.symbol}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {drawerState.selectedInvoice.amountDue}{" "}
                      {drawerState.selectedInvoice.paymentToken?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Network Fee:</span>
                    <span className="font-medium">
                      {ethers.formatUnits(fee)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-lg">
                      {drawerState.selectedInvoice.paymentToken?.symbol ===
                      "ETH"
                        ? `${(
                            parseFloat(drawerState.selectedInvoice.amountDue) +
                            parseFloat(ethers.formatUnits(fee))
                          ).toFixed(6)} ETH`
                        : `${drawerState.selectedInvoice.amountDue} ${
                            drawerState.selectedInvoice.paymentToken?.symbol
                          } + ${ethers.formatUnits(fee)} ETH`}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={toggleDrawer(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </>
          )}
        </SwipeableDrawer>
      </div>
    </>
  );
}

export default BatchPayment;
