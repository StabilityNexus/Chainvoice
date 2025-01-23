import { defineChain } from "viem";

export const citreaTestnet = defineChain({
  id: 5115, 
  name: "Citrea Testnet",
  nativeCurrency: {
    name: "cBTC", 
    symbol: "cBTC", 
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.citrea.xyz"], 
    },
  },
  blockExplorers: {
    default: {
      name: "citrea", 
      url: "https://explorer.testnet.citrea.xyz", 
    },
  },
});
