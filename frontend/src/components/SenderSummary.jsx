import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";

/**
 * One-line reminder of whose details the invoice is issued under.
 *
 * The full "From" form moved to Settings, so this keeps the sender visible on
 * the creation pages without spending a whole card on it.
 */
export default function SenderSummary({ className }) {
  const navigate = useNavigate();
  const { profile, loading, isComplete } = useUserProfile();

  if (loading) return null;

  const fullName = [profile.userFname, profile.userLname]
    .filter(Boolean)
    .join(" ");

  return (
    <p className={cn("text-xs sm:text-sm text-gray-400", className)}>
      {isComplete ? (
        <>
          From <span className="text-gray-200">{fullName}</span> &middot;{" "}
          {profile.userEmail} &middot;{" "}
        </>
      ) : (
        <>Your sender details are missing &middot; </>
      )}
      <button
        type="button"
        onClick={() => navigate("/dashboard/settings")}
        className="text-green-400 hover:text-green-300 underline underline-offset-2"
      >
        {isComplete ? "Edit in Settings" : "Add them"}
      </button>
    </p>
  );
}
