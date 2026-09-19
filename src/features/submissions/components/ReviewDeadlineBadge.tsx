import { AlertTriangle, Clock } from "lucide-react";
import RelativeTime from "@/src/shared/components/RelativeTime";

interface ReviewDeadlineBadgeProps {
  reviewDeadline: string;
  isOverdue: boolean;
}

// Composes the shared RelativeTime primitive with overdue/near-due coloring
// — kept feature-local since that logic is submission-specific, not generic.
export function ReviewDeadlineBadge({
  reviewDeadline,
  isOverdue,
}: ReviewDeadlineBadgeProps) {
  const Icon = isOverdue ? AlertTriangle : Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isOverdue ? "bg-danger-muted text-danger" : "bg-warning-muted text-warning"
      }`}
    >
      <Icon size={12} />
      {isOverdue ? "Review overdue — " : "Review due "}
      <RelativeTime value={reviewDeadline} />
    </span>
  );
}
