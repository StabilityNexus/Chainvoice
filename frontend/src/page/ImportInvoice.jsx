import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileUp,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InvoicePreview from "@/components/InvoicePreview";
import { cn } from "@/lib/utils";
import { PAGE_CONTAINER } from "@/utils/layout";
import {
  decodeInvoiceShareInput,
  readInvoiceShareFile,
  SHARE_TOKEN_PARAM,
  verifyShareAgainstChain,
  VERIFY_OK,
  VERIFY_HASH_MISMATCH,
  VERIFY_NOT_FOUND,
  VERIFY_UNREACHABLE,
  VERIFY_UNSUPPORTED_CHAIN,
} from "@/services/share";
import {
  getInvoiceById,
  storeInvoice,
} from "@/services/invoiceStorage/invoiceDB.js";
import { verifyInvoiceHash } from "@/services/relay/invoiceHashUtils.js";

/**
 * Import an invoice shared as a link, a QR code, or a `.cvinv` file.
 *
 * Deliberately usable before the wallet connects. Decoding needs no wallet,
 * and verification reads the chain over a public RPC, so someone who taps a
 * link sees the real invoice immediately instead of a connect prompt in front
 * of a blank page. Connecting is needed only to save it.
 *
 * Nothing is saved on the strength of the link alone. A share token is public
 * and anyone can edit one, so the payload is trusted only once its hash
 * matches the `invoiceDataHash` the sender committed on-chain — the same
 * check the relay path makes in `ReceivedInvoice`.
 */

/**
 * Outline buttons sit on white cards inside a dark dashboard shell, and the
 * variant sets a background but no text colour — without this it inherits the
 * shell's white and renders invisible.
 */
const OUTLINE_ON_LIGHT = "border-gray-300 text-gray-700 hover:bg-gray-50";

/** Wording for each way verification can fail. */
function describeFailure(result) {
  switch (result.code) {
    case VERIFY_HASH_MISMATCH:
      return {
        title: "This invoice does not match the blockchain",
        detail:
          "The details in this link are not the ones the sender recorded on-chain. The link may have been edited or corrupted. Ask the sender to share it again.",
      };
    case VERIFY_NOT_FOUND:
      return {
        title: "No such invoice on this network",
        detail: `Invoice not found on ${
          result.chainName || "this network"
        }. The link may point at a different deployment, or the invoice was never created.`,
      };
    case VERIFY_UNSUPPORTED_CHAIN:
      return {
        title: "Network not supported yet",
        detail: `This invoice is on ${
          result.chainName || "a network"
        } which this app is not configured for, so it cannot be verified here.`,
      };
    case VERIFY_UNREACHABLE:
    default:
      return {
        title: "Could not reach the network",
        detail: `Verification needs to read ${
          result.chainName || "the network"
        }, and that request failed. Check your connection and try again.`,
      };
  }
}

const ImportInvoice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { address, isConnected, chainId: walletChainId } = useAccount();
  const fileInputRef = useRef(null);

  const [manualInput, setManualInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [decoded, setDecoded] = useState(null);
  const [verification, setVerification] = useState(null);
  const [problem, setProblem] = useState(null);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * Decode then verify.
   *
   * Wrapped in one call because the two are useless apart: a decoded payload
   * that has not been checked against the chain must never reach the screen
   * as an invoice.
   */
  const processInput = useCallback(async (input) => {
    setStatus("working");
    setProblem(null);
    setDecoded(null);
    setVerification(null);
    setAlreadySaved(false);

    let share;
    try {
      share = decodeInvoiceShareInput(input);
    } catch (err) {
      setStatus("failed");
      setProblem({
        title: "This link could not be read",
        detail: err?.message || "The share code is not valid.",
      });
      return;
    }

    setDecoded(share);

    const result = await verifyShareAgainstChain(share);
    if (result.code !== VERIFY_OK) {
      setStatus("failed");
      setProblem(describeFailure(result));
      return;
    }

    setVerification(result);
    setStatus("verified");

    // Tell the user it is already in their list rather than presenting a
    // Save button that would be a no-op.
    try {
      const existing = await getInvoiceById(share.chainId, share.invoiceId);
      if (
        existing?.data &&
        verifyInvoiceHash(existing.data, result.onChain.invoiceDataHash)
      ) {
        setAlreadySaved(true);
      }
    } catch {
      // A failed lookup only costs us the "already saved" hint.
    }
  }, []);

  // A tapped link or a scanned QR lands here with the token in the URL.
  const urlToken = searchParams.get(SHARE_TOKEN_PARAM);
  useEffect(() => {
    if (urlToken) processInput(urlToken);
  }, [urlToken, processInput]);

  const handleFile = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const text = await readInvoiceShareFile(file);
        await processInput(text);
      } catch (err) {
        console.error("[ImportInvoice] Could not read file:", err);
        toast.error("Could not read that file.");
      } finally {
        // Allow re-picking the same file after a failure.
        event.target.value = "";
      }
    },
    [processInput]
  );

  /** Who this invoice concerns, and whether the connected wallet is one of them. */
  const role = useMemo(() => {
    if (!verification?.onChain || !address) return null;
    const me = address.toLowerCase();
    if (me === verification.onChain.to) return "recipient";
    if (me === verification.onChain.from) return "sender";
    return "bystander";
  }, [verification, address]);

  const handleSave = useCallback(async () => {
    if (!decoded || !verification?.onChain) return;
    const { onChain } = verification;

    setSaving(true);
    try {
      await storeInvoice({
        invoiceId: decoded.invoiceId,
        chainId: decoded.chainId,
        from: onChain.from,
        to: onChain.to,
        isPaid: onChain.isPaid,
        isCancelled: onChain.isCancelled,
        invoiceDataHash: onChain.invoiceDataHash,
        data: decoded.invoiceData,
      });
      toast.success("Invoice saved");
      navigate(role === "sender" ? "/dashboard/sent" : "/dashboard/pending");
    } catch (err) {
      console.error("[ImportInvoice] Failed to save invoice:", err);
      toast.error("Could not save the invoice locally.");
    } finally {
      setSaving(false);
    }
  }, [decoded, verification, role, navigate]);

  /** The invoice object InvoicePreview expects, built from verified pieces. */
  const previewInvoice = useMemo(() => {
    if (!decoded || !verification?.onChain) return null;
    return {
      ...decoded.invoiceData,
      id: decoded.invoiceId,
      isPaid: verification.onChain.isPaid,
      isCancelled: verification.onChain.isCancelled,
    };
  }, [decoded, verification]);

  const wrongNetwork =
    isConnected &&
    decoded &&
    Number(walletChainId) !== Number(decoded.chainId);

  return (
    <div className={cn(PAGE_CONTAINER, "space-y-4")}>
      <div className="mb-3 sm:mb-4">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-white sm:text-2xl sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 sm:h-10 sm:w-10">
            <Download className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
          </div>
          Import Invoice
        </h2>
        <p className="text-sm text-gray-300">
          Open an invoice shared with you as a link, a QR code, or a file. Every
          import is checked against the blockchain before it is saved.
        </p>
      </div>

      {/* Manual entry. Hidden once a link in the URL has been handled, since
          there is nothing left to paste. */}
      {!urlToken && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <Label className="mb-2 block text-sm font-medium text-gray-700">
            Paste a share link
          </Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="https://…/#/dashboard/import?i=cv1.…"
              className="flex-1 border-gray-300 bg-gray-50 font-mono text-xs text-gray-700"
            />
            <Button
              onClick={() => processInput(manualInput)}
              disabled={!manualInput.trim() || status === "working"}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Open invoice
            </Button>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Or choose a shared invoice file
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".cvinv,application/json,.json"
              onChange={handleFile}
              className="hidden"
            />
            <Button
              variant="outline"
              className={OUTLINE_ON_LIGHT}
              onClick={() => fileInputRef.current?.click()}
              disabled={status === "working"}
            >
              <FileUp className="h-4 w-4" /> Choose .cvinv file
            </Button>
          </div>
        </div>
      )}

      {status === "working" && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking this invoice against the blockchain…
        </div>
      )}

      {status === "failed" && problem && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {problem.title}
              </p>
              <p className="mt-1 text-sm text-red-700">{problem.detail}</p>
            </div>
          </div>
          {urlToken && (
            <Button
              variant="outline"
              size="sm"
              className={cn("mt-3 bg-white", OUTLINE_ON_LIGHT)}
              onClick={() => processInput(urlToken)}
            >
              Try again
            </Button>
          )}
        </div>
      )}

      {status === "verified" && previewInvoice && (
        <>
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div className="text-sm text-green-800">
              <p className="font-semibold">Verified against the blockchain</p>
              <p className="mt-0.5 text-green-700">
                These details match invoice #{decoded.invoiceId} on{" "}
                {verification.chainName}, exactly as the sender recorded it.
              </p>
            </div>
          </div>

          {role === "bystander" && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                This invoice is between two other wallets, so there is nothing
                for you to save or pay. You can still read it.
              </p>
            </div>
          )}

          {wrongNetwork && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                Your wallet is on a different network. Saving still works, but
                switch to {verification.chainName} to see and pay this invoice.
              </p>
            </div>
          )}

          <InvoicePreview invoice={previewInvoice} />

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            {!isConnected ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-gray-600">
                  Connect your wallet to save this invoice and pay it.
                </p>
                <ConnectButton />
              </div>
            ) : alreadySaved ? (
              <div className="flex flex-col items-start gap-3">
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  This invoice is already saved on this device.
                </p>
                <Button
                  variant="outline"
                  className={OUTLINE_ON_LIGHT}
                  onClick={() =>
                    navigate(
                      role === "sender"
                        ? "/dashboard/sent"
                        : "/dashboard/pending"
                    )
                  }
                >
                  Go to my invoices
                </Button>
              </div>
            ) : role === "bystander" ? null : (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    {role === "sender"
                      ? "Save to my sent invoices"
                      : "Save to my invoices"}
                  </>
                )}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImportInvoice;
