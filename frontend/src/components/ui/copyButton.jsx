import { Check, Copy } from "lucide-react";
import { useState } from "react";

// Copy Button Component
const CopyButton = ({ textToCopy, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors ${className}`}
      title="Copy address"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 text-gray-500" />
          <span className="text-gray-500">Copy</span>
        </>
      )}
    </button>
  );
};

export {CopyButton}