const TOKENS_BY_CHAIN = {
  1: [
    {
      name: "Ethereum",
      symbol: "ETH",
      address: "0x0000000000000000000000000000000000000000",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
      decimals: 18,
    },
    {
      name: "USDC",
      symbol: "USDC",
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
      decimals: 6,
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
      decimals: 6,
    },
    {
      name: "DAI",
      symbol: "DAI",
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=026",
      decimals: 18,
    },
    {
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      logo: "https://cryptologos.cc/logos/weth-weth-logo.png?v=026",
      decimals: 18,
    }
  ],
  61: [
    {
        name: "Ethereum Classic",
        symbol: "ETC",
        address: "0x0000000000000000000000000000000000000000",
        logo: "https://cryptologos.cc/logos/ethereum-classic-etc-logo.png?v=026",
        decimals: 18,
    },
     // ETC tokens can be added here
  ],
  137: [
    {
        name: "Polygon",
        symbol: "MATIC",
        address: "0x0000000000000000000000000000000000000000",
        logo: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=026",
        decimals: 18,
    },
    {
        name: "USDC (Polygon)",
        symbol: "USDC",
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
        decimals: 6,
    },
    {
        name: "Tether USD (Polygon)",
        symbol: "USDT",
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
        decimals: 6,
    }
  ],
  56: [
    {
        name: "BNB",
        symbol: "BNB",
        address: "0x0000000000000000000000000000000000000000",
        logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026",
        decimals: 18,
    },
    {
        name: "USDC (BSC)",
        symbol: "USDC",
        address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
        decimals: 18,
    },
    {
        name: "Tether USD (BSC)",
        symbol: "USDT",
        address: "0x55d398326f99059fF775485246999027B3197955",
        logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
        decimals: 18,
    }
  ],
  8453: [
    {
        name: "Ethereum (Base)",
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
        decimals: 18,
    },
    {
        name: "USDC (Base)",
        symbol: "USDC",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
        decimals: 6,
    }
  ]
};

export const getTokenPresetsForChain = (chainId) => {
  return TOKENS_BY_CHAIN[chainId] || TOKENS_BY_CHAIN[1]; // Default to Ethereum tokens if chain not found
};

export const TOKEN_PRESETS = TOKENS_BY_CHAIN[1]; // Keep backward compatibility export for now
