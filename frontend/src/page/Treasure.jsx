import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainvoiceABI } from "@/contractsABI/ChainvoiceABI";
import { BrowserProvider, Contract, ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWalletClient, useAccount } from "wagmi";
import {
  Loader2,
  Shield,
  Banknote,
  Key,
  Wallet,
  DollarSign,
  Settings,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { SHELL } from "@/utils/layout";
import { getWagmiChainInfo } from "@/utils/wagmiChainHelpers";

const Treasure = () => {
  const [treasureAmount, setTreasureAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const { data: walletClient } = useWalletClient();
  const { chainId, chain, address: account } = useAccount();
  const nativeSymbol =
    getWagmiChainInfo(chainId)?.nativeCurrency?.symbol ||
    chain?.nativeCurrency?.symbol ||
    "ETH";
  const [loading, setLoading] = useState({
    fetch: false,
    setAddress: false,
    withdraw: false,
    feeUpdate: false,
  });
  const [dev, setDev] = useState("");
  const [devFeeReceiver, setDevFeeReceiver] = useState("");
  const [newDevFeeReceiver, setNewDevFeeReceiver] = useState("");
  // Fee settings are controlled by the contract's dev address, not an owner.
  const isDev =
    !!account &&
    !!dev &&
    account.toLowerCase() === dev.toLowerCase();
  const [newFee, setNewFee] = useState("");

  useEffect(() => {
    // Values from another chain would be shown in this chain's currency, and a
    // slower read from the previous chain could land after this one.
    let active = true;
    setTreasureAmount(0);
    setFee(0);
    setDev("");
    setDevFeeReceiver("");
    setLoading((prev) => ({ ...prev, fetch: false }));

    const fetchTreasureAmount = async () => {
      try {
        if (!chainId) {
          throw new Error("Missing chainId: wallet connected but chain not configured");
        }
        if (!walletClient) return;
        setLoading((prev) => ({ ...prev, fetch: true }));
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contractAddress = import.meta.env[
          `VITE_CONTRACT_ADDRESS_${chainId}`
        ];

        if (!contractAddress) {
          throw new Error("Unsupported network");
        }

        const contract = new Contract(contractAddress, ChainvoiceABI, signer);
        const [amt, receiver, devAddress, feeAmt] = await Promise.all([
          contract.accumulatedDevFees(),
          contract.devFeeReceiver(),
          contract.dev(),
          contract.devFee(),
        ]);
        if (!active) return;
        setTreasureAmount(ethers.formatUnits(amt));
        setDevFeeReceiver(receiver);
        setDev(devAddress);
        setFee(ethers.formatUnits(feeAmt));
      } catch (error) {
        console.error("Error fetching treasure amount:", error);
      } finally {
        if (active) setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchTreasureAmount();
    return () => {
      active = false;
    };
  }, [walletClient, chainId]);

  const handleSetDevFeeReceiver = async () => {
    if (!isDev) {
      toast.error("Only the dev address can update the fee receiver");
      return;
    }
    if (!ethers.isAddress(newDevFeeReceiver)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    try {
      if (!chainId) {
        throw new Error("Missing chainId: wallet connected but chain not configured");
      }
      if (!walletClient) return;
      setLoading((prev) => ({ ...prev, setAddress: true }));
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contractAddress = import.meta.env[
        `VITE_CONTRACT_ADDRESS_${chainId}`
      ];

      if (!contractAddress) {
        throw new Error("Unsupported network");
      }

      const contract = new Contract(contractAddress, ChainvoiceABI, signer);
      const tx = await contract.setDevFeeReceiver(newDevFeeReceiver);
      await tx.wait();
      setDevFeeReceiver(newDevFeeReceiver);
      setNewDevFeeReceiver("");
      toast.success("Fee receiver updated successfully!");
    } catch (error) {
      console.error("Error setting fee receiver:", error);
      toast.error(error.message || "Failed to update fee receiver");
    } finally {
      setLoading((prev) => ({ ...prev, setAddress: false }));
    }
  };

  const handleWithdrawCollection = async () => {
    try {
      if (!chainId) {
        throw new Error("Missing chainId: wallet connected but chain not configured");
      }
      if (!walletClient) return;
      setLoading((prev) => ({ ...prev, withdraw: true }));
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contractAddress = import.meta.env[
        `VITE_CONTRACT_ADDRESS_${chainId}`
      ];

      if (!contractAddress) {
        throw new Error("Unsupported network");
      }

      const contract = new Contract(contractAddress, ChainvoiceABI, signer);
      const tx = await contract.withdrawFees();
      await tx.wait();
      const newAmt = await contract.accumulatedDevFees();
      setTreasureAmount(ethers.formatUnits(newAmt));
      toast.success("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing collection:", error);
      toast.error(error.message || "Failed to withdraw funds");
    } finally {
      setLoading((prev) => ({ ...prev, withdraw: false }));
    }
  };

  const handleUpdateFee = async () => {
    if (!isDev) {
      toast.error("Only the dev address can update the fee");
      return;
    }
    if (!newFee || isNaN(newFee)) {
      toast.error("Please enter a valid fee amount");
      return;
    }
    try {
      if (!chainId) {
        throw new Error("Missing chainId: wallet connected but chain not configured");
      }
      if (!walletClient) return;
      setLoading((prev) => ({ ...prev, feeUpdate: true }));
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contractAddress = import.meta.env[
        `VITE_CONTRACT_ADDRESS_${chainId}`
      ];

      if (!contractAddress) {
        throw new Error("Unsupported network");
      }

      const contract = new Contract(contractAddress, ChainvoiceABI, signer);
      const tx = await contract.setDevFee(
        ethers.parseUnits(newFee, "ether")
      );
      await tx.wait();
      const updatedFee = await contract.devFee();
      setFee(ethers.formatUnits(updatedFee));
      setNewFee("");
      toast.success("Fee updated successfully!");
    } catch (error) {
      console.error("Error updating fee:", error);
      toast.error(error.message || "Failed to update fee");
    } finally {
      setLoading((prev) => ({ ...prev, feeUpdate: false }));
    }
  };

  return (
    <div className={cn(SHELL, "py-10")}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-8"
      >
        {/* Treasury Overview Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="lg:w-1/2 flex justify-center"
        >
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-900/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 rounded-3xl p-8 h-full shadow-2xl">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-4 bg-green-900/20 rounded-full backdrop-blur-sm">
                  <Shield
                    className="h-12 w-12 text-green-400"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Treasury Vault
                </h3>

                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-gray-300 mr-3" />
                      <span className="text-gray-300">Current Balance</span>
                    </div>
                    <span className="font-mono text-green-400">
                      {loading.fetch ? (
                        <Loader2 className="h-4 w-4 animate-spin inline" />
                      ) : (
                        `${treasureAmount} ${nativeSymbol}`
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-300 mr-3" />
                      <span className="text-gray-300">Transaction Fee</span>
                    </div>
                    <span className="font-mono text-green-400">
                      {loading.fetch ? (
                        <Loader2 className="h-4 w-4 animate-spin inline" />
                      ) : (
                        `${fee} ${nativeSymbol}`
                      )}
                    </span>
                  </div>

                  <div className="flex items-center p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <Key className="h-5 w-5 text-gray-300 mr-3" />
                    <span className="text-gray-300">
                      {isDev
                        ? "Connected as dev"
                        : "Dev Access Only"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:w-1/2 bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-lg"
        >
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-green-400 mr-2" />
            <h1 className="text-2xl font-bold text-white">
              Treasury <span className="text-green-400">Controls</span>
            </h1>
          </div>
          <p className="text-gray-400 mb-8">
            Manage platform funds and configuration settings
          </p>

          {/* Fee Receiver Section */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <Key className="h-5 w-5 text-gray-300 mr-2" />
              <h3 className="text-lg font-medium text-white">
                Fee Receiver
              </h3>
            </div>
            <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 mb-4">
              <p className="text-sm font-mono text-green-400 break-all">
                {loading.fetch ? (
                  <Loader2 className="h-4 w-4 animate-spin inline" />
                ) : devFeeReceiver ? (
                  devFeeReceiver
                ) : (
                  "Not configured"
                )}
              </p>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="New fee receiver address (0x...)"
                value={newDevFeeReceiver}
                onChange={(e) => setNewDevFeeReceiver(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white font-mono"
              />
              <Button
                onClick={handleSetDevFeeReceiver}
                disabled={loading.setAddress || !newDevFeeReceiver || !isDev}
                className="w-full bg-green-600 hover:bg-green-700 h-11"
              >
                {loading.setAddress ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <span className="flex items-center">
                    Update Address <ChevronRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Requires the dev address
              </p>
            </div>
          </div>

          {/* Fee Adjustment Section */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <DollarSign className="h-5 w-5 text-gray-300 mr-2" />
              <h3 className="text-lg font-medium text-white">
                Transaction Fee
              </h3>
            </div>
            <div className="space-y-3">
              <Input
                type="number"
                placeholder={`Current: ${fee} ${nativeSymbol}`}
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white font-mono"
              />
              <Button
                onClick={handleUpdateFee}
                disabled={loading.feeUpdate || !newFee || !isDev}
                className="w-full bg-green-600 hover:bg-green-700 h-11"
              >
                {loading.feeUpdate ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <span className="flex items-center">
                    Update Fee <ChevronRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
              <p className="text-xs text-gray-500">
                Applies to all future transactions
              </p>
            </div>
          </div>

          {/* Withdrawal Section */}
          <div>
            <div className="flex items-center mb-3">
              <Banknote className="h-5 w-5 text-gray-300 mr-2" />
              <h3 className="text-lg font-medium text-white">Withdraw Funds</h3>
            </div>
            <Button
              onClick={handleWithdrawCollection}
              disabled={loading.withdraw || treasureAmount <= 0}
              className="w-full bg-green-600 hover:bg-green-700 h-11"
            >
              {loading.withdraw ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <span className="flex items-center">
                  Withdraw {treasureAmount} {nativeSymbol}{" "}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Funds will be sent to the current fee receiver
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Treasure;
