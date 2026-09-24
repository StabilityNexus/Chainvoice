import { useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TERMS_PAGE_URL } from "@/utils/termsOfUse";

// No typography plugin is installed, so the rendered Markdown is styled here.
const MARKDOWN_STYLES = [
  "text-sm leading-relaxed text-foreground",
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4",
  "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2",
  "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1",
  "[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1",
  "[&_a]:text-green-700 [&_a]:underline [&_strong]:font-semibold [&_hr]:my-6 [&_hr]:border-border",
].join(" ");

const MARKDOWN_COMPONENTS = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

function TermsText({ content, fetchFailed }) {
  if (fetchFailed) {
    return (
      <p className="text-sm text-foreground">
        The Terms of Use could not be loaded. Please read them at{" "}
        <a
          href={TERMS_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700 underline break-all"
        >
          {TERMS_PAGE_URL}
        </a>{" "}
        before accepting.
      </p>
    );
  }

  if (content === null) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
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
    <div className="flex w-full flex-col gap-4">
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-start gap-3 text-sm text-foreground"
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
        className="w-full bg-green-600 text-white hover:bg-green-700"
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
  accepted,
  onAccept,
}) {
  const loading = content === null && !fetchFailed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose={!accepted}
        className="flex max-h-[90vh] flex-col sm:max-w-3xl"
        onInteractOutside={(e) => {
          if (!accepted) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!accepted) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">Terms of Use</DialogTitle>
          <DialogDescription>
            Please read the Terms of Use carefully before using Chainvoice.{" "}
            <a
              href={TERMS_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              View on GitHub
            </a>
          </DialogDescription>
        </DialogHeader>

        <div
          className="min-h-[12rem] flex-1 overflow-y-auto rounded-md border border-border p-4"
          tabIndex={0}
          aria-label="Terms of Use text"
        >
          <TermsText content={content} fetchFailed={fetchFailed} />
        </div>

        <DialogFooter>
          {accepted ? (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                You have accepted the Terms of Use today.
              </p>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
