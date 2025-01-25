import { BrowserProvider, Contract, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useWalletClient } from 'wagmi';
import { ChainvoiceABI } from '../contractsABI/ChainvoiceABI';

function SentInvoice() {
  const { data: walletClient } = useWalletClient();
  const [sentInvoices, setSentInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSentInvoices = async () => {
      setLoading(true);
      if (!walletClient) return;
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ChainvoiceABI, signer);
      const res = await contract.getMySentInvoices();
      setSentInvoices(res);
      setLoading(false);
    }
    fetchSentInvoices();
  }, [walletClient]);

  return (
    <div>
      <h2 className="text-lg font-bold">Your Sent Invoice Requests</h2>
      {loading ? (
        <p>Loading invoices...</p>
      ) : sentInvoices.length > 0 ? (
        <ul>
          {sentInvoices.map((invoice, index) => (
            <li
              key={index}
              className="m-4 grid grid-cols-12 items-center border p-3 shadow-lg rounded-md cursor-pointer"
            >

              <p className="col-span-4">
                Client: {invoice.to.substring(0, 10)}...{invoice.to.substring(invoice.to.length - 10)}
              </p>
              <p className='col-span-4 text-start'>
                Amount : {ethers.formatUnits(invoice.amountDue)} ETH (sepolia)
              </p>
              <p className="col-span-3">
                Date: {new Date().toLocaleDateString()}
              </p>
              <button
                className={`text-sm rounded-full text-white font-bold col-span-1 ${invoice.isPaid ? 'bg-green-600' : 'bg-red-600'
                  }`}
              >
                {invoice.isPaid ? 'Paid' : 'Not Paid'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No invoices found</p>
      )}
    </div>
  );
}

export default SentInvoice;
