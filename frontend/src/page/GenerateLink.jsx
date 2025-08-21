// pages/GeneratePrefilledLink.jsx
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Copy, Link, Check } from "lucide-react";
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

const GenerateLink = () => {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const [selectedToken, setSelectedToken] = useState(TOKEN_PRESETS[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showWalletAlert, setShowWalletAlert] = useState(!isConnected);

   useEffect(() => {
      setShowWalletAlert(!isConnected);
    }, [isConnected]);
  
  // Generate the prefilled link
  const generateLink = () => {
    const params = new URLSearchParams({
      clientAddress: address || "",
      tokenAddress: selectedToken.address,
      chain: "1", // Ethereum mainnet, adjust as needed
      amount: amount || "",
      description: description || "",
    });

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

  return (
    <>
      <div className="flex justify-center">
              <WalletConnectionAlert
                show={showWalletAlert}
                message="Connect your wallet to create and manage invoices"
                onDismiss={() => setShowWalletAlert(false)}
              />
            </div>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Generate Prefilled Invoice Link
        </h2>
        <p className="text-gray-400">
          Create a shareable link that pre-fills the invoice form with your
          details.
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <div className="space-y-4">
          {/* Your Address (Auto-filled) */}
          <div>
            <Label className="text-white mb-2 block">Your Wallet Address</Label>
            <Input
              value={address || ""}
              readOnly
              className="bg-gray-700 text-gray-300 border-gray-600"
            />
          </div>

          {/* Token Selection */}
          <div>
            <Label className="text-white mb-2 block">
              Preferred Payment Token
            </Label>
            <Select
              value={selectedToken.address}
              onValueChange={(value) => {
                const token = TOKEN_PRESETS.find((t) => t.address === value);
                if (token) setSelectedToken(token);
              }}
            >
              <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOKEN_PRESETS.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center gap-2">
                      <img
                        src={token.logo}
                        alt={token.name}
                        className="w-5 h-5"
                      />
                      {token.name} ({token.symbol})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional: Default Amount */}
          <div>
            <Label className="text-white mb-2 block">
              Default Amount (Optional)
            </Label>
            <Input
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>

          {/* Optional: Default Description */}
          <div>
            <Label className="text-white mb-2 block">
              Default Description (Optional)
            </Label>
            <Input
              placeholder="e.g., Web Development Services"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Generated Link Preview */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <Label className="text-white mb-2 block flex items-center gap-2">
          <Link className="h-4 w-4" />
          Generated Link
        </Label>
        <div className="flex items-center gap-2">
          <Input
            value={generateLink()}
            readOnly
            className="bg-gray-700 text-gray-300 border-gray-600 text-sm"
          />
          <Button
            onClick={copyToClipboard}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Share this link with clients to let them create invoices with your
          details pre-filled.
        </p>
      </div>
      </div>
      
      </>
  );
};

export default GenerateLink;
