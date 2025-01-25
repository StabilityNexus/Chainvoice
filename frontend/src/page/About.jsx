import React, { useState, useEffect } from 'react'
import {BrowserProvider, JsonRpcProvider, formatEther } from "ethers";
import { useAccount, useWalletClient } from 'wagmi';

function About() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchBalance() {
      if (!isConnected || !address) {
        setBalance('0');
        setLoading(false);
        return;
      }

      try {
        // const provider = new JsonRpcProvider(import.meta.env.VITE_BLOCKCHAIN_URI);
        const provider = new BrowserProvider(window.ethereum);
        // const signer = await provider.getSigner();
        const userBalance = await provider.getBalance(address);
        setBalance(formatEther(userBalance));
        setLoading(false);
      } catch (error) {
        console.error('Balance fetch error:', error);
        setBalance('0');
        setLoading(false);
      }
    }

    fetchBalance();
  }, [address, isConnected]);

  if (!isConnected) return <div>Connect wallet to see balance</div>;
  if (loading) return <div>Loading balance...</div>;

  return (
    <div>
      Balance: {balance} ETH
    </div>
  )
}

export default About