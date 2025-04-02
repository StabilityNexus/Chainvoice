import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainvoiceABI } from "@/contractsABI/ChainvoiceABI";
import { BrowserProvider, Contract, ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";

const Treasure = () => {
  const [treasureAmount, setTreasureAmount] = useState(0);
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [treasuryAddress, setTreasuryAddress] = useState("");
  const [newTreasuryAddress, setNewTreasuryAddress] = useState("");

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
        const add = await contract.treasuryAddress();
        setTreasuryAddress(add);
      } catch (error) {
        console.error("Error fetching treasure amount:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreasureAmount();
  }, [walletClient]);

  const handleSetTreasuryAddress = async () => {
    if (!ethers.isAddress(newTreasuryAddress)) {
      console.error("Invalid address:", newTreasuryAddress);
      return;
    }
    try {
      if (!walletClient || !newTreasuryAddress) return;
      setLoading(true);
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ChainvoiceABI, signer);
      const tx = await contract.setTreasuryAddress(newTreasuryAddress);
      await tx.wait();
      setTreasuryAddress(newTreasuryAddress);
      setNewTreasuryAddress("");
    } catch (error) {
      console.error("Error setting treasury address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawCollection = async () => {
    try {
      if (!walletClient) return;
      setLoading(true);
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ChainvoiceABI, signer);
      const amt = await contract.withdraw();
      setTreasureAmount(ethers.formatUnits(amt));
    } catch (error) {
      console.error("Error withdrawing collection:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-10 justify-center text-center w-full max-w-8xl mx-auto p-6">

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl hover:shadow-green-500/20 transition-shadow duration-500">
        <h1 className="text-white text-start text-4xl font-bold mb-4">
          Treasure <span className="text-green-500">Account</span>
        </h1>
        <p className="text-gray-400 text-start mb-6">
          The treasure account is the account where all the fees collected from the platform are stored.
        </p>

        <div className="text-start mb-6">
          <p className="text-white text-lg font-bold">Treasure Amount:</p>
          <p className="text-green-500 text-3xl font-bold animate-pulse">
            {loading ? "Loading..." : `${treasureAmount} ETH`}
          </p>
        </div>

        <div className="text-start mb-6">
          <p className="text-white text-lg font-bold">Treasury Address:</p>
          <p className="text-green-500 text-lg break-words">
            {loading ? "Loading..." : treasuryAddress}
          </p>
        </div>

        <div className="text-start mb-6">
          <p className="text-white text-lg font-bold mb-2">Set New Treasury Address</p>
          <div className="flex gap-2">
            <Input
              type="text"
              className="text-white bg-gray-700 border-gray-600 focus:border-green-500 focus:ring-green-500"
              placeholder="0x1234..."
              value={newTreasuryAddress}
              onChange={(e) => setNewTreasuryAddress(e.target.value)}
            />
            <Button
              className="bg-green-600 text-white px-6 hover:bg-green-700 transition-colors duration-300"
              onClick={handleSetTreasuryAddress}
              disabled={loading}
            >
              {loading ? "Setting..." : "Set Address"}
            </Button>
          </div>
          <p className="text-sm text-red-400 bg-red-900/20 p-2 mt-2 rounded-lg">
            <strong>Disclaimer:</strong> Only the owner of the contract can set the treasury address.
          </p>
        </div>

        <div className="text-start">
          <p className="text-white text-lg font-bold mb-2">Withdraw Collection</p>
          <Button
            className="bg-green-600 text-white px-6 hover:bg-green-700 transition-colors duration-300"
            onClick={handleWithdrawCollection}
            disabled={loading}
          >
            {loading ? "Withdrawing..." : "Withdraw Collection"}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <img
          src="treasure.png"
          alt="Treasure Illustration"
          className="w-full max-w-md transition-transform duration-500 ease-in-out hover:translate-x-[-10px] hover:scale-105"
        />
      </div>
    </div>
  );
};

export default Treasure;