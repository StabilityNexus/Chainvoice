import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { BrowserProvider, Contract, ethers } from "ethers";
import React, { useEffect, useState, useRef } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ChainvoiceABI } from "../contractsABI/ChainvoiceABI";
import DescriptionIcon from "@mui/icons-material/Description";

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

const columns = [
  { id: "fname", label: "First Name", minWidth: 100 },
  { id: "lname", label: "Last Name", minWidth: 100 },
  { id: "to", label: "Receiver's Address", minWidth: 200 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "country", label: "Country", minWidth: 100 },
  { id: "city", label: "City", minWidth: 100 },
  { id: "amountDue", label: "Total Amount", minWidth: 100, align: "right" },
  { id: "isPaid", label: "Status", minWidth: 100 },
  { id: "detail", label: "Detail Invoice", minWidth: 100 },
];

function SentInvoice() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { data: walletClient } = useWalletClient();
  const [sentInvoices, setSentInvoices] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(0);
  const [error, setError] = useState(null);
  const { address } = useAccount();
  const [litReady, setLitReady] = useState(false);
  const litClientRef = useRef(null);

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
          console.log(litClientRef.current);
        }
      } catch (error) {
        console.error("Error while lit client initialization:", error);
      } finally {
        setLoading(false);
      }
    };
    initLit();
  }, []);

  useEffect(() => {
    if (!walletClient || !litReady) return;

    const fetchSentInvoices = async () => {
      try {
        setLoading(true);

        // 1. Setup signer
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();

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
        console.log(res);

        if (!res || !Array.isArray(res) || res.length === 0) {
          console.warn("No invoices found.");
          setSentInvoices([]);
          setInvoiceItems([]);
          setLoading(false);
          return;
        }

        const decryptedInvoices = [];

        for (const invoice of res) {
          const id = invoice[0];
          const from = invoice[1].toLowerCase();
          const to = invoice[2].toLowerCase();
          const isPaid = invoice[5];
          const encryptedStringBase64 = invoice[6]; // encryptedData
          const dataToEncryptHash = invoice[7];

          if (!encryptedStringBase64 || !dataToEncryptHash) continue;
          const currentUserAddress = address.toLowerCase();
          if (currentUserAddress !== from && currentUserAddress !== to) {
            console.warn(
              `User ${currentUserAddress} not authorized to decrypt invoice ${id}`
            );
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
                value: invoice[1].toLowerCase(), // from
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
                value: invoice[2].toLowerCase(), // to
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
          decryptedInvoices.push(parsed);
        }

        setSentInvoices(decryptedInvoices);
        const fee = await contract.fee();
        setFee(fee);
      } catch (error) {
        console.error("Decryption error:", error);
        alert("Failed to decrypt invoice.");
      } finally {
        setLoading(false);
        console.log(sentInvoices);
      }
    };

    fetchSentInvoices();
  }, [walletClient, litReady]);

  const [drawerState, setDrawerState] = useState({
    open: false,
    selectedInvoice: null,
  });

  const toggleDrawer = (invoice) => (event) => {
    console.log(invoice);
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

  const contentRef = useRef();
  const handlePrint = async () => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    // download feature (implement later on)
    // const pdf = new jsPDF({
    //   orientation: "portrait",
    //   unit: "px",
    //   format: "a4",
    // });

    // const imgProperties = pdf.getImageProperties(data);
    // const pdfWidth = pdf.internal.pageSize.getWidth();

    // const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    // pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    // pdf.save("invoice.pdf");
  };

  return (
    <div>
      <h2 className="text-lg font-bold m-3">Your Sent Invoice Request</h2>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#1b1f29",
          color: "white",
          boxShadow: "none",
        }}
      >
        {loading ? (
          <p className="p-4">Loading invoices...</p>
        ) : error ? (
          <p className="p-4 text-red-400">{error}</p>
        ) : sentInvoices.length === 0 ? (
          <p className="p-4">No invoices found</p>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 540 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{ borderCollapse: "separate", borderSpacing: 0 }}
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          minWidth: column.minWidth,
                          backgroundColor: "#1b1f29",
                          color: "white",
                          borderColor: "#25272b",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sentInvoices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((invoice, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-[#32363F] transition duration-300"
                      >
                        {columns.map((column) => {
                          const value = invoice?.client[column.id];
                          if (column.id === "to") {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                  color: "white",
                                  borderColor: "#25272b",
                                }}
                              >
                                {invoice.client.address
                                  ? `${invoice.client.address.substring(
                                      0,
                                      10
                                    )}...${invoice.client.address.substring(
                                      invoice.client.address.length - 10
                                    )}`
                                  : "N/A"}
                              </TableCell>
                            );
                          }
                          if (column.id === "amountDue") {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                  color: "white",
                                  borderColor: "#25272b",
                                }}
                              >
                                {invoice.amountDue}{" "}
                                {invoice.paymentToken?.symbol}
                              </TableCell>
                            );
                          }
                          if (column.id === "isPaid") {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                  color: "white",
                                  borderColor: "#25272b",
                                }}
                              >
                                <button
                                  className={`text-sm rounded-full text-white font-bold px-3 ${
                                    invoice.isPaid
                                      ? "bg-green-600"
                                      : "bg-red-600"
                                  }`}
                                >
                                  {invoice.isPaid ? "Paid" : "Not Paid"}
                                </button>
                              </TableCell>
                            );
                          }
                          if (column.id === "detail") {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                  color: "white",
                                  borderColor: "#25272b",
                                }}
                              >
                                <button
                                  className="text-sm rounded-full text-white font-bold px-3 hover:text-blue-500 transition duration-500"
                                  onClick={toggleDrawer(invoice)}
                                >
                                  <DescriptionIcon />
                                </button>
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{ color: "white", borderColor: "#25272b" }}
                            >
                              {value}
                            </TableCell>
                          );
                        })}
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
                color: "white",
                backgroundColor: "#1b1f29",
                "& .MuiTablePagination-actions svg": {
                  color: "white",
                },
                "& .MuiSelect-icon": {
                  color: "white",
                },
                "& .MuiInputBase-root": {
                  color: "white",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    color: "white",
                  },
              }}
            />
          </>
        )}
      </Paper>

      <SwipeableDrawer
        anchor="right"
        open={drawerState.open}
        onClose={toggleDrawer(null)}
        onOpen={toggleDrawer(null)}
      >
        {drawerState.selectedInvoice && (
          <div style={{ width: 650, padding: 20 }}>
            <div className="bg-white p-6 shadow-lg w-full max-w-2xl font-Montserrat">
              <div className="flex justify-between items-center">
                <img src="/whiteLogo.png" alt="none" />
                <div>
                  <p className="text-gray-700 text-xs py-1">
                    Issued by {drawerState.selectedInvoice.issueDate}
                  </p>
                  <p className="text-gray-700 text-xs">
                    Payment Due by {drawerState.selectedInvoice.dueDate}
                  </p>
                </div>
              </div>

              <div className="border-b border-green-500 pb-4 mb-4">
                <h1 className="text-sm font-bold">
                  Invoice # {drawerState.selectedInvoice.id.toString()}
                </h1>
              </div>

              <div className="mb-4">
                <h2 className="text-sm font-semibold">From</h2>
                <p className="text-gray-700 text-xs">
                  {drawerState.selectedInvoice.user.address}
                </p>
                <p className="text-gray-700 text-xs">{`${drawerState.selectedInvoice.user.fname} ${drawerState.selectedInvoice.user.lname}`}</p>
                <p className="text-blue-500 underline text-xs">
                  {drawerState.selectedInvoice.user.email}
                </p>
                <p className="text-gray-700 text-xs">{`${drawerState.selectedInvoice.user.city}, ${drawerState.selectedInvoice.user.country} (${drawerState.selectedInvoice.user.postalcode})`}</p>
              </div>

              <div className="mb-4">
                <h2 className="text-sm font-semibold">Billed to</h2>
                <p className="text-gray-700 text-xs">
                  {drawerState.selectedInvoice.client.address}
                </p>
                <p className="text-gray-700 text-xs">{`${drawerState.selectedInvoice.client.fname} ${drawerState.selectedInvoice.client.lname}`}</p>
                <p className="text-blue-500 underline text-xs">
                  {drawerState.selectedInvoice.client.email}
                </p>
                <p className="text-gray-700 text-xs">{`${drawerState.selectedInvoice.client.city}, ${drawerState.selectedInvoice.client.country} (${drawerState.selectedInvoice.client.postalcode})`}</p>
              </div>
              <table className="w-full border-collapse border border-gray-300 text-xs">
                <thead>
                  <tr className="bg-green-500">
                    <th className=" p-2">Description</th>
                    <th className=" p-2">QTY</th>
                    <th className=" p-2">Unit Price</th>
                    <th className=" p-2">Discount</th>
                    <th className=" p-2">Tax</th>
                    <th className=" p-2">Amount</th>
                  </tr>
                </thead>
                {drawerState.selectedInvoice?.items?.map((item, index) => (
                  <tbody key={index}>
                    <tr>
                      <td className="border p-2 text-center">
                        {item.description}
                      </td>
                      <td className="border p-2 text-center">
                        {item.qty.toString()}
                      </td>
                      <td className="border p-2 text-center">
                        {item.unitPrice}
                      </td>
                      <td className="border p-2 text-center">
                        {item.discount.toString() == ""
                          ? "NIL"
                          : item.discount.toString()}
                      </td>
                      <td className="border p-2 text-center">
                        {item.tax.toString() == ""
                          ? "NIL"
                          : item.tax.toString()}
                      </td>
                      <td className="border p-2 text-center">
                        {item.amount}{" "}
                        {drawerState.selectedInvoice?.paymentToken?.symbol}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
              <div className="mt-4 text-xs">
                <p className="text-right font-semibold">
                  Fee for invoice pay : {parseFloat(ethers.formatUnits(fee))}{" "}
                  ETH
                </p>
                <p className="text-right font-semibold">
                  {" "}
                  Amount: {drawerState.selectedInvoice.amountDue}{" "}
                  {drawerState.selectedInvoice?.paymentToken?.symbol}
                </p>
                <p className="text-right font-semibold">
                  Total Amount:{" "}
                  {drawerState.selectedInvoice?.paymentToken?.symbol == "ETH"
                    ? parseFloat(drawerState.selectedInvoice.amountDue) +
                      parseFloat(ethers.formatUnits(fee))
                    : `${parseFloat(drawerState.selectedInvoice.amountDue)} ${
                        drawerState.selectedInvoice?.paymentToken?.symbol
                      } + ${parseFloat(ethers.formatUnits(fee))} ETH`}
                 </p>
              </div>
              <div className="p-2 flex items-center">
                <h1 className="text-xs text-center pr-1">Powered by</h1>
                <img src="/whiteLogo.png" alt="" loading="lazy" width={80} />
              </div>
            </div>
          </div>
        )}
      </SwipeableDrawer>
    </div>
  );
}

export default SentInvoice;
