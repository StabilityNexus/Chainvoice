import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Search,
  X,
  AlertCircle,
  Loader2,
  ChevronDown,
  Coins,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainIdToName, useTokenList } from "../hooks/useTokenList";
import { useTokenSearch } from "../hooks/useTokenSearch";
import { CopyButton } from "./ui/copyButton";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";

// Simple Modal Component (unchanged)
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// Toggle Switch Component
export const ToggleSwitch = ({ enabled, onChange, leftLabel, rightLabel }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
    <span
      className={`text-sm font-medium ${
        !enabled ? "text-gray-900" : "text-gray-500"
      }`}
    >
      {leftLabel}
    </span>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ",
        enabled
          ? "bg-green-600 focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          : "bg-gray-600 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
    <span
      className={`text-sm font-medium ${
        enabled ? "text-gray-900" : "text-gray-500"
      }`}
    >
      {rightLabel}
    </span>
  </div>
);

// Highlight Match Component (unchanged)
function HighlightMatch({ text, query }) {
  if (!query.trim()) return <>{text}</>;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span
            key={index}
            className="bg-blue-100 text-blue-600 rounded px-0.5 font-medium"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

// Token Item Component (unchanged)
const TokenItem = memo(function TokenItem({
  token,
  query,
  isSelected,
  onSelect,
}) {
  const handleClick = useCallback(() => {
    onSelect(token);
  }, [onSelect, token]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg text-left",
        "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-200",
        "border border-transparent hover:border-gray-200",
        isSelected && "bg-blue-50 border-blue-200 ring-1 ring-blue-200"
      )}
    >
      <Avatar
        src={token.image || token.logo || "/tokenImages/generic.png"}
        alt={`${token.name} icon`}
        className="w-10 h-10 flex-shrink-0"
        onError={(e) => {
          e.currentTarget.src = "/tokenImages/generic.png";
        }}
      >
        {token.symbol.slice(0, 2)}
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="max-w-[140px] min-w-0 truncate">
            <span className="font-medium block truncate text-gray-900">
              <HighlightMatch text={token.name} query={query} />
            </span>
          </div>
          <Badge className="bg-gray-100 text-gray-700 font-medium">
            <HighlightMatch text={token.symbol.toUpperCase()} query={query} />
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm font-mono truncate">
            {token.contract_address.slice(0, 8)}...
            {token.contract_address.slice(-6)}
          </span>
          <CopyButton textToCopy={token.contract_address} />
        </div>
      </div>

      {isSelected && (
        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
      )}
    </button>
  );
});

// Main TokenPicker Component
export function TokenPicker({
  selected,
  onSelect,
  placeholder = "Search tokens",
  chainId,
  className,
  disabled = false,
  allowCustom = true,
  onCustomTokenClick,
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const {
    tokens,
    loading: tokensLoading,
    error: tokensError,
  } = useTokenList(chainId);

  const { tokens: filteredTokens, query, setQuery } = useTokenSearch(tokens);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open, setQuery]);

  const handleSelect = (token) => {
    onSelect(token);
    setOpen(false);
  };

  const handleCustomTokenClick = () => {
    if (onCustomTokenClick) {
      onCustomTokenClick();
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          "h-12 px-4 justify-between bg-white hover:bg-gray-50 border border-gray-300 text-gray-900",
          "shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <Avatar
              src={
                selected.image || selected.logo || "/tokenImages/generic.png"
              }
              alt={`${selected.name} icon`}
              className="w-6 h-6"
              onError={(e) => {
                e.currentTarget.src = "/tokenImages/generic.png";
              }}
            >
              {selected.symbol.slice(0, 2)}
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {selected.symbol}
              </span>
              <span className="text-gray-500 text-sm hidden sm:inline">
                {selected.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-gray-500">
            <Coins className="w-5 h-5" />
            <span>Select Token</span>
          </div>
        )}
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Button>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Select Token
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                ref={inputRef}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 h-12 border-gray-300 text-black"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <div className="max-h-80 overflow-y-auto">
              {tokensLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="text-gray-500 text-sm">
                      Loading tokens...
                    </span>
                  </div>
                </div>
              ) : tokensError ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <AlertCircle className="w-8 h-8" />
                    {tokensError.includes("manually input") ? (
                      <>
                        <span className="text-sm font-medium">
                          Testnet:{" "}
                          {ChainIdToName[chainId] || "Unknown"} (
                          {chainId})
                        </span>
                        <span className="text-xs text-center max-w-[280px]">
                          Token Selection is not supported in testnets.
                        </span>
                        <span className="text-xs text-center max-w-[280px]">
                          {tokensError}
                        </span>
                      </>
                    ) : tokensError.includes("not supported") ? (
                      <>
                        <span className="text-sm font-medium">
                          Chain Not Supported
                        </span>
                        <span className="text-xs text-center">{tokensError}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium">
                          Failed to load tokens
                        </span>
                        <span className="text-xs text-center max-w-[280px]">
                          {tokensError}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ) : filteredTokens.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Search className="w-8 h-8 opacity-50" />
                    <span className="text-sm">No tokens found</span>
                    {query && (
                      <span className="text-xs">
                        Try a different search term
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTokens.map((token) => (
                    <TokenItem
                      key={token.contract_address}
                      token={token}
                      query={query}
                      isSelected={
                        selected?.contract_address === token.contract_address ||
                        selected?.address === token.contract_address
                      }
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}
            </div>

            {allowCustom && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <button
                  type="button"
                  onClick={handleCustomTokenClick}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-200 hover:border-gray-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      Use Custom Token
                    </div>
                    <div className="text-xs text-gray-500">
                      Enter contract address manually
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TokenPicker;
