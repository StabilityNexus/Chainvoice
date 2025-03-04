import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ChainvoiceABI } from '@/contractsABI/ChainvoiceABI';
import { BrowserProvider, Contract, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import DescriptionIcon from '@mui/icons-material/Description';
const columns = [
  { id: 'fname', label: 'First Name', minWidth: 100 },
  { id: 'lname', label: 'Last Name', minWidth: 100 },
  { id: 'to', label: 'Address', minWidth: 200 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'country', label: 'Country', minWidth: 100 },
  { id: 'city', label: 'City', minWidth: 100 },
  { id: 'amountDue', label: 'Total Amount', minWidth: 100, align: 'right' },
  { id: 'isPaid', label: 'Status', minWidth: 100 },
  { id: 'detail', label: 'Detail Invoice', minWidth: 100 }
];


function ReceivedInvoice() {

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
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [receivedInvoices, setReceivedInvoice] = useState([]);
  const [fee, setFee] = useState(0);
  useEffect(() => {
    const fetchReceivedInvoices = async () => {
      try {
        setLoading(true);
        if (!walletClient) return;
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ChainvoiceABI, signer);
        console.log(address);
        const res = await contract.getMyReceivedInvoices(address);
        setReceivedInvoice(res);
        setLoading(false);
        const fee = await contract.usdToNativeCurrencyConversion();
        console.log(ethers.formatUnits(fee));
        setFee(fee);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
    fetchReceivedInvoices();
  }, [walletClient]);

  const payInvoice = async (id, amountDue) => {
    try {
      if (!walletClient) return;
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ChainvoiceABI, signer);
      console.log(amountDue);
      const feeAmountInNativeCurrency = await contract.usdToNativeCurrencyConversion();
      console.log(feeAmountInNativeCurrency);
      const res = await contract.payInvoice(ethers.toBigInt(id), {
        value: amountDue + feeAmountInNativeCurrency
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h2 className="text-lg font-bold">Received Invoice Request</h2>
      <h2 className="text-sm mb-4">Pay to your client request</h2>
      <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: '#1b1f29', color: 'white', boxShadow: 'none' }} >
        {loading ? (
          <p>loading........</p>
        ) : receivedInvoices.length > 0 ? (
          <>
            <TableContainer sx={{ maxHeight: 540 }}>
              <Table stickyHeader aria-label="sticky table" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <TableHead>
                  <TableRow >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ minWidth: column.minWidth, backgroundColor: '#1b1f29', color: 'white', borderColor: '#25272b' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receivedInvoices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((invoice, index) => (
                      <TableRow key={index}  
                      className='hover:bg-[#32363F] transition duration-300'
        
                      >
                        {columns.map((column) => {
                          console.log(invoice.to);
                          const value = invoice.user[column.id] || '';
                          if (column.id === 'to') {
                            return (
                              <TableCell key={column.id} align={column.align} sx={{ color: 'white', borderColor: '#25272b' }}>
                                {invoice.to.substring(0, 10)}...{invoice.to.substring(invoice.to.length - 10)}
                              </TableCell>
                            );
                          }
                          if (column.id === 'amountDue') {
                            return (
                              <TableCell key={column.id} align={column.align} sx={{ color: 'white', borderColor: '#25272b' }}>
                                {ethers.formatUnits(invoice.amountDue)} ETH
                              </TableCell>
                            );
                          }
                          if (column.id === 'isPaid') {
                            return (
                              <TableCell key={column.id} align={column.align} sx={{ color: 'white', borderColor: '#25272b' }} className=' '>
                                <button
                                  className={`text-sm rounded-full text-white font-bold px-3 ${invoice.isPaid ? 'bg-green-600' : 'bg-red-600'}`}
                                >
                                  {invoice.isPaid ? 'Paid' : 'Not Paid'}
                                </button>
                              </TableCell>
                            )
                          }
                          if(column.id==='detail'){
                            return (
                              <TableCell key={column.id} align={column.align} sx={{ color: 'white', borderColor: '#25272b' }}>
                                <button
                                  className='text-sm rounded-full text-white font-bold px-3 hover:text-blue-500 transition duration-500'
                                >
                                  <DescriptionIcon />
                                </button>
                              </TableCell>
                            )
                          }
                          return (
                            <TableCell key={column.id} align={column.align} sx={{ color: 'white', borderColor: '#25272b' }}>
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
              count={receivedInvoices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: 'white',
                backgroundColor: '#1b1f29',
                "& .MuiTablePagination-actions svg": {
                  color: 'white',
                },
                "& .MuiSelect-icon": {
                  color: 'white',
                },
                "& .MuiInputBase-root": {
                  color: 'white',
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  color: 'white',
                },

              }}
            />

          </>
        ) : (
          <p>No invoices found</p>
        )}
      </Paper>
    </div>
  )
}

export default ReceivedInvoice