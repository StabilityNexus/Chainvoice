import { useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TERMS_PAGE_URL } from "@/utils/termsOfUse";

// No typography plugin is installed, so the rendered Markdown is styled here.
const MARKDOWN_STYLES = [
  "font-Inter text-sm leading-relaxed text-gray-700",
  "[&_h1]:font-Montserrat [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4",
  "[&_h2]:font-Montserrat [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2",
  "[&_h3]:font-Montserrat [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-1",
  "[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1",
  "[&_a]:text-green-700 [&_a]:underline [&_a]:break-words [&_strong]:font-semibold [&_strong]:text-gray-900",
  "[&_hr]:my-6 [&_hr]:border-gray-200",
].join(" ");

const MARKDOWN_COMPONENTS = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

function TermsText({ content, fetchFailed, onRetry }) {
  if (fetchFailed) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-gray-700">
        <p>The Terms of Use could not be loaded.</p>
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="border-gray-200"
        >
          Try again
        </Button>
        <p className="text-gray-500">
          Or read them on{" "}
          <a
            href={TERMS_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 underline"
          >
            GitHub
          </a>{" "}
          before accepting.
        </p>
      </div>
    );
  }

  if (content === null) {
    return (
      <p className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin text-green-600" />
        Loading the Terms of Use...
      </p>
    );
  }

  return (
    <div className={MARKDOWN_STYLES}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={MARKDOWN_COMPONENTS}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Lives inside DialogContent, which unmounts on close, so the checkbox starts
// unticked every time the modal opens.
function AcceptanceControls({ loading, onAccept }) {
  const checkboxId = useId();
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={checkboxId}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors",
          checked
            ? "border-green-200 bg-green-50 text-gray-900"
            : "border-gray-200 text-gray-700 hover:bg-gray-50"
        )}
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-green-600"
        />
        <span>I have carefully read and I accept the Terms of Use.</span>
      </label>
      <Button
        type="button"
        onClick={onAccept}
        disabled={!checked || loading}
        className="h-11 w-full bg-green-600 font-semibold text-white hover:bg-green-700"
      >
        Accept Terms of Use
      </Button>
    </div>
  );
}

export default function TermsOfUseModal({
  open,
  onOpenChange,
  content,
  fetchFailed,
  onRetry,
  accepted,
  onAccept,
}) {
  const loading = content === null && !fetchFailed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose={!accepted}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden bg-white p-0 sm:max-w-2xl sm:rounded-xl"
        onInteractOutside={(e) => {
          if (!accepted) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!accepted) e.preventDefault();
        }}
      >
        <DialogHeader className="flex-row items-start gap-3 space-y-0 px-6 pb-4 pt-6 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="font-Montserrat text-xl font-bold text-gray-900">
              Terms of Use
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Please read the Terms of Use carefully before using Chainvoice.{" "}
              <a
                href={TERMS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-green-700 hover:underline"
              >
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div
          className="mx-6 min-h-[12rem] flex-1 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5"
          tabIndex={0}
          aria-label="Terms of Use text"
        >
          <TermsText
            content={content}
            fetchFailed={fetchFailed}
            onRetry={onRetry}
          />
        </div>

        <div className="px-6 pb-6 pt-4">
          {accepted ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 sm:self-auto">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Accepted today
              </span>
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Close
              </Button>
            </div>
          ) : (
            <AcceptanceControls loading={loading} onAccept={onAccept} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
