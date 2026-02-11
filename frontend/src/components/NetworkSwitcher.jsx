import { useChainId, useSwitchChain, useAccount } from "wagmi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { FaEthereum } from "react-icons/fa";
import { SiBinance, SiPolygon, SiCoinbase } from "react-icons/si";
import { cn } from "@/lib/utils";
import { FaBitcoin } from "react-icons/fa";

const CHAIN_ICONS = {
  1: <FaEthereum className="h-5 w-5 text-blue-400" />, // Ethereum
  61: <FaEthereum className="h-5 w-5 text-green-500" />, // Ethereum Classic
  137: <SiPolygon className="h-5 w-5 text-purple-500" />, // Polygon
  56: <SiBinance className="h-5 w-5 text-yellow-500" />, // BSC
  8453: <SiCoinbase className="h-5 w-5 text-blue-500" />, // Base
  11155111: <FaEthereum className="h-5 w-5 text-gray-400" />, // Sepolia
  5115: <FaBitcoin className="h-5 w-5 text-orange-500" />, //Citrea Testnet
};

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function NetworkSwitcher() {
  const chainId = useChainId();
  const { chains, switchChain, isPending, error } = useSwitchChain();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (error) {
      toast.error(`Failed to switch network: ${error.message}`);
    }
  }, [error]);

  if (!isConnected) return null;

  const activeChain = chains.find((c) => c.id === chainId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between border-gray-700 bg-[#1f2937] text-white hover:bg-[#374151] hover:text-white"
        >
          <div className="flex items-center gap-2">
            {CHAIN_ICONS[chainId] || <FaEthereum className="h-5 w-5 text-gray-400" />}
            <span className="truncate">{activeChain?.name || "Select Network"}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 border-gray-700 bg-[#1f2937] text-white">
        <div className="grid gap-1 p-2">
          {chains.map((chain) => (
            <Button
              key={chain.id}
              variant="ghost"
              className={cn(
                "justify-start font-normal hover:bg-[#374151] hover:text-white",
                chainId === chain.id && "bg-[#374151]"
              )}
              onClick={() => switchChain({ chainId: chain.id })}
              disabled={isPending}
            >
              <div className="flex items-center gap-2 w-full">
                {CHAIN_ICONS[chain.id] || <div className="w-5 h-5 rounded-full bg-gray-600" />}
                <span className="truncate flex-1 text-left">{chain.name}</span>
                {chainId === chain.id && (
                  <Check className="ml-auto h-4 w-4 text-green-500" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
