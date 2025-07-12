import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainvoiceABI } from "@/contractsABI/ChainvoiceABI";
import { BrowserProvider, Contract, ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
import {
  Loader2,
  Shield,
  Banknote,
  Key,
  Wallet,
  DollarSignIcon,
} from "lucide-react";

const Treasure = () => {
  const [treasureAmount, setTreasureAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState({
    fetch: false,
    setAddress: false,
    withdraw: false,
  });
  const [treasuryAddress, setTreasuryAddress] = useState("");
  const [newTreasuryAddress, setNewTreasuryAddress] = useState("");

  useEffect(() => {
    const fetchTreasureAmount = async () => {
      try {
        if (!walletClient) return;
        setLoading((prev) => ({ ...prev, fetch: true }));
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new Contract(
          import.meta.env.VITE_CONTRACT_ADDRESS,
          ChainvoiceABI,
          signer
        );
        const [amt, add, feeAmt] = await Promise.all([
          contract.accumulatedFees(),
          contract.treasuryAddress(),
          contract.fee(),
        ]);
        setTreasureAmount(ethers.formatUnits(amt));
        setTreasuryAddress(add);
        setFee(ethers.formatUnits(feeAmt));
      } catch (error) {
        console.error("Error fetching treasure amount:", error);
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchTreasureAmount();
  }, [walletClient]);

  const handleSetTreasuryAddress = async () => {
    if (!ethers.isAddress(newTreasuryAddress)) {
      alert("Please enter a valid Ethereum address");
      return;
    }
    try {
      if (!walletClient) return;
      setLoading((prev) => ({ ...prev, setAddress: true }));
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ChainvoiceABI,
        signer
      );
      const tx = await contract.setTreasuryAddress(newTreasuryAddress);
      await tx.wait();
      setTreasuryAddress(newTreasuryAddress);
      setNewTreasuryAddress("");
      alert("Treasury address updated successfully!");
    } catch (error) {
      console.error("Error setting treasury address:", error);
      alert(error.message || "Failed to update treasury address");
    } finally {
      setLoading((prev) => ({ ...prev, setAddress: false }));
    }
  };

  const handleWithdrawCollection = async () => {
    try {
      if (!walletClient) return;
      setLoading((prev) => ({ ...prev, withdraw: true }));
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ChainvoiceABI,
        signer
      );
      const tx = await contract.withdrawFees();
      await tx.wait();
      const newAmt = await contract.accumulatedFees();
      setTreasureAmount(ethers.formatUnits(newAmt));
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing collection:", error);
      alert(error.message || "Failed to withdraw funds");
    } finally {
      setLoading((prev) => ({ ...prev, withdraw: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-900/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 h-full">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-4 bg-green-900/20 rounded-full">
                  <Shield
                    className="h-12 w-12 text-green-400"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Treasury Vault
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-300 ml-2">
                      Current Balance:
                    </span>
                    <span className="font-mono text-green-400 ml-auto px-2">
                      {loading.fetch ? (
                        <Loader2 className="h-4 w-4 animate-spin inline" />
                      ) : (
                        `${treasureAmount} ETH`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
                    <DollarSignIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-300 ml-2">
                      Fee Per Transaction:
                    </span>
                    <span className="font-mono text-green-400 ml-auto px-2">
                      {loading.fetch ? (
                        <Loader2 className="h-4 w-4 animate-spin inline" />
                      ) : (
                        `${fee} ETH`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-lg">
                    <Key className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-300 ml-2">
                      Admin Access Only
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-1/2 bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 w-full">
          <h1 className="text-3xl font-bold text-white mb-2">
            Treasury <span className="text-green-500">Controls</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Secure management of platform funds and treasury settings
          </p>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Key className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-white font-medium">Current Treasury</h3>
            </div>
            <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
              <p className="text-sm font-mono text-green-400 break-all">
                {loading.fetch ? (
                  <Loader2 className="h-4 w-4 animate-spin inline" />
                ) : treasuryAddress ? (
                  treasuryAddress
                ) : (
                  "Not configured"
                )}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-3">
              <Banknote className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-white font-medium">
                Update Treasury Address
              </h3>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="0x..."
                value={newTreasuryAddress}
                onChange={(e) => setNewTreasuryAddress(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white font-mono text-sm"
              />
              <Button
                onClick={handleSetTreasuryAddress}
                disabled={loading.setAddress || !newTreasuryAddress}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading.setAddress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Requires contract owner privileges
            </p>
          </div>

          {/* Withdraw */}
          <div>
            <div className="flex items-center mb-3">
              <Banknote className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-white font-medium">Funds Withdrawal</h3>
            </div>
            <Button
              onClick={handleWithdrawCollection}
              disabled={loading.withdraw || treasureAmount <= 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading.withdraw ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Transfer {treasureAmount} ETH
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Will be sent to the current treasury address
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasure;
