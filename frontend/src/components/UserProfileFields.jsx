import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CountryPicker from "@/components/CountryPicker";
import { USER_PROFILE_FIELDS } from "@/utils/userProfile";
import { cn } from "@/lib/utils";

/**
 * Controlled grid of the sender profile inputs, driven by USER_PROFILE_FIELDS.
 * Rendered by both the Settings section and the first-run onboarding dialog so
 * the two can never drift apart.
 */
function UserProfileFields({
  value,
  errors = {},
  onChange,
  onBlur,
  disabled = false,
  className,
}) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
      {USER_PROFILE_FIELDS.map((field) => {
        const error = errors[field.name];
        const fieldValue = value?.[field.name] ?? "";

        return (
          <div key={field.name}>
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>

            <div className="mt-1">
              {field.control === "country" ? (
                <CountryPicker
                  id={field.name}
                  value={fieldValue}
                  onChange={(country) => onChange(field.name, country)}
                  placeholder={field.placeholder}
                  className="w-full border-gray-300 text-black"
                  disabled={disabled}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={fieldValue}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  onBlur={
                    onBlur
                      ? (e) => onBlur(field.name, e.target.value)
                      : undefined
                  }
                  disabled={disabled}
                  aria-invalid={Boolean(error)}
                  className={cn(
                    "w-full border-gray-300 text-black",
                    error && "border-red-500"
                  )}
                />
              )}
            </div>

            {error && (
              <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserProfileFields;
