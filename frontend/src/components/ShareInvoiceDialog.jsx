import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  FileDown,
  Loader2,
  ImageDown,
  Maximize2,
  QrCode,
  Share2,
  X,
} from "lucide-react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { getInvoiceById } from "@/services/invoiceStorage/invoiceDB.js";
import { verifyInvoiceHash } from "@/services/relay/invoiceHashUtils.js";
import {
  buildInvoiceShareUrl,
  describeShareSize,
  downloadInvoiceShareFile,
  renderShareQr,
  renderShareQrCard,
  dataUrlToFile,
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
 * Built on MUI's Dialog rather than the shadcn one because it opens over the
 * MUI SwipeableDrawer on the invoice pages. Those are separate portal stacks:
 * the drawer sits at z-index 1200 and the shadcn dialog at 50, so the drawer
 * painted over it and the right-hand buttons could not be reached. MUI's modal
 * manager stacks the two for us.
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

/**
 * A due date without the time of day.
 *
 * `formatInvoiceDate` renders a full timestamp, which is right for the
 * activity tables but noise on a card someone reads at a glance — "Due
 * 9/3/2026, 2:29:42 PM" says nothing the date alone does not.
 */
function formatDueDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * What the code is for, in words.
 *
 * A saved or printed QR is an anonymous black square otherwise — nobody can
 * tell which invoice it opens, or whether it is stale, without scanning it.
 * The token already carries the whole invoice, so this context does not go
 * inside the code; it goes around it.
 */
function summariseInvoice(data, invoiceId) {
  const symbol = data?.paymentToken?.symbol || "";
  const amount = `${data?.amountDue ?? "—"} ${symbol}`.trim();
  const sender = [data?.user?.fname, data?.user?.lname]
    .filter(Boolean)
    .join(" ");
  const client = [data?.client?.fname, data?.client?.lname]
    .filter(Boolean)
    .join(" ");
  const due = data?.dueDate ? formatDueDate(data.dueDate) : null;
  const padded = `#${String(invoiceId ?? "").padStart(6, "0")}`;

  return {
    amount,
    sender,
    client,
    due,
    // Who is asking, which is what the recipient needs to see first.
    heading: sender ? `${sender} sent you an invoice` : "You have an invoice",
    subheading: client ? `Billed to ${client}` : null,
    caption: `Invoice ${padded} · ${amount}`,
    rows: [
      { label: "Amount", value: amount },
      client ? { label: "Billed to", value: client } : null,
      due ? { label: "Due", value: due } : null,
    ].filter(Boolean),
  };
}

const ShareInvoiceDialog = ({ open, onClose, invoiceId, chainId }) => {
  const [record, setRecord] = useState(null);
  const [loadState, setLoadState] = useState("idle");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  // Holds the pending "Copied" resets so they cannot fire after unmount.
  const copyTimers = useRef([]);

  const id =
    invoiceId === undefined || invoiceId === null ? null : String(invoiceId);

  useEffect(
    () => () => {
      copyTimers.current.forEach(clearTimeout);
      copyTimers.current = [];
    },
    [],
  );

  /** Flash a "Copied" state without leaving a timer behind. */
  const flash = useCallback((setter) => {
    setter(true);
    copyTimers.current.push(setTimeout(() => setter(false), 2000));
  }, []);

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
      !verifyInvoiceHash(record.data, record.invoiceDataHash)
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
  const summary = useMemo(
    () => summariseInvoice(record?.data, id),
    [record, id],
  );

  // Render the QR only when the link is short enough to scan reliably.
  useEffect(() => {
    if (!shareUrl || !size.fitsQr) {
      setQrDataUrl("");
      return;
    }
    let cancelled = false;
    renderShareQr(shareUrl, { size: 760 })
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
      flash(setCopied);
    } catch (err) {
      console.error("[ShareInvoiceDialog] Copy failed:", err);
      toast.error("Could not copy the link. Select it and copy manually.");
    }
  }, [shareUrl, flash]);

  const buildCard = useCallback(
    () =>
      renderShareQrCard(shareUrl, {
        heading: summary.heading,
        subheading: summary.subheading,
        caption: summary.caption,
        footnote: "Scan to open and pay in Chainvoice",
      }),
    [shareUrl, summary],
  );

  /** The text that travels beside the image. */
  const shareMessage = useCallback(() => {
    const lines = [summary.caption];
    if (summary.due) lines.push(`Due ${summary.due}`);
    lines.push("", "Open it in Chainvoice:", shareUrl);
    return lines.join("\n");
  }, [summary, shareUrl]);

  /**
   * Hand the invoice to the OS share sheet as a card plus a message.
   *
   * A bare link in a chat says nothing about what it opens, and asks the
   * recipient to trust a long opaque string. Sending the QR card alongside it
   * means the message carries who is asking, how much, and by when — legible
   * in the chat itself, scannable from another device, and still useful once
   * it has been forwarded or screenshotted.
   *
   * Attaching files needs Web Share Level 2. `canShare` reports support on
   * desktop Chrome, but the OS share sheet there frequently forwards only the
   * text and drops the attachment — which looks exactly like the image having
   * failed. "Copy image" is the dependable desktop path; this one is for
   * mobile, where the sheet carries the file properly. The link is repeated
   * inside `text` because a target that accepts files often drops the
   * separate `url` field.
   *
   * Declared after `buildCard` and `shareMessage` deliberately: a hook's
   * dependency array is evaluated during render, so naming a `const` declared
   * further down the component throws on the first render.
   */
  const handleNativeShare = useCallback(async () => {
    const title = `Invoice ${summary.caption}`;
    const text = shareMessage();

    try {
      // Only attach a card when the code inside it is one a camera can
      // actually read. Past that ceiling the QR is refused on screen, so
      // sending the same unscannable code as an image would be worse than
      // the plain link.
      try {
        if (!size.fitsQr) throw new Error("payload too large for a scannable QR");
        const file = await dataUrlToFile(
          await buildCard(),
          `chainvoice-invoice-${id}.png`,
        );
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title, text });
          return;
        }
      } catch (cardErr) {
        // An AbortError here is the user closing the sheet, not a failure to
        // build the card — let the outer handler classify it.
        if (cardErr?.name === "AbortError") throw cardErr;
        console.warn("[ShareInvoiceDialog] Sharing the card failed:", cardErr);
      }

      await navigator.share({ title, text, url: shareUrl });
    } catch (err) {
      // Dismissing the share sheet is a choice, not a failure.
      if (err?.name !== "AbortError") {
        console.warn("[ShareInvoiceDialog] Native share failed:", err);
      }
    }
  }, [shareUrl, id, summary, shareMessage, buildCard, size.fitsQr]);

  /**
   * Put the card on the clipboard as an image.
   *
   * The desktop half of sharing. `navigator.share` with a file is accepted by
   * the browser but the OS share sheet often forwards only the text, so the
   * card silently goes missing — which is exactly what it looked like when
   * this was share-only. Pasting an image is the path that actually works on
   * a desktop chat client.
   */
  const handleCopyImage = useCallback(async () => {
    try {
      // ClipboardItem accepts a promise, and that matters: awaiting the card
      // first spends the user gesture, and Safari then refuses the write.
      // Handing over the pending blob keeps the write inside the click.
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": buildCard().then((dataUrl) =>
            fetch(dataUrl).then((res) => res.blob()),
          ),
        }),
      ]);
      flash(setCopiedImage);
    } catch (err) {
      console.error("[ShareInvoiceDialog] Copy image failed:", err);
      toast.error("Could not copy the image. Save it instead and attach it.");
    }
  }, [buildCard, flash]);

  const handleDownloadQr = useCallback(async () => {
    if (!qrDataUrl) return;
    let href = qrDataUrl;
    try {
      // The saved copy carries the summary; the one on screen does not need
      // it, since the invoice is already open behind this dialog.
      href = await buildCard();
    } catch (err) {
      // Fall back to the plain code rather than failing the download.
      console.warn("[ShareInvoiceDialog] QR card composition failed:", err);
    }
    const link = document.createElement("a");
    link.href = href;
    link.download = `chainvoice-invoice-${id}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrDataUrl, buildCard, id]);

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

  const canCopyImage =
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.write === "function" &&
    typeof window !== "undefined" &&
    typeof window.ClipboardItem !== "undefined";

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  /** Closing the dialog must not leave the enlarged view armed for next time. */
  const closeAll = useCallback(() => {
    setEnlarged(false);
    onClose?.();
  }, [onClose]);

  return (
    <>
      <Dialog
        open={open}
        onClose={closeAll}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Share2 className="h-5 w-5 text-green-600" />
                Share invoice #{id}
              </p>
              <p className="mt-1 text-sm font-normal text-gray-500">
                Send the invoice details directly, without waiting for your
                client to register an encryption key.
              </p>
            </div>
            <IconButton size="small" onClick={closeAll} aria-label="Close">
              <X className="h-4 w-4 text-gray-500" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
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
            <div className="space-y-3">
              {/* The one thing every recipient of this link needs to know. */}
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <p className="text-xs text-amber-800">
                  <span className="font-medium">
                    Anyone with this link can view the invoice
                  </span>{" "}
                  — names, addresses and line items. It cannot be revoked.
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
                    This invoice has too many line items to fit in a link (
                    {size.chars} characters, limit {SHARE_URL_MAX_CHARS}). Send
                    it as a file instead — your client can import the file on
                    the same page.
                  </p>
                </div>
              )}

              {qrDataUrl ? (
                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <QrCode className="h-4 w-4 text-gray-500" />
                    Scan to import
                  </div>
                  {/* Code beside its details rather than above them. Stacked,
                      the dialog ran past the viewport and picked up a
                      scrollbar for what is only three lines of text. */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    {/* Small on purpose. A code this dense needs far more room
                        than a dialog can spare to be scannable, so this is a
                        preview of what will be sent and "Enlarge" is the thing
                        a camera points at. */}
                    <img
                      src={qrDataUrl}
                      alt={`QR code for invoice ${id}`}
                      className="aspect-square w-[150px] flex-shrink-0 self-center rounded bg-white sm:self-start"
                    />

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      {/* The same summary the saved image carries, so what is
                          being shared is legible before it is sent. */}
                      {summary.rows.length > 0 && (
                        <dl className="space-y-1">
                          {summary.rows.map((row) => (
                            <div
                              key={row.label}
                              className="flex items-baseline justify-between gap-3 text-xs"
                            >
                              <dt className="text-gray-500">{row.label}</dt>
                              <dd className="truncate font-medium text-gray-800">
                                {row.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={OUTLINE_ON_LIGHT}
                          onClick={() => setEnlarged(true)}
                        >
                          <Maximize2 className="h-4 w-4" /> Enlarge
                        </Button>
                        {canCopyImage && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={OUTLINE_ON_LIGHT}
                            onClick={handleCopyImage}
                          >
                            {copiedImage ? (
                              <>
                                <Check className="h-4 w-4" /> Copied
                              </>
                            ) : (
                              <>
                                <ImageDown className="h-4 w-4" /> Copy image
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className={OUTLINE_ON_LIGHT}
                          onClick={handleDownloadQr}
                        >
                          <Download className="h-4 w-4" /> Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                size.fitsUrl && (
                  <p className="text-xs text-gray-500">
                    This invoice is too detailed for a reliable QR code (
                    {size.chars} characters, limit {SHARE_QR_MAX_CHARS}). The
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
                <p className="mt-1.5 text-[11px] text-gray-500">
                  For email, or any channel that mangles long links.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scanning is the one thing a cramped dialog cannot do: a code this
          dense needs roughly 5px per module to read back, which no inline
          preview has room for. This gives it the whole screen. A sibling of
          the dialog above rather than a child, so it is not mounted inside
          that dialog's paper. */}
      <Dialog
        open={enlarged}
        onClose={() => setEnlarged(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogContent className="bg-white">
          <div className="flex flex-col items-center gap-4 py-2">
            <img
              src={qrDataUrl}
              alt={`QR code for invoice ${id}`}
              className="aspect-square w-full max-w-[min(78vh,620px)] rounded bg-white"
            />
            <p className="text-sm font-medium text-gray-700">
              {summary.caption}
            </p>
            <Button
              variant="outline"
              size="sm"
              className={OUTLINE_ON_LIGHT}
              onClick={() => setEnlarged(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareInvoiceDialog;
