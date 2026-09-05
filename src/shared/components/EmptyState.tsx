import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-2 bg-surface py-16 border border-border rounded-2xl text-center">
      <div className="flex justify-center items-center bg-surface-muted mb-2 rounded-full w-12 h-12 text-text-secondary">
        <Icon size={22} />
      </div>

      <p className="font-semibold text-text-primary text-sm">{title}</p>

      {description && (
        <p className="max-w-xs text-text-secondary text-sm">{description}</p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
