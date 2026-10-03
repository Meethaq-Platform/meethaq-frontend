import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  // Only drawn by the compact variant — the default variant uses the shared
  // illustration instead.
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  // "compact" is for empties nested inside an existing card (dashboard
  // sections, dropdowns): no illustration and no card chrome of its own, so
  // several empty sections on one page don't stack up into a wall of art.
  variant?: "default" | "compact";
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  if (variant === "compact") {
    return (
      <div className="flex flex-col justify-center items-center gap-1.5 py-6 text-center">
        <span className="flex justify-center items-center bg-surface-muted mb-1 rounded-full w-10 h-10">
          <Icon size={18} className="text-text-secondary" />
        </span>

        <p className="font-medium text-text-primary text-sm">{title}</p>

        {description && (
          <p className="max-w-xs text-text-secondary text-xs">{description}</p>
        )}

        {action && <div className="mt-1.5">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 bg-surface py-12 border border-border rounded-2xl text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/illustrations/empty.svg"
        alt=""
        className="mb-2 w-40 h-40 object-contain"
      />

      <p className="font-semibold text-text-primary text-sm">{title}</p>

      {description && (
        <p className="max-w-xs text-text-secondary text-sm">{description}</p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
