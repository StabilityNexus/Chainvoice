import { mainnet, classic, polygon, bsc, base, sepolia } from 'wagmi/chains';
import { citreaTestnet } from './CitreaTestnet'; // Import your new chain

export const chainConfig = [mainnet, classic, polygon, bsc, base, sepolia, citreaTestnet];