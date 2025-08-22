import React, { useState, useEffect, useRef } from "react";
import { useAccount, useWalletClient } from "wagmi"; 
import {
  Copy,
  Link,
  Check,
  Wallet,
  PlusIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react"; 
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TOKEN_PRESETS } from "@/utils/erc20_token";
import WalletConnectionAlert from "@/components/WalletConnectionAlert";
import TokenIntegrationRequest from "@/components/TokenIntegrationRequest";
import { BrowserProvider, ethers } from "ethers"; 
import { ERC20_ABI } from "@/contractsABI/ERC20_ABI";

const GenerateLink = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient(); 
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);

  // Token selection state
  const [selectedToken, setSelectedToken] = useState(TOKEN_PRESETS[0]);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);
  const [tokenVerificationState, setTokenVerificationState] = useState("idle");
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredTokens = TOKEN_PRESETS.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const POPULAR_TOKENS = [
    "0x0000000000000000000000000000000000000000", // ETH
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
    "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
  ];

  const TESTNET_TOKEN = ["0xB5E9C6e57C9d312937A059089B547d0036c155C7"];

  useEffect(() => {
    setShowWalletAlert(!isConnected);
  }, [isConnected]);

  const generateLink = () => {
    const tokenToUse = useCustomToken ? verifiedToken : selectedToken;

    if (!tokenToUse) {
      return `${window.location.origin}/dashboard/create?clientAddress=${
        address || ""
      }`;
    }

    const params = new URLSearchParams({
      clientAddress: address || "",
      tokenAddress: tokenToUse.address,
      customToken: useCustomToken ? true : false,
      chain: "1",
    });

    if (amount) {
      params.append("amount", amount);
    }
    if (description) {
      params.append("description", description);
    }

    return `${window.location.origin}/dashboard/create?${params.toString()}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const verifyToken = async (address) => {
    if (!walletClient) return; 

    setTokenVerificationState("verifying");

    try {
      const provider = new BrowserProvider(walletClient);
      const contract = new ethers.Contract(address, ERC20_ABI, provider);

      const [symbol, name, decimals] = await Promise.all([
        contract.symbol().catch(() => "UNKNOWN"),
        contract.name().catch(() => "Unknown Token"),
        contract.decimals().catch(() => 18),
      ]);
      setVerifiedToken({ address, symbol, name, decimals });
      setTokenVerificationState("success");
    } catch (error) {
      console.error("Verification failed:", error);
      setTokenVerificationState("error");
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <WalletConnectionAlert
          show={showWalletAlert}
          message="Connect your wallet to create and manage invoices"
          onDismiss={() => setShowWalletAlert(false)}
        />
      </div>

      <div
        className={`space-y-6 mx-6 transition-all duration-300 ${
          !isConnected ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Link className="h-5 w-5 text-green-400" />
            </div>
            Generate Prefilled Invoice Link
          </h2>
          <p className="text-gray-300 text-sm">
            Create a shareable link that pre-fills the invoice form with your
            details.
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Wallet Address
              </Label>
              <Input
                value={address || "Connect wallet to see address"}
                readOnly
                className="bg-gray-50 text-gray-500 border-gray-300 font-mono text-sm"
              />
            </div>

            {/* Token Selection */}
            <div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-full sm:w-auto flex-1">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Payment Token
                    </Label>
                    <Select
                      value={
                        useCustomToken ? "custom" : selectedToken?.address || ""
                      }
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setUseCustomToken(true);
                          setSelectedToken(null);
                        } else {
                          setUseCustomToken(false);
                          const token = TOKEN_PRESETS.find(
                            (t) => t.address === value
                          );
                          if (token) {
                            setSelectedToken(token);
                            setCustomTokenAddress("");
                            setTokenVerificationState("idle");
                            setVerifiedToken(null);
                          }
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
                          <>
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
                            <div className="p-1">
                              <div className="px-3 py-1 text-xs font-medium text-gray-500">
                                Testnet Token
                              </div>
                              {TOKEN_PRESETS.filter((token) =>
                                TESTNET_TOKEN.includes(token.address)
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
                          </>
                        )}
                        <div className="p-1">
                          <div className="px-3 py-1 text-xs font-medium text-gray-500">
                            {searchTerm ? "Search Results" : "All Tokens"}
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {filteredTokens
                              .filter(
                                (token) =>
                                  !POPULAR_TOKENS.includes(token.address) &&
                                  !TESTNET_TOKEN.includes(token.address)
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

                  {!useCustomToken && selectedToken && (
                    <div className="w-full sm:w-auto flex-1">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Token Details
                      </Label>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img
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
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Token Contract Address
                      </Label>
                      <Input
                        placeholder="0x..."
                        value={customTokenAddress}
                        onChange={(e) => {
                          const address = e.target.value;
                          setCustomTokenAddress(address);
                          if (!address || !ethers.isAddress(address)) {
                            setTokenVerificationState("idle");
                            setVerifiedToken(null);
                          } else if (ethers.isAddress(address)) {
                            verifyToken(address);
                          }
                        }}
                        className="h-10 bg-gray-50 text-gray-700 border-gray-200 focus:ring-2 focus:ring-blue-100"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 my-2">
                        Enter a valid ERC-20 token contract address
                      </p>
                    </div>

                    {tokenVerificationState === "verifying" && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying token...
                      </div>
                    )}

                    {tokenVerificationState === "success" && verifiedToken && (
                      <div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                            <div>
                              <p className="font-medium text-gray-800">
                                {verifiedToken.name} ({verifiedToken.symbol})
                              </p>
                              <p className="text-xs text-gray-500 break-all">
                                {verifiedToken.address}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                <p>
                                  Decimals: {String(verifiedToken.decimals)}
                                </p>
                              </p>
                            </div>
                          </div>
                        </div>
                        <TokenIntegrationRequest address={customTokenAddress} />
                      </div>
                    )}

                    {tokenVerificationState === "error" && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <div className="flex items-center gap-3">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <p className="text-sm text-red-600">
                            Failed to verify token. Please check the address.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generated Link Preview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Link className="h-4 w-4 text-green-500" />
            </div>
            <Label className="text-sm font-medium text-gray-700">
              Generated Link
            </Label>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <Input
              value={generateLink()}
              readOnly
              className="bg-gray-50 text-gray-600 border-gray-300 text-xs font-mono flex-1"
            />
            <Button
              onClick={copyToClipboard}
              disabled={!isConnected}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-700 flex items-start gap-2">
              <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
              Share this link with clients to let them create invoices with your
              details pre-filled. They can access it even without a wallet
              connected initially.
            </p>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-gray-600" />
            How it works
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-green-600">1</span>
              </div>
              <span>Copy and share the generated link with your clients</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-green-600">2</span>
              </div>
              <span>
                Clients can open the link and see a pre-filled invoice form
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-green-600">3</span>
              </div>
              <span>
                They only need to fill in remaining details and connect their
                wallet to create the invoice
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateLink;
