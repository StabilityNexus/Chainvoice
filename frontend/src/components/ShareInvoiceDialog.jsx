import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  FileDown,
  Loader2,
  QrCode,
  Share2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getInvoiceById } from "@/services/invoiceStorage/invoiceDB.js";
import { computeInvoiceHash } from "@/services/relay/invoiceHashUtils.js";
import {
  buildInvoiceShareUrl,
  describeShareSize,
  downloadInvoiceShareFile,
  SHARE_QR_MAX_CHARS,
  SHARE_URL_MAX_CHARS,
} from "@/services/share";

/**
 * Share one invoice as a link, a QR code, or a file.
 *
 * Why this exists: relay delivery needs the recipient to have registered a
 * messaging key on-chain. Until they do, the invoice is on-chain but its
 * details have nowhere to go. A share link carries the details itself, so it
 * works with no key registered and with the relay down.
 *
 * The payload is read from IndexedDB rather than taken from the invoice
 * object the caller is displaying. Those are not the same thing: the list
 * pages enrich the stored payload with token logos, decimals and status
 * before rendering it, and any of those additions would change the hash and
 * make the token unverifiable on the recipient's side.
 */

/**
 * Outline buttons need an explicit text colour here: the variant sets a
 * background but not a foreground, so on this white dialog they would
 * otherwise inherit the dark shell's white text.
 */
const OUTLINE_ON_LIGHT = "border-gray-300 text-gray-700 hover:bg-gray-50";

/** Middle-truncate a URL for display. Nobody reads these; they copy them. */
function shortenUrl(url) {
  if (url.length <= 52) return url;
  return `${url.slice(0, 32)}…${url.slice(-10)}`;
}

const ShareInvoiceDialog = ({ open, onClose, invoiceId, chainId }) => {
  const [record, setRecord] = useState(null);
  const [loadState, setLoadState] = useState("idle");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const id = invoiceId === undefined || invoiceId === null ? null : String(invoiceId);

  // Load the stored payload whenever the dialog opens for a different invoice.
  useEffect(() => {
    if (!open || id === null || !chainId) return;

    let cancelled = false;
    setLoadState("loading");
    setRecord(null);
    setQrDataUrl("");

    (async () => {
      try {
        const stored = await getInvoiceById(chainId, id);
        if (cancelled) return;
        setRecord(stored ?? null);
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;
        console.error("[ShareInvoiceDialog] Failed to read invoice:", err);
        setLoadState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, id, chainId]);

  /**
   * Why the invoice cannot be shared, or null when it can.
   *
   * A payload that no longer matches its own recorded hash would produce a
   * link the recipient's chain check rejects, so it is refused here rather
   * than handed out to fail confusingly later.
   */
  const blockedReason = useMemo(() => {
    if (loadState !== "ready") return null;
    if (!record?.data) {
      return "This invoice's details are not on this device — only the on-chain summary is available, and there is nothing to put in a link. Details are unrecoverable once local storage is cleared.";
    }
    if (
      record.invoiceDataHash &&
      computeInvoiceHash(record.data) !== record.invoiceDataHash
    ) {
      return "The details stored for this invoice no longer match what was recorded on-chain, so a share link could not be verified by the recipient.";
    }
    return null;
  }, [loadState, record]);

  const shareUrl = useMemo(() => {
    if (loadState !== "ready" || blockedReason || !record?.data) return "";
    try {
      return buildInvoiceShareUrl({
        invoiceId: id,
        chainId,
        invoiceData: record.data,
      });
    } catch (err) {
      console.error("[ShareInvoiceDialog] Failed to build share link:", err);
      return "";
    }
  }, [loadState, blockedReason, record, id, chainId]);

  const size = useMemo(() => describeShareSize(shareUrl), [shareUrl]);

  // Render the QR only when the link is short enough to scan reliably.
  useEffect(() => {
    if (!shareUrl || !size.fitsQr) {
      setQrDataUrl("");
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(shareUrl, { margin: 1, width: 320 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch((err) => {
        console.warn("[ShareInvoiceDialog] QR generation failed:", err);
        if (!cancelled) setQrDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [shareUrl, size.fitsQr]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("[ShareInvoiceDialog] Copy failed:", err);
      toast.error("Could not copy the link. Select it and copy manually.");
    }
  }, [shareUrl]);

  /**
   * Hand the link to the OS share sheet.
   *
   * This is the reason link length stops mattering on mobile: one tap goes
   * straight into WhatsApp or Telegram and the user never sees the string.
   */
  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: `Chainvoice invoice #${id}`,
        text: "Open this link to view and pay the invoice.",
        url: shareUrl,
      });
    } catch (err) {
      // Dismissing the share sheet is a choice, not a failure.
      if (err?.name !== "AbortError") {
        console.warn("[ShareInvoiceDialog] Native share failed:", err);
      }
    }
  }, [shareUrl, id]);

  const handleDownloadQr = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `chainvoice-invoice-${id}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrDataUrl, id]);

  const handleDownloadFile = useCallback(() => {
    try {
      const filename = downloadInvoiceShareFile({
        invoiceId: id,
        chainId,
        invoiceData: record.data,
      });
      toast.success(`Saved ${filename}`);
    } catch (err) {
      console.error("[ShareInvoiceDialog] File export failed:", err);
      toast.error("Could not export the invoice file.");
    }
  }, [id, chainId, record]);

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="max-w-lg bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Share2 className="h-5 w-5 text-green-600" />
            Share invoice #{id}
          </DialogTitle>
          <DialogDescription>
            Send the invoice details directly, without waiting for your client
            to register an encryption key.
          </DialogDescription>
        </DialogHeader>

        {loadState === "loading" && (
          <div className="flex items-center gap-2 py-8 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading invoice details…
          </div>
        )}

        {loadState === "error" && (
          <p className="py-6 text-sm text-red-600">
            Could not read this invoice from local storage.
          </p>
        )}

        {loadState === "ready" && blockedReason && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">{blockedReason}</p>
          </div>
        )}

        {loadState === "ready" && !blockedReason && (
          <div className="space-y-4">
            {/* The one thing every recipient of this link needs to know. */}
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                <span className="font-medium">Anyone with this link can view
                the invoice</span>{" "}
                — including your and your client&apos;s names, addresses and line
                items. Share it only with the client. It cannot be revoked.
              </p>
            </div>

            {size.fitsUrl ? (
              <>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p
                    className="break-all font-mono text-xs text-gray-600"
                    title={shareUrl}
                  >
                    {shortenUrl(shareUrl)}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {size.chars} characters
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleCopy}
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy link
                      </>
                    )}
                  </Button>
                  {canNativeShare && (
                    <Button
                      variant="outline"
                      className={OUTLINE_ON_LIGHT}
                      onClick={handleNativeShare}
                    >
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-sm text-blue-800">
                  This invoice has too many line items to fit in a link
                  ({size.chars} characters, limit {SHARE_URL_MAX_CHARS}). Send
                  it as a file instead — your client can import the file on the
                  same page.
                </p>
              </div>
            )}

            {qrDataUrl ? (
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <QrCode className="h-4 w-4 text-gray-500" />
                  Scan to import
                </div>
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={qrDataUrl}
                    alt={`QR code for invoice ${id}`}
                    className="h-56 w-56 rounded bg-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className={OUTLINE_ON_LIGHT}
                    onClick={handleDownloadQr}
                  >
                    <Download className="h-4 w-4" /> Save QR image
                  </Button>
                </div>
              </div>
            ) : (
              size.fitsUrl && (
                <p className="text-xs text-gray-500">
                  This invoice is too detailed for a reliable QR code
                  ({size.chars} characters, limit {SHARE_QR_MAX_CHARS}). The
                  link and the file both still work.
                </p>
              )
            )}

            <div className="border-t border-gray-200 pt-3">
              <Button
                variant="outline"
                className={cn("w-full", OUTLINE_ON_LIGHT)}
                onClick={handleDownloadFile}
              >
                <FileDown className="h-4 w-4" /> Download as file (.cvinv)
              </Button>
              <p className="mt-2 text-[11px] text-gray-500">
                For email or any channel that mangles long links. No size
                limit.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareInvoiceDialog;
