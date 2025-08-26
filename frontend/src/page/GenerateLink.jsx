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
  Coins,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { cn } from "@/lib/utils";

import WalletConnectionAlert from "@/components/WalletConnectionAlert";
import TokenIntegrationRequest from "@/components/TokenIntegrationRequest";
import TokenPicker, { ToggleSwitch } from "@/components/TokenPicker";
import { CopyButton } from "@/components/ui/copyButton";
import { Badge } from "@/components/ui/badge";
import { BrowserProvider, ethers } from "ethers";
import { ERC20_ABI } from "@/contractsABI/ERC20_ABI";
import { useTokenList } from "../hooks/useTokenList"; // Import the hook instead of TOKEN_PRESETS


const GenerateLink = () => {
  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);

  // Get tokens from the new hook
  const { tokens } = useTokenList(chainId || 1);

  // Token selection state
  const [selectedToken, setSelectedToken] = useState(null); 
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);
  const [tokenVerificationState, setTokenVerificationState] = useState("idle");
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set default token when tokens are loaded
  useEffect(() => {
    if (tokens.length > 0 && !selectedToken && !useCustomToken) {
      // Find ETH or use first token as default
      const ethToken = tokens.find(
        (token) =>
          token.symbol.toLowerCase() === "eth" ||
          token.contract_address ===
            "0x0000000000000000000000000000000000000000"
      );
      setSelectedToken(ethToken || tokens[0]);
    }
  }, [tokens, selectedToken, useCustomToken]);

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
      tokenAddress: tokenToUse.address || tokenToUse.contract_address,
      customToken: useCustomToken ? "true" : "false",
      chain: chainId?.toString() || "1",
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

      <div className="space-y-6 mx-6 transition-all duration-300">
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

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Amount (Optional)
                </Label>
                <Input
                  placeholder="e.g., 100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description (Optional)
                </Label>
                <Input
                  placeholder="e.g., Web design services"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Token Selection */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
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
                {/* Toggle Switch */}
                <ToggleSwitch
                  enabled={useCustomToken}
                  onChange={(enabled) => {
                    setUseCustomToken(enabled);
                    if (enabled) {
                      setSelectedToken(null);
                    } else {
                      // Reset to first token when switching back
                      if (tokens.length > 0) {
                        const ethToken = tokens.find(
                          (token) =>
                            token.symbol.toLowerCase() === "eth" ||
                            token.contract_address ===
                              "0x0000000000000000000000000000000000000000"
                        );
                        setSelectedToken(ethToken || tokens[0]);
                      }
                    }
                  }}
                  leftLabel="Select Token"
                  rightLabel="Input Custom Token"
                />

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-full sm:w-auto flex-1">
                    {!useCustomToken ? (
                      <>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Choose from Available Tokens
                        </Label>
                        <TokenPicker
                          selected={selectedToken}
                          onSelect={(token) => {
                            setSelectedToken({
                              address: token.contract_address,
                              symbol: token.symbol,
                              name: token.name,
                              logo: token.image,
                              decimals: 18,
                            });
                          }}
                          chainId={chainId || 1}
                          disabled={loading}
                          className="w-full"
                          allowCustom={false}
                        />
                      </>
                    ) : (
                      <>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Token Contract Address
                        </Label>

                        {/* Custom Token Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Coins className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-blue-900 mb-1">
                                Custom Token Setup
                              </h4>
                              <p className="text-sm text-blue-700 mb-2">
                                Enter the contract address of the ERC-20 token
                                you want to use for payments.
                              </p>
                              <ul className="text-xs text-blue-600 space-y-1">
                                <li>
                                  • Make sure the token contract is deployed and
                                  verified
                                </li>
                                <li>
                                  • Address should start with "0x" followed by
                                  40 characters
                                </li>
                                <li>
                                  • Token will be verified automatically after
                                  entering
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <Input
                          placeholder="0x... (Enter token contract address)"
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
                          className="h-12 bg-gray-50 text-gray-700 border-gray-200"
                          disabled={loading}
                        />

                        {tokenVerificationState === "verifying" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg border border-yellow-200 mt-3">
                            <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                            <span className="text-yellow-700">
                              Verifying token contract...
                            </span>
                          </div>
                        )}

                        {tokenVerificationState === "success" &&
                          verifiedToken && (
                            <div className="mt-3">
                              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <p className="font-medium text-green-800">
                                        {verifiedToken.name} (
                                        {verifiedToken.symbol})
                                      </p>
                                      <Badge className="bg-green-100 text-green-700 text-xs">
                                        Verified ✓
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm text-green-600 font-mono">
                                        {verifiedToken.address}
                                      </span>
                                      <CopyButton
                                        textToCopy={verifiedToken.address}
                                      />
                                    </div>
                                    <p className="text-xs text-green-600">
                                      Decimals: {String(verifiedToken.decimals)}{" "}
                                      • Contract verified and ready to use
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <TokenIntegrationRequest
                                address={customTokenAddress}
                              />
                            </div>
                          )}

                        {tokenVerificationState === "error" && (
                          <div className="bg-red-50 p-3 rounded-lg border border-red-100 mt-3">
                            <div className="flex items-center gap-3">
                              <XCircle className="h-5 w-5 text-red-500" />
                              <div>
                                <p className="text-sm text-red-600 font-medium">
                                  Token verification failed
                                </p>
                                <p className="text-xs text-red-500 mt-1">
                                  Please check the contract address and try
                                  again. Make sure it's a valid ERC-20 token.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {useCustomToken ? (
                      verifiedToken ? (
                        <>
                          <span className="font-medium text-gray-700">
                            Note:
                          </span>{" "}
                          Your client will need to have sufficient balance of{" "}
                          <strong>{verifiedToken.symbol}</strong> to be able to
                          pay your invoice.
                        </>
                      ) : customTokenAddress ? (
                        <>
                          <span className="font-medium text-gray-700">
                            Note:
                          </span>{" "}
                          Please wait for token verification to complete before
                          proceeding.
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-gray-700">
                            Note:
                          </span>{" "}
                          Enter a valid ERC-20 token contract address above to
                          proceed.
                        </>
                      )
                    ) : selectedToken ? (
                      <>
                        <span className="font-medium text-gray-700">Note:</span>{" "}
                        Your client will need to have sufficient balance of{" "}
                        <strong>{selectedToken.symbol}</strong> to be able to
                        pay your invoice.
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-gray-700">Note:</span>{" "}
                        Please select a payment token to continue with invoice
                        creation.
                      </>
                    )}
                  </p>
                </div>
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
