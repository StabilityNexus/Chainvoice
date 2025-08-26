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
} from "@mui/material";
import PaidIcon from "@mui/icons-material/CheckCircle";
import UnpaidIcon from "@mui/icons-material/Pending";
import DownloadIcon from "@mui/icons-material/Download";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { useTokenList } from "@/hooks/useTokenList";
import WalletConnectionAlert from "@/components/WalletConnectionAlert";

const columns = [
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

  // Helper function to get token logo
  const getTokenLogo = (tokenAddress, fallbackLogo) => {
    const tokenInfo = getTokenInfo(tokenAddress);
    return (
      tokenInfo?.image ||
      tokenInfo?.logo ||
      fallbackLogo ||
      "/tokenImages/generic.png"
    );
  };

  // Helper function to get token decimals
  const getTokenDecimals = (tokenAddress, fallbackDecimals = 18) => {
    const tokenInfo = getTokenInfo(tokenAddress);
    return tokenInfo?.decimals || fallbackDecimals;
  };

  // Helper function to get token symbol
  const getTokenSymbol = (tokenAddress, fallbackSymbol = "TOKEN") => {
    const tokenInfo = getTokenInfo(tokenAddress);
    return tokenInfo?.symbol || fallbackSymbol;
  };

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
        console.log("Raw invoices data:", res);

        if (!res || !Array.isArray(res) || res.length === 0) {
          console.warn("No invoices found.");
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
              console.warn(`Unauthorized access attempt for invoice ${id}`);
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

            // Enhance with token details using the new token fetching system
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
                    logo: "/tokenImages/generic.png", // Generic fallback
                  };
                } catch (error) {
                  console.error(
                    "Failed to fetch token info from blockchain:",
                    error
                  );
                  // Keep existing data or set defaults
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

      // Use the helper function instead of TOKEN_PRESETS
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
      setReceivedInvoice(updatedInvoices);
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

  const [drawerState, setDrawerState] = useState({
    open: false,
    selectedInvoice: null,
  });

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

  return (
    <>
      <div className="flex justify-center">
        <WalletConnectionAlert
          show={showWalletAlert}
          message="Connect your wallet to create and manage invoices"
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
            {error && (
              <button
                onClick={switchNetwork}
                disabled={networkLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {networkLoading ? (
                  <>
                    <CircularProgress
                      size={20}
                      className="mr-2"
                      color="inherit"
                    />
                    Switching...
                  </>
                ) : (
                  "Switch to Sepolia"
                )}
              </button>
            )}
          </div>

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
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-600 font-medium">{error}</p>
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
                            {column.label}
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
                            }}
                          >
                            {/* Client Column */}
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
                                </div>
                              </div>
                            </TableCell>

                            {/* Sender Column */}
                            <TableCell>
                              <Tooltip title={invoice.user?.address}>
                                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                  {formatAddress(invoice.user?.address)}
                                </span>
                              </Tooltip>
                            </TableCell>

                            {/* Amount Column */}
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

                            {/* Status Column */}
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
                            {/* Date Column */}
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
                                        <CircularProgress
                                          size={14}
                                          className="mr-2"
                                          color="inherit"
                                        />
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
                    <DownloadIcon className="mr-2" fontSize="small" />
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

export default ReceivedInvoice;
