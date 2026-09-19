import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  // Kept for now so existing call sites don't need touching — superseded
  // by the shared illustration below.
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
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
