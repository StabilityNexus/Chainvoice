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
import UserProfileFields from "@/components/UserProfileFields";
import { useUserProfileForm } from "@/hooks/useUserProfileForm";

/**
 * First-run prompt for the sender profile.
 *
 * Also reused as a just-in-time prompt when an invoice is submitted with an
 * incomplete profile, since those details are required on-chain either way.
 * `required` keeps that second case from being dismissed with Escape.
 */
export default function OnboardingProfileDialog({
  open,
  onOpenChange,
  onSkip,
  required = false,
  title = "Welcome to Chainvoice!",
  description = "Please fill in your personal details before creating an invoice. You can always change this later in Settings.",
}) {
  const { draft, errors, loading, saving, handleChange, handleBlur, submit } =
    useUserProfileForm({
      onSaved: () => onOpenChange?.(false),
    });

  // Closing without saving is a deliberate "not now", so it is recorded and the
  // prompt stops returning on every visit.
  const handleOpenChange = (nextOpen) => {
    if (nextOpen) {
      onOpenChange?.(true);
      return;
    }
    onSkip?.();
    onOpenChange?.(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (required) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <UserProfileFields
            value={draft}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading || saving}
          />

          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading || saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Information"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
