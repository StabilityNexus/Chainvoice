import { useAccount, useBalance } from 'wagmi';

export const CustomBalance = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading } = useBalance({ address });

  if (!isConnected || !balance) return null;

  
  const symbol = chain?.nativeCurrency?.symbol || balance.symbol || 'ETH';
  const formatted = parseFloat(balance.formatted).toFixed(4);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
      <span className="text-sm font-semibold text-white">
        {isLoading ? '...' : formatted}
      </span>
      <span className="text-xs font-medium text-green-400">
        {symbol}
      </span>
    </div>
  );
};