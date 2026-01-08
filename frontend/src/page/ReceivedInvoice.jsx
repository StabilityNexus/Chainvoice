import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ChainvoiceABI } from "@/contractsABI/ChainvoiceABI";
import { BrowserProvider, Contract, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import DescriptionIcon from "@mui/icons-material/Description";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { decryptToString } from "@lit-protocol/encryption/src/lib/encryption.js";
import { LIT_ABILITY, LIT_NETWORK } from "@lit-protocol/constants";
import {
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitAccessControlConditionResource,
} from "@lit-protocol/auth-helpers";
import { ERC20_ABI } from "@/contractsABI/ERC20_ABI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  CircularProgress,
  Skeleton,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Typography,
  Checkbox,
  Button,
  Box,
  Divider,
  Alert,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/CheckCircle";
import UnpaidIcon from "@mui/icons-material/Pending";
import DownloadIcon from "@mui/icons-material/Download";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PaymentIcon from "@mui/icons-material/Payment";
import WarningIcon from "@mui/icons-material/Warning";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LayersIcon from "@mui/icons-material/Layers";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import { useTokenList } from "@/hooks/useTokenList";
import WalletConnectionAlert from "@/components/WalletConnectionAlert";

const columns = [
  { id: "select", label: "", minWidth: 50 },
  { id: "fname", label: "Client", minWidth: 120 },
  { id: "to", label: "Sender", minWidth: 150 },
  { id: "amountDue", label: "Amount", minWidth: 100, align: "right" },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "date", label: "Date", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 150 },
];

function ReceivedInvoice() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: walletClient } = useWalletClient();
  const { address, isConnected, chainId } = useAccount();
  const [loading, setLoading] = useState(true);
  const [receivedInvoices, setReceivedInvoice] = useState([]);
  const [fee, setFee] = useState(0);
  const [error, setError] = useState(null);
  const [litReady, setLitReady] = useState(false);
  const litClientRef = useRef(null);
  const [paymentLoading, setPaymentLoading] = useState({});
  const [networkLoading, setNetworkLoading] = useState(false);
  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);

  // Error handling states
  const [paymentError, setPaymentError] = useState("");
  const [showPaymentError, setShowPaymentError] = useState(false);

  // Batch payment states
  const [selectedInvoices, setSelectedInvoices] = useState(new Set());
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchSuggestions, setBatchSuggestions] = useState([]);

  // Drawer state
  const [drawerState, setDrawerState] = useState({
    open: false,
    selectedInvoice: null,
  });

  const { tokens } = useTokenList(chainId || 1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // UNIFORM ERROR HANDLER
  const getDetailedErrorMessage = (error) => {
    if (error.code === "CALL_EXCEPTION") {
      if (error.reason === "missing revert data" || !error.reason) {
        return "Transaction failed. This may be due to insufficient balance, contract issues, or network problems. Please check your balance and try again.";
      }
      return `Transaction failed: ${error.reason}`;
    }

    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      return "Transaction was cancelled by user";
    }

    if (
      error.message?.includes("insufficient balance") ||
      error.message?.includes("insufficient funds")
    ) {
      return "Insufficient balance to complete this transaction";
    }

    if (
      error.message?.includes("User rejected") ||
      error.message?.includes("User denied")
    ) {
      return "Transaction was rejected in wallet";
    }

    if (error.message?.includes("network") || error.code === "NETWORK_ERROR") {
      return "Network error. Please check your connection and try again";
    }

    if (error.message?.includes("gas")) {
      return "Transaction failed due to gas estimation error. Please try again";
    }

    if (
      error.message?.includes("cancelled") ||
      error.message?.includes("cancel")
    ) {
      return "Cannot pay a cancelled invoice";
    }

    if (error.reason && error.reason !== "missing revert data") {
      return `Transaction failed: ${error.reason}`;
    }

    if (error.message) {
      const cleanMessage = error.message
        .replace(
          /\(action="[^"]*", data=[^,]*, reason=[^,]*, transaction=\{[^}]*\}, invocation=[^,]*, revert=[^,]*, code=[^,]*, version=[^)]*\)/g,
          ""
        )
        .replace(/missing revert data/g, "transaction execution failed")
        .trim();
      return (
        cleanMessage || "Payment failed. Please try again or contact support"
      );
    }

    return "Payment failed. Please try again or contact support";
  };

  // Helper functions
  const getTokenInfo = (tokenAddress) => {
    if (!tokens || tokens.length === 0) return null;
    return tokens.find(
      (token) =>
        token.contract_address?.toLowerCase() === tokenAddress?.toLowerCase() ||
        token.address?.toLowerCase() === tokenAddress?.toLowerCase()
    );
  };

  const getTokenSymbol = (tokenAddress, fallbackSymbol = "TOKEN") => {
    const tokenInfo = getTokenInfo(tokenAddress);
    return tokenInfo?.symbol || fallbackSymbol;
  };

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

  const findBatchSuggestions = (invoices) => {
    const suggestions = [];
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

    return suggestions;
  };

  // UNIFORM BALANCE CHECK
  const checkBalance = async (tokenAddress, amount, symbol, signer) => {
    const userAddress = await signer.getAddress();

    if (tokenAddress === ethers.ZeroAddress) {
      const balance = await signer.provider.getBalance(userAddress);
      const totalRequired =
        ethers.parseUnits(amount.toString(), 18) + BigInt(fee);

      if (balance < totalRequired) {
        const requiredEth = ethers.formatEther(totalRequired);
        const availableEth = ethers.formatEther(balance);
        throw new Error(
          `Insufficient ETH balance. Required: ${requiredEth} ETH, Available: ${availableEth} ETH`
        );
      }
    } else {
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
      const balance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      const requiredAmount = ethers.parseUnits(amount.toString(), decimals);

      if (balance < requiredAmount) {
        const availableFormatted = ethers.formatUnits(balance, decimals);
        throw new Error(
          `Insufficient ${symbol} balance. Required: ${amount} ${symbol}, Available: ${availableFormatted} ${symbol}`
        );
      }

      const ethBalance = await signer.provider.getBalance(userAddress);
      if (ethBalance < BigInt(fee)) {
        const requiredEthFee = ethers.formatEther(fee);
        const availableEth = ethers.formatEther(ethBalance);
        throw new Error(
          `Insufficient ETH for fees. Required: ${requiredEthFee} ETH, Available: ${availableEth} ETH`
        );
      }
    }
  };

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

  // Auto-dismiss error
  useEffect(() => {
    if (!showPaymentError) return;
    const timer = setTimeout(() => {
      setShowPaymentError(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [showPaymentError]);

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

  const selectBatchSuggestion = (suggestion) => {
    const invoiceIds = suggestion.invoices.map((inv) => inv.id);
    setSelectedInvoices(new Set(invoiceIds));
    toast.success(`Selected ${invoiceIds.length} invoices for batch payment`);
  };

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

    setTimeout(() => {
      handleBatchPayment();
    }, 1000);
  };

  // UNIFORM INDIVIDUAL PAYMENT
  const payInvoice = async (invoiceId, amountDue, tokenAddress) => {
    if (!walletClient) {
      setPaymentError(
        "Wallet not connected. Please connect your wallet and try again."
      );
      setShowPaymentError(true);
      return;
    }

    setPaymentLoading((prev) => ({ ...prev, [invoiceId]: true }));
    setPaymentError("");
    setShowPaymentError(false);

    try {
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contractAddress = import.meta.env[
        `VITE_CONTRACT_ADDRESS_${chainId}`
      ];

      if (!contractAddress) {
        throw new Error("Unsupported network");
      }

      const contract = new Contract(contractAddress, ChainvoiceABI, signer);

      const invoice = receivedInvoices.find((inv) => inv.id === invoiceId);
      if (invoice?.isCancelled) {
        throw new Error("Cannot pay a cancelled invoice");
      }

      const fee = await contract.fee();
      const isNativeToken = tokenAddress === ethers.ZeroAddress;
      const tokenSymbol = getTokenSymbol(tokenAddress, "Token");

      // BALANCE CHECK (same as batch)
      try {
        await checkBalance(tokenAddress, amountDue, tokenSymbol, signer);
        toast.success("Balance check passed! Processing payment...");
      } catch (balanceError) {
        setPaymentError(balanceError.message);
        setShowPaymentError(true);
        return;
      }

      if (!isNativeToken) {
        const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
        const contractAddress = import.meta.env[
          `VITE_CONTRACT_ADDRESS_${chainId}`
        ];

        if (!contractAddress) {
          throw new Error("Unsupported network");
        }
        const currentAllowance = await tokenContract.allowance(
          await signer.getAddress(),
          contractAddress
        );

        const decimals = await tokenContract.decimals();
        const amountDueInWei = ethers.parseUnits(String(amountDue), decimals);

        if (currentAllowance < amountDueInWei) {
          toast.info(`Requesting approval for ${tokenSymbol}...`);
          const contractAddress = import.meta.env[
            `VITE_CONTRACT_ADDRESS_${chainId}`
          ];

          if (!contractAddress) {
            throw new Error("Unsupported network");
          }
          const approveTx = await tokenContract.approve(
            contractAddress,
            amountDueInWei
          );
          toast.info("Approval transaction submitted. Please wait...");
          await approveTx.wait();
          toast.success(`${tokenSymbol} approval completed successfully!`);
        }

        toast.info("Submitting payment transaction...");
        const tx = await contract.payInvoice(BigInt(invoiceId), {
          value: fee,
        });
        toast.info(
          "Payment transaction submitted. Please wait for confirmation..."
        );
        await tx.wait();
        toast.success(`Payment successful! Paid with ${tokenSymbol}`);
      } else {
        const amountDueInWei = ethers.parseUnits(String(amountDue), 18);
        const total = amountDueInWei + BigInt(fee);

        toast.info("Submitting payment transaction...");
        const tx = await contract.payInvoice(BigInt(invoiceId), {
          value: total,
        });
        toast.info(
          "Payment transaction submitted. Please wait for confirmation..."
        );
        await tx.wait();
        toast.success("Payment successful! Paid with ETH");
      }

      const updatedInvoices = receivedInvoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, isPaid: true } : inv
      );
      setReceivedInvoice(updatedInvoices);
    } catch (error) {
      console.error("Payment failed:", error);
      const errorMsg = getDetailedErrorMessage(error);
      setPaymentError(errorMsg);
      setShowPaymentError(true);
      toast.error("Payment failed. Check error details for more information.");
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [invoiceId]: false }));
    }
  };

  // UNIFORM BATCH PAYMENT
  const handleBatchPayment = async () => {
    if (!walletClient || selectedInvoices.size === 0) return;

    setBatchLoading(true);
    setPaymentError("");
    setShowPaymentError(false);

    try {
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contractAddress = import.meta.env[
        `VITE_CONTRACT_ADDRESS_${chainId}`
      ];

      if (!contractAddress) {
        throw new Error("Unsupported network");
      }

      const contract = new Contract(contractAddress, ChainvoiceABI, signer);

      const grouped = getGroupedInvoices();

      // BALANCE CHECK (same as individual)
      toast.info("Checking balances...");

      for (const [tokenKey, group] of grouped.entries()) {
        try {
          await checkBalance(
            group.tokenAddress,
            group.totalAmount,
            group.symbol,
            signer
          );
        } catch (error) {
          setPaymentError(error.message);
          setShowPaymentError(true);
          toast.error(
            "Balance check failed. Check error details for more information."
          );
          setBatchLoading(false);
          return;
        }
      }

      toast.success("Balance checks passed! Processing payments...");

      // Process payments
      for (const [tokenKey, group] of grouped.entries()) {
        const { tokenAddress, symbol, decimals, invoices } = group;
        const invoiceIds = invoices.map((inv) => BigInt(inv.id));

        if (invoiceIds.length > 50) {
          throw new Error(
            `Batch size limit exceeded for ${symbol}. Max 50 invoices per batch.`
          );
        }

        let totalAmount = BigInt(0);
        for (const invoice of invoices) {
          const amount = ethers.parseUnits(
            invoice.amountDue.toString(),
            decimals
          );
          totalAmount += amount;
        }

        const feePerInvoice = await contract.fee();
        const totalFee = feePerInvoice * BigInt(invoiceIds.length);
        const isNativeToken = tokenAddress === ethers.ZeroAddress;

        if (!isNativeToken) {
          const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
          const contractAddress = import.meta.env[
            `VITE_CONTRACT_ADDRESS_${chainId}`
          ];

          if (!contractAddress) {
            throw new Error("Unsupported network");
          }

          const currentAllowance = await tokenContract.allowance(
            await signer.getAddress(),
            contractAddress
          );

          if (currentAllowance < totalAmount) {
            toast.info(`Approving ${symbol} for spending...`);
            const approveTx = await tokenContract.approve(
              contractAddress,
              totalAmount
            );
            await approveTx.wait();
            toast.success(`${symbol} approved successfully!`);
          }

          const tx = await contract.payInvoicesBatch(invoiceIds, {
            value: totalFee,
          });
          await tx.wait();
          toast.success(
            `Successfully paid ${invoices.length} invoices with ${symbol}!`
          );
        } else {
          const tx = await contract.payInvoicesBatch(invoiceIds, {
            value: totalAmount + totalFee,
          });
          await tx.wait();
          toast.success(
            `Successfully paid ${invoices.length} invoices with ETH!`
          );
        }

        const updatedInvoices = receivedInvoices.map((inv) =>
          invoiceIds.some((id) => id === BigInt(inv.id))
            ? { ...inv, isPaid: true }
            : inv
        );
        setReceivedInvoice(updatedInvoices);
      }

      setSelectedInvoices(new Set());
      toast.success("All batch payments completed successfully!");
    } catch (error) {
      console.error("Batch payment error:", error);
      const errorMsg = getDetailedErrorMessage(error);
      setPaymentError(errorMsg);
      setShowPaymentError(true);
      toast.error(
        "Batch payment failed. Check error details for more information."
      );
    } finally {
      setBatchLoading(false);
    }
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

  // Fetch invoices
  useEffect(() => {
    if (!walletClient || !address || !litReady) return;

    const fetchReceivedInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();
      
        const litNodeClient = litClientRef.current;
        if (!litNodeClient) {
          setError("Lit client not initialized. Please refresh the page.");
          setLoading(false);
          return;
        }

        const contractAddress = import.meta.env[
          `VITE_CONTRACT_ADDRESS_${chainId}`
        ];

        if (!contractAddress) {
          throw new Error("Unsupported network");
        }

        const contract = new Contract(contractAddress, ChainvoiceABI, signer);

        const res = await contract.getReceivedInvoices(address);

        if (!res || !Array.isArray(res) || res.length === 0) {
          setReceivedInvoice([]);
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

            const batchInfo = detectBatchFromMetadata(parsed);
            if (batchInfo) {
              parsed.batchInfo = batchInfo;
            }
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
                // Fallback: try to fetch token info from blockchain if not in our list
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

        setReceivedInvoice(decryptedInvoices);
        const suggestions = findBatchSuggestions(decryptedInvoices);
        setBatchSuggestions(suggestions);
        const fee = await contract.fee();
        setFee(fee);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(
          "Unable to load invoices. The connected network is not supported or the contract is not deployed on this network. Please switch to a supported network and try again."
        );
        
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedInvoices();
  }, [walletClient, litReady, address, tokens]);

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

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const data = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `invoice-${drawerState.selectedInvoice.id}.png`;
      link.href = data;
      link.click();

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download invoice. Please try again.");
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
          message="Connect your wallet to manage and pay invoices"
          onDismiss={() => setShowWalletAlert(false)}
        />
      </div>
      <div className=" md:p-6 ">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Received Invoices
              </h2>
              <p className=" text-gray-50">
                Manage and pay your incoming invoices
              </p>
            </div>
          </div>

          {/* UNIFORM ERROR DISPLAY */}
          <Snackbar
            open={showPaymentError}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={() => setShowPaymentError(false)}
            autoHideDuration={8000}
            sx={{ mt: 8 }}
          >
            <Alert
              severity="error"
              variant="filled"
              sx={{
                bgcolor: "#d32f2f",
                color: "#fff",
                minWidth: 400,
                maxWidth: 500,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowPaymentError(false)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ErrorIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {paymentError}
                </Typography>
              </Box>
            </Alert>
          </Snackbar>

          {/* Smart Batch Suggestions */}
          {batchSuggestions.length > 0 && (
            <Paper
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "rgba(25, 118, 210, 0.08)",
                border: "1px solid rgba(25, 118, 210, 0.23)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  color: "#1565c0",
                }}
              >
                <LightbulbIcon sx={{ mr: 1, color: "#ff9800" }} />
                💡 Smart Batch Suggestions
              </Typography>
              {batchSuggestions.map((suggestion) => (
                <Box
                  key={suggestion.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "white",
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    border: "1px solid rgba(25, 118, 210, 0.2)",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      {suggestion.invoices.length} invoices
                      {suggestion.sender && ` from ${suggestion.sender.fname}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      ({suggestion.reason})
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {suggestion.totalAmount.toFixed(4)}{" "}
                      {suggestion.token?.symbol || "ETH"}
                    </Typography>
                    <Button
                      onClick={() => selectBatchSuggestion(suggestion)}
                      variant="contained"
                      size="small"
                      sx={{ minWidth: "auto" }}
                    >
                      Select & Pay
                    </Button>
                  </Box>
                </Box>
              ))}
            </Paper>
          )}

          {/* Batch Actions Panel */}
          {unpaidInvoices.length > 0 && (
            <Paper
              sx={{
                mb: 3,
                p: { xs: 1, sm: 2 },
                bgcolor: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", sm: "center" },
                  mb: 2,
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 1, sm: 0 } }}>
                  <PaymentIcon sx={{ color: "success.main" }} />
                  <Typography variant="h6" sx={{ color: "#1e293b", fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                    Batch Payment
                  </Typography>
                  <Chip
                    label={`${selectedCount} selected`}
                    color={selectedCount > 0 ? "success" : "default"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                  <Button
                    startIcon={<SelectAllIcon />}
                    onClick={handleSelectAll}
                    variant="outlined"
                    size="small"
                    disabled={unpaidInvoices.length === 0}
                    sx={{ minWidth: { xs: 0, sm: 120 }, flex: { xs: 1, sm: "unset" }, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {unpaidInvoices.length > 0 ? `Select All (${unpaidInvoices.length})` : "Select All"}
                  </Button>
                  <Button
                    startIcon={<ClearAllIcon />}
                    onClick={handleClearAll}
                    variant="outlined"
                    size="small"
                    disabled={selectedCount === 0}
                    sx={{ minWidth: { xs: 0, sm: 80 }, flex: { xs: 1, sm: "unset" }, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              {selectedCount > 0 && (
                <>
                  <Divider sx={{ mb: 2 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, color: "#1e293b", fontSize: { xs: "1rem", sm: "1.1rem" } }}
                  >
                    Payment Summary:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    {Array.from(grouped.entries()).map(([tokenKey, group]) => (
                      <Box
                        key={tokenKey}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "center" },
                          bgcolor: "#f8fafc",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid #e2e8f0",
                          gap: { xs: 1, sm: 0 },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {group.logo ? (
                            <img
                              src={group.logo}
                              alt={group.symbol}
                              style={{ width: 24, height: 24 }}
                              onError={(e) => {
                                e.target.src = "/tokenImages/generic.png";
                              }}
                            />
                          ) : (
                            <CurrencyExchangeIcon sx={{ color: "#64748b" }} />
                          )}
                          <Typography
                            sx={{ fontWeight: 600, color: "#1e293b" }}
                          >
                            {group.symbol}
                          </Typography>
                          <Typography
                            sx={{ color: "#64748b", fontSize: "0.875rem" }}
                          >
                            ({group.invoices.length} invoices)
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ color: "success.main", fontWeight: "bold", mt: { xs: 1, sm: 0 } }}
                        >
                          {group.totalAmount.toFixed(6)} {group.symbol}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    onClick={handleBatchPayment}
                    variant="contained"
                    color="success"
                    size="large"
                    disabled={batchLoading}
                    startIcon={
                      batchLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <PaymentIcon />
                      )
                    }
                    fullWidth
                    sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, py: { xs: 1.2, sm: 1.5 } }}
                  >
                    {batchLoading
                      ? "Processing Batch Payment..."
                      : `Pay ${selectedCount} Selected Invoices`}
                  </Button>
                </>
              )}

              {selectedCount === 0 && (
                <Alert
                  severity="info"
                  sx={{ bgcolor: "#e3f2fd", color: "#1565c0" }}
                >
                  Select one or more unpaid invoices to enable batch payment
                </Alert>
              )}
            </Paper>
          )}

          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              backgroundColor: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              borderRadius: "12px",
            }}
          >
            {loading ? (
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <Skeleton variant="text" width={150} height={40} />
                  <Skeleton variant="text" width={100} height={40} />
                </div>
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={60}
                    className="mb-2"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <ErrorIcon
                    className="text-red-400 mb-2"
                    style={{ fontSize: 32 }}
                  />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            ) : receivedInvoices.length === 0 ? (
              <div className="p-6 text-center">
                <div className="bg-blue-50 p-8 rounded-lg">
                  <DescriptionIcon
                    className="text-blue-400"
                    style={{ fontSize: 48 }}
                  />
                  <h3 className="text-lg font-medium text-gray-800 mt-2">
                    No Invoices Found
                  </h3>
                  <p className="text-gray-600 mt-1">
                    You don't have any received invoices yet.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              minWidth: column.minWidth,
                              fontWeight: 600,
                              color: "#64748b",
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            {column.id === "select" ? (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    indeterminate={
                                      selectedCount > 0 &&
                                      selectedCount < unpaidInvoices.length
                                    }
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
                                }
                                label=""
                              />
                            ) : (
                              column.label
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {receivedInvoices
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((invoice) => (
                          <TableRow
                            key={invoice.id}
                            hover
                            sx={{
                              "&:last-child td": { borderBottom: 0 },
                              "&:hover": { backgroundColor: "#f8fafc" },
                              backgroundColor: selectedInvoices.has(invoice.id)
                                ? "rgba(34, 197, 94, 0.05)"
                                : "transparent",
                            }}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedInvoices.has(invoice.id)}
                                onChange={() => handleSelectInvoice(invoice.id)}
                                disabled={invoice.isPaid || invoice.isCancelled}
                                color="success"
                              />
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center">
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: "#e0f2fe",
                                    color: "#0369a1",
                                    fontSize: 14,
                                    mr: 2,
                                  }}
                                >
                                  {invoice.user?.fname?.charAt(0) || "C"}
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {invoice.user?.fname} {invoice.user?.lname}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {invoice.user?.email}
                                  </div>
                                  {invoice.batchInfo && (
                                    <div className="mt-1">
                                      <Chip
                                        icon={<LayersIcon />}
                                        label={`Batch #${invoice.batchInfo.batchId.slice(
                                          -4
                                        )} (${invoice.batchInfo.index + 1}/${
                                          invoice.batchInfo.batchSize
                                        })`}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        sx={{
                                          fontSize: "0.7rem",
                                          height: "20px",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Tooltip title={invoice.user?.address}>
                                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                  {formatAddress(invoice.user?.address)}
                                </span>
                              </Tooltip>
                            </TableCell>

                            <TableCell align="right">
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
                                  <CurrencyExchangeIcon
                                    className="text-gray-400 mr-2"
                                    fontSize="small"
                                  />
                                )}
                                <span className="font-medium">
                                  {invoice.amountDue}{" "}
                                  {invoice.paymentToken?.symbol}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              {invoice.isCancelled ? (
                                <Chip
                                  icon={<CancelIcon />}
                                  label="Cancelled"
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                />
                              ) : invoice.isPaid ? (
                                <Chip
                                  icon={<PaidIcon />}
                                  label="Paid"
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                              ) : (
                                <Chip
                                  label="UNPAID"
                                  color="warning"
                                  size="small"
                                  icon={<UnpaidIcon />}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600">
                                {formatDate(invoice.issueDate)}
                              </span>
                            </TableCell>

                            <TableCell>
                              <div className="flex space-x-2">
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={toggleDrawer(invoice)}
                                    sx={{
                                      backgroundColor: "#e0f2fe",
                                      "&:hover": { backgroundColor: "#bae6fd" },
                                    }}
                                  >
                                    <DescriptionIcon
                                      fontSize="small"
                                      sx={{ color: "#0369a1" }}
                                    />
                                  </IconButton>
                                </Tooltip>

                                {invoice.batchInfo &&
                                  !invoice.isPaid &&
                                  !invoice.isCancelled && (
                                    <Tooltip title="Pay Entire Batch">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          payEntireBatch(
                                            invoice.batchInfo.batchId
                                          )
                                        }
                                        sx={{
                                          backgroundColor: "#f3e8ff",
                                          "&:hover": {
                                            backgroundColor: "#e9d5ff",
                                          },
                                        }}
                                      >
                                        <LayersIcon
                                          fontSize="small"
                                          sx={{ color: "#9333ea" }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  )}

                                {!invoice.isPaid && !invoice.isCancelled && (
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                      payInvoice(
                                        invoice.id,
                                        invoice.amountDue,
                                        invoice.paymentToken?.address ??
                                          ethers.ZeroAddress
                                      )
                                    }
                                    disabled={paymentLoading[invoice.id]}
                                    sx={{
                                      bgcolor: paymentLoading[invoice.id]
                                        ? "grey.400"
                                        : "success.main",
                                      color: "white",
                                      minWidth: "auto",
                                      px: 2,
                                      py: 0.5,
                                      fontSize: "0.75rem",
                                      "&:hover": {
                                        bgcolor: paymentLoading[invoice.id]
                                          ? "grey.400"
                                          : "success.dark",
                                      },
                                    }}
                                    startIcon={
                                      paymentLoading[invoice.id] ? (
                                        <CircularProgress
                                          size={14}
                                          color="inherit"
                                        />
                                      ) : null
                                    }
                                  >
                                    {paymentLoading[invoice.id]
                                      ? "Processing..."
                                      : "Pay Now"}
                                  </Button>
                                )}
                                {invoice.isCancelled && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    disabled={true}
                                    sx={{
                                      color: "grey.600",
                                      borderColor: "grey.400",
                                      minWidth: "auto",
                                      px: 2,
                                      py: 0.5,
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    Cancelled
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={receivedInvoices.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: "1px solid #f1f5f9",
                    "& .MuiTablePagination-actions svg": {
                      color: "#64748b",
                    },
                    "& .MuiSelect-icon": {
                      color: "#64748b",
                    },
                  }}
                />
              </>
            )}
          </Paper>
        </div>

        {/* Invoice Detail Drawer */}
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
                        <Chip
                          label="CANCELLED"
                          color="error"
                          size="small"
                          icon={<CancelIcon />}
                        />
                      ) : drawerState.selectedInvoice.isPaid ? (
                        <Chip
                          label="PAID"
                          color="success"
                          size="small"
                          icon={<PaidIcon />}
                        />
                      ) : (
                        <Chip
                          label="UNPAID"
                          color="warning"
                          size="small"
                          icon={<UnpaidIcon />}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {drawerState.selectedInvoice.isCancelled && (
                  <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-start">
                      <div>
                        <Typography
                          variant="subtitle1"
                          className="font-medium text-red-800"
                        >
                          Invoice Cancelled by{" "}
                          {drawerState.selectedInvoice.user?.fname ||
                            "The sender"}{" "}
                          {drawerState.selectedInvoice.user?.lname || ""}{" "}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-red-600 mt-2"
                        >
                          You no longer need to make payment for this invoice.
                        </Typography>
                      </div>
                    </div>

                    {!drawerState.selectedInvoice.isPaid && (
                      <div className="mt-2 pt-2 border-t border-red-100">
                        <Typography variant="caption" className="text-red-500">
                          Note: This invoice was cancelled before payment was
                          completed
                        </Typography>
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
                        <CurrencyExchangeIcon
                          className="text-gray-500"
                          fontSize="small"
                        />
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
                  <Button
                    onClick={toggleDrawer(null)}
                    variant="outlined"
                    sx={{ px: 3, py: 1 }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handlePrint}
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    sx={{ px: 3, py: 1 }}
                  >
                    Download Invoice
                  </Button>
                </div>
              </div>
            </>
          )}
        </SwipeableDrawer>
      </div>
    </>
  );
}

export default ReceivedInvoice;
