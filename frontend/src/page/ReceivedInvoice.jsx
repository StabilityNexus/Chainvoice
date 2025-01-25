import { ChainvoiceABI } from '@/contractsABI/ChainvoiceABI';
import { BrowserProvider, Contract, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'

function ReceivedInvoice() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [receivedInvoices, setReceivedInvoice] = useState([]);

  useEffect(() => {
    const fetchReceivedInvoices = async () => {
      try {
        setLoading(true);
        if (!walletClient) return;
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ChainvoiceABI, signer);
        const res = await contract.getMyReceivedInvoices(address);
        setReceivedInvoice(res);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchReceivedInvoices();
  }, [walletClient]);

  const payInvoice = async(id,amountDue) => {
    try {
      console.log(ethers.toBigInt(id));
        if (!walletClient) return;
        const provider=new BrowserProvider(walletClient);
        const signer=await provider.getSigner();
        const contract= new Contract(import.meta.env.VITE_CONTRACT_ADDRESS,ChainvoiceABI,signer);
  
        const res = await contract.payInvoice(ethers.toBigInt(id), {
          value: amountDue  
      });
        console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h2 className="text-lg font-bold">Received Invoice Request</h2>
      <h2 className="text-sm">Pay to your client request</h2>
      {loading ? (
        <p>Loading invoices...</p>
      ) : receivedInvoices.length > 0 ? (
        <ul>
          {receivedInvoices.map((invoice, index) => (
            <li
              key={index}
              className="m-4 grid grid-cols-12 items-center border p-3 shadow-lg rounded-md cursor-pointer"
            >
              <p className="col-span-4">
                From: {invoice.from.substring(0, 10)}...{invoice.from.substring(invoice.from.length - 10)}
              </p>
              <p className='col-span-4 text-start'>
                Amount : {ethers.formatUnits(invoice.amountDue)} ETH (sepolia)
              </p>
              <p className="col-span-3">
                Date: {new Date().toLocaleDateString()}
              </p>
              {
                invoice.isPaid ?
                  <button className="text-sm rounded-full text-white font-bold col-span-1 bg-green-600">Paid</button> :
                  <button className=' bg-red-500 p-1 rounded-md col-span-1' onClick={()=>{payInvoice(invoice.id,invoice.amountDue)}}>Pay Now</button>
              }
            </li>
          ))}
        </ul>
      ) : (
        <p>No invoices found</p>
      )}
    </div>
  )
}

export default ReceivedInvoice