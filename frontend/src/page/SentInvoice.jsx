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
import {
  CircularProgress,
  Skeleton,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/CheckCircle";
import UnpaidIcon from "@mui/icons-material/Pending";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { TOKEN_PRESETS } from "@/utils/erc20_token";
import WalletConnectionAlert from "@/components/WalletConnectionAlert";

const columns = [
  { id: "fname", label: "Client", minWidth: 120 },
  { id: "to", label: "Receiver", minWidth: 150 },
  { id: "amountDue", label: "Amount", minWidth: 100, align: "right" },
  { id: "status", label: "Status", minWidth: 120 },
  { id: "date", label: "Date", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 150 },
];

function SentInvoice() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();

  const [loading, setLoading] = useState(true);
  const [sentInvoices, setSentInvoices] = useState([]);
  const [fee, setFee] = useState(0);
  const [error, setError] = useState(null);
  const [litReady, setLitReady] = useState(false);
  const litClientRef = useRef(null);
  const [paymentLoading, setPaymentLoading] = useState({});
  const [networkLoading, setNetworkLoading] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [invoiceToCancel, setInvoiceToCancel] = useState(null);
  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

    const fetchSentInvoices = async () => {
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
        // 2. Connect to Lit Node

        const litNodeClient = litClientRef.current;
        if (!litNodeClient) {
          alert("Lit client not initialized");
          return;
        }

        // 3. Contract call to get encrypted invoice
        const contract = new Contract(
          import.meta.env.VITE_CONTRACT_ADDRESS,
          ChainvoiceABI,
          signer
        );

        const res = await contract.getSentInvoices(address);
        console.log("Raw invoices data:", res);

        if (!res || !Array.isArray(res) || res.length === 0) {
          console.warn("No invoices found.");
          setSentInvoices([]);
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
            if (parsed.paymentToken?.address) {
              const tokenInfo = TOKEN_PRESETS.find(
                (t) =>
                  t.address.toLowerCase() ===
                  parsed.paymentToken.address.toLowerCase()
              );
              if (tokenInfo) {
                parsed.paymentToken = {
                  ...parsed.paymentToken,
                  logo: tokenInfo.logo,
                  decimals: tokenInfo.decimals,
                };
              }
            }
            decryptedInvoices.push(parsed);
          } catch (err) {
            console.error(`Error processing invoice ${invoice[0]}:`, err);
          }
        }

        setSentInvoices(decryptedInvoices);
        const fee = await contract.fee();
        setFee(fee);
      } catch (error) {
        console.error("Decryption error:", error);
      } finally {
        console.log(sentInvoices);
        setLoading(false);
      }
    };

    fetchSentInvoices();
  }, [walletClient, litReady, address]);

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
  const handleCancelInvoice = async (invoiceId) => {
    try {
      setPaymentLoading((prev) => ({ ...prev, [invoiceId]: true }));
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ChainvoiceABI,
        signer
      );

      const tx = await contract.cancelInvoice(invoiceId);
      await tx.wait();
      setSentInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, isCancelled: true } : inv
        )
      );

      toast.success("Invoice cancelled successfully");
    } catch (error) {
      console.error("Cancellation failed:", error);
      toast.error("Failed to cancel invoice");
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [invoiceId]: false }));
    }
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
              <h2 className="text-2xl font-bold text-white">Sent Invoices</h2>
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
            ) : sentInvoices.length === 0 ? (
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
                    You haven't sent any invoices yet.
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
                      {sentInvoices
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
                                  {invoice.client?.fname?.charAt(0) || "C"}
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {invoice.client?.fname}{" "}
                                    {invoice.client?.lname}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {invoice.client?.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            {/* Sender Column */}
                            <TableCell>
                              <Tooltip title={invoice.client?.address}>
                                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                  {formatAddress(invoice.client?.address)}
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
                                    className="w-5 h-5 mr-2 rounded-full"
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
                                  icon={<UnpaidIcon />}
                                  label="Pending"
                                  color="warning"
                                  size="small"
                                  variant="outlined"
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
                              <div className="flex space-x-5">
                                {!invoice.isPaid && !invoice.isCancelled && (
                                  <Tooltip title="Cancel Invoice">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setInvoiceToCancel(invoice);
                                        setCancelConfirmOpen(true);
                                      }}
                                      sx={{
                                        backgroundColor: "#fee2e2",
                                        "&:hover": {
                                          backgroundColor: "#fecaca",
                                        },
                                      }}
                                    >
                                      <CancelIcon
                                        fontSize="small"
                                        sx={{ color: "#dc2626" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                )}
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
                  count={sentInvoices.length}
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
            <div
              id="invoice-print"
              className="bg-white p-6 rounded-lg shadow-none"
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  Powered by
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
                </div>

                <div className="text-right">
                  <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
                  <p className="text-gray-600 text-sm">
                    #
                    {drawerState.selectedInvoice.id.toString().padStart(6, "0")}
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
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <div>
                      <Typography
                        variant="subtitle1"
                        className="font-medium text-blue-800"
                      >
                        You Cancelled This Invoice
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-blue-600 mt-2"
                      >
                        {drawerState.selectedInvoice.client?.fname ||
                          "The recipient"}{" "}
                        {drawerState.selectedInvoice.client?.lname || ""} has
                        been notified and cannot pay this invoice.
                      </Typography>
                    </div>
                  </div>

                  {drawerState.selectedInvoice.isPaid && (
                    <div className="mt-3 pt-3 border-t border-blue-100">
                      <Typography variant="caption" className="text-blue-500">
                        Note: Payment was already completed before cancellation
                      </Typography>
                    </div>
                  )}
                </div>
              )}

              {/* From/Bill To Section */}
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

              {/* Payment Currency Section */}
              <div className="p-4 rounded-lg mb-6 border border-gray-200">
                <h3 className="text-base font-bold text-gray-700">
                  Payment Currency
                </h3>
                <div className="mt-2 flex items-center">
                  {drawerState.selectedInvoice.paymentToken?.logo ? (
                    <img
                      src={drawerState.selectedInvoice.paymentToken.logo}
                      alt={drawerState.selectedInvoice.paymentToken.symbol}
                      className="w-6 h-6 mr-2"
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
                    <p>Chain: Sepolia Testnet</p>
                  </div>
                )}
              </div>

              {/* Date Information */}
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
                    {drawerState.selectedInvoice.paymentToken?.symbol === "ETH"
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
          )}
        </SwipeableDrawer>

        <Dialog
          open={cancelConfirmOpen}
          onClose={() => setCancelConfirmOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm Invoice Cancellation
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography variant="body1" className="mb-3">
                You're about to cancel this invoice sent to{" "}
                <span className="font-medium">
                  {invoiceToCancel?.client.fname}{" "}
                  {invoiceToCancel?.client.lname}
                </span>
                .
              </Typography>
              {invoiceToCancel?.isPaid ? (
                <Alert severity="error" className="mt-3">
                  Payment was already received - cancelling will not reverse the
                  transaction
                </Alert>
              ) : (
                <Alert severity="warning" className="mt-3">
                  This action cannot be undone
                </Alert>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelConfirmOpen(false)}>
              {" "}
              No,Keep Invoice Active
            </Button>
            <Button
              onClick={() => {
                handleCancelInvoice(invoiceToCancel.id);
                setCancelConfirmOpen(false);
              }}
              color="error"
              autoFocus
            >
              Yes, Cancel It
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default SentInvoice;
