"use client";

import type { LucideIcon } from "lucide-react";
import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/src/shared/hooks/useCopyToClipboard";

interface ProfileFieldProps {
  label: string;
  value: string | null;
  icon?: LucideIcon;
  copyable?: boolean;
  emptyLabel?: string;
  // "ltr" for emails/phone numbers; everything else is user-written text.
  dir?: "ltr" | "auto";
}

export function ProfileField({
  label,
  value,
  icon: Icon,
  copyable = false,
  emptyLabel = "Not set",
  dir = "auto",
}: ProfileFieldProps) {
  const { copy, copiedText } = useCopyToClipboard();
  const isCopied = value != null && copiedText === value;

  return (
    <div className="group space-y-1">
      <p className="flex items-center gap-1.5 text-text-secondary text-xs uppercase tracking-wide">
        {Icon && <Icon size={13} />}
        {label}
      </p>

      <div className="flex items-center gap-1.5">
        {value ? (
          <p dir={dir} className="font-semibold text-text-primary text-sm">
            {value}
          </p>
        ) : (
          <p className="text-text-secondary text-sm italic">{emptyLabel}</p>
        )}

        {copyable && value && (
          <button
            type="button"
            aria-label={isCopied ? "Copied" : `Copy ${label.toLowerCase()}`}
            onClick={() => copy(value)}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-surface-muted p-1 rounded text-text-secondary hover:text-primary transition"
          >
            {isCopied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}
