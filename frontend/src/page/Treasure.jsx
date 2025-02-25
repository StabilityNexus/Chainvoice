import { ChainvoiceABI } from "@/contractsABI/ChainvoiceABI";
import { BrowserProvider, Contract, ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";

const Treasure = () => {
  const [treasureAmount, setTreasureAmount] = useState(0);
  const { data: walletClient } = useWalletClient(); 
  const [loading, setLoading] = useState(false);
  const [treasuryAddress,setTreasuryAddress]=useState();
  useEffect(() => {
    const fetchTreasureAmount = async () => {
      try {
        if (!walletClient) return;
        setLoading(true);
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ChainvoiceABI, signer);
        const amt = await contract.accumulatedFees(); 
        setTreasureAmount(ethers.formatUnits(amt));
        const add=await contract.treasuryAddress();
        setTreasuryAddress(add);
      } catch (error) {
        console.error("Error fetching treasure amount:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreasureAmount();
  }, [walletClient]);

  return (
    <div>
      <h2 className="text-lg font-bold">Treasure</h2>
      <p>Treasure Account : {treasuryAddress}</p>
      {loading ? <p>Loading...</p> : <p>{treasureAmount}</p>}
    </div>
  );
};

export default Treasure;
