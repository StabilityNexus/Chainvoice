import React, { useRef, useState } from "react";
import { TOKEN_PRESETS } from "@/utils/erc20_token";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
const POPULAR_TOKENS = [
  "0x0000000000000000000000000000000000000000", // ETH
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
  "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
  "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
];

function TokenSelector() {
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(TOKEN_PRESETS[0]);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);
  const filteredTokens = TOKEN_PRESETS.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <div className="mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-600"
          >
            <circle cx="8" cy="8" r="6"></circle>
            <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
            <path d="M7 6h1v4"></path>
            <path d="m16.71 13.88.7.71-2.82 2.82"></path>
          </svg>
          Payment Currency
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-auto flex-1">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payment Token
              </Label>
              <Select
                value={useCustomToken ? "custom" : selectedToken.address}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setUseCustomToken(true);
                  } else {
                    setUseCustomToken(false);
                    const token = TOKEN_PRESETS.find(
                      (t) => t.address === value
                    );
                    if (token) setSelectedToken(token);
                  }
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full h-12 bg-gray-50 hover:bg-gray-100 border-gray-200">
                  <SelectValue placeholder="Choose a token" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  {/* Search input for filtering */}
                  <div className="p-2 border-b">
                    <Input
                      ref={inputRef}
                      placeholder="Search tokens..."
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {!searchTerm && (
                    <div className="p-1">
                      <div className="px-3 py-1 text-xs font-medium text-gray-500">
                        Popular
                      </div>
                      {TOKEN_PRESETS.filter((token) =>
                        POPULAR_TOKENS.includes(token.address)
                      ).map((token) => (
                        <SelectItem
                          key={token.address}
                          value={token.address}
                          className="hover:bg-gray-50 focus:bg-gray-50"
                        >
                          <div className="flex items-center gap-3 py-1">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                              <img
                                src={token.logo}
                                alt={token.name}
                                width={28}
                                height={28}
                                className="object-contain"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/tokenImages/generic.png";
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">
                                {token.name}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">
                                {token.symbol}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  )}
                  <div className="p-1">
                    <div className="px-3 py-1 text-xs font-medium text-gray-500">
                      {searchTerm ? "Search Results" : "All Tokens"}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredTokens
                        .filter(
                          (token) => !POPULAR_TOKENS.includes(token.address)
                        )
                        .map((token) => (
                          <SelectItem
                            key={token.address}
                            value={token.address}
                            className="hover:bg-gray-50 focus:bg-gray-50"
                          >
                            <div className="flex items-center gap-3 py-1">
                              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img
                                  src={token.logo}
                                  alt={token.name}
                                  width={28}
                                  height={28}
                                  className="object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/tokenImages/generic.png";
                                  }}
                                />
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">
                                  {token.name}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">
                                  {token.symbol}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                    </div>
                    {filteredTokens.length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No tokens found
                      </div>
                    )}
                  </div>

                  <SelectItem
                    value="custom"
                    className="hover:bg-gray-50 focus:bg-gray-50 border-t border-gray-100 mt-1 pt-2"
                  >
                    <div className="flex items-center gap-3 py-1.5">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                        <PlusIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-900">
                        Custom Token
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!useCustomToken && (
              <div className="w-full sm:w-auto flex-1">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Details
                </Label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        // src={`/tokenImages/${selectedToken.symbol.toLowerCase()}.png`}
                        src={selectedToken.logo}
                        alt={selectedToken.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">
                        {selectedToken.name}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        {selectedToken.symbol}
                      </span>
                      <div className="text-xs text-gray-500 break-all">
                        {selectedToken.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {useCustomToken && (
            <div className="space-y-3">
              <div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Token Contract Address
                  </Label>
                  <Input
                    placeholder="0x..."
                    className=" h-10 bg-gray-50 text-gray-700 border-gray-200 focus:ring-2 focus:ring-blue-100"
                    value={customTokenAddress}
                    onChange={(e) => setCustomTokenAddress(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 my-2">
                    Enter a valid ERC-20 token contract address. Make sure to
                    verify the token details before proceeding.
                  </p>
                </div>
                {customTokenAddress && (
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border w-full border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Custom Token Selected
                          </p>
                          <p className="text-xs text-gray-500 break-all">
                            {customTokenAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-black"
                      onClick={() => {
                        /* Add verification logic here */
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1.5"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Verify Token
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {useCustomToken ? (
                "Please verify the token contract address before creating the invoice."
              ) : (
                <>
                  <span className="font-medium text-gray-700">Note:</span>{" "}
                  Payments will be processed in {selectedToken.symbol}. Ensure
                  your client has sufficient balance of this token.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TokenSelector;
