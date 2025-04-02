import React, { useState, useEffect, useRef } from 'react';
import { BrowserProvider, formatEther } from "ethers";
import { useAccount } from 'wagmi';
import { convert } from '@/utils/CurrencyConversion';

function About() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [price,setPrice]=useState();
  useEffect(() => {
    async function fetchBalance() {
      if (!isConnected || !address) {
        setBalance('0');
        setLoading(false);
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const userBalance = await provider.getBalance(address);
        const ethBalance = formatEther(userBalance);
        setBalance(ethBalance);

        await convert.ready(); 
        const p =convert.USD.ETH(1);
        setPrice(p);
      } catch (error) {
        console.error('Balance fetch error:', error);
        setBalance('0');
      }

      setLoading(false);
    }

    fetchBalance();
  }, [address, isConnected]);

  if (!isConnected) return <div>Connect wallet to see balance</div>;
  if (loading) return <div>Loading balance...</div>;

  return (
    <div>
      <p>Balance: {balance} ETH</p>
      <p>$1 USD = {price} ETH</p>
    </div>
  );
}

export default About;
