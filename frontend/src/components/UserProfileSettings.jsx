import { useAccount } from "wagmi";
import { CheckCircle2, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserProfileFields from "@/components/UserProfileFields";
import { useUserProfileForm } from "@/hooks/useUserProfileForm";

/**
 * Settings section for the sender ("From") details applied to every invoice.
 */
export default function UserProfileSettings() {
  const { address } = useAccount();
  const {
    draft,
    errors,
    loading,
    saving,
    isComplete,
    handleChange,
    handleBlur,
    submit,
  } = useUserProfileForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <User className="text-gray-600 w-5 h-5" />
          Your Information
        </h3>
        {!loading && isComplete && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready to invoice
          </span>
        )}
      </div>

      <div className="mb-3">
        <Label className="text-sm font-medium text-gray-700">
          Your Wallet Address
        </Label>
        <Input
          value={address || "Not connected"}
          readOnly
          className="w-full mt-1 bg-gray-50 border-gray-300 text-gray-500 text-xs sm:text-sm font-mono"
        />
        <p className="mt-1 text-xs text-gray-500">
          Taken from your connected wallet — switch wallets to change it.
        </p>
      </div>

      <UserProfileFields
        value={draft}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={loading || saving}
      />

      <div className="flex flex-wrap items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
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
      </div>
    </form>
  );
}
