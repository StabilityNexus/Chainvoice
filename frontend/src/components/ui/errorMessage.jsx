import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorMessage({ message, className, show = true }) {
  if (!message || !show) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-2 mt-1 text-xs text-red-600 min-h-[20px]",
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
      <span className="leading-tight">{message}</span>
    </div>
  );
}

