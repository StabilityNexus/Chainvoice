import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BrowserProvider, Contract} from 'ethers'
import { useAccount, useWalletClient } from 'wagmi'
import { ChainvoiceABI } from '../contractsABI/ChainvoiceABI';

function CreateInvoice() {
  const {data:walletClient} =useWalletClient();
  const { isConnected } = useAccount();
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isConnected || !walletClient) {
      alert('Please connect your wallet');
      return;
    }

    try {
      setLoading(true);
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS, 
        ChainvoiceABI, 
        signer
      ); 
      
      const response = await contract.getMySentInvoices();
      console.log(response);

      setReceiverAddress('');
      setAmount('');
    } catch (error) {
      console.error('Invoice creation error:', error);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='font-Inter'>
      <h2 className="text-lg font-bold mb-7">Create New Invoice Request</h2>
      <div className='grid mx-10'>
        <Input 
          type="text" 
          placeholder='Receiver address' 
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          className='w-1/2 my-2'
        />
        <Input 
          type="number" 
          placeholder='Amount (ETH)' 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='w-1/2 my-2'
        />        
        <Button 
          className="w-1/2 my-2" 
          onClick={handleClick}
          disabled={loading || !isConnected}
        >
          {loading ? 'Creating...' : 'Create Invoice Request'}
        </Button>
      </div>
    </div>
  )
}

export default CreateInvoice