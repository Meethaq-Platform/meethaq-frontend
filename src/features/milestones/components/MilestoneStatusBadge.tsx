import type { MilestoneExecutionStatus } from "../types/milestone";
import { useStatusLabel } from "@/src/shared/hooks/useStatusLabel";

const statusStyles: Record<MilestoneExecutionStatus, string> = {
  NotStarted: "bg-surface-muted text-text-secondary",
  InProgress: "bg-info-muted text-info",
  Submitted: "bg-warning-muted text-warning",
  RevisionRequested: "bg-danger-muted text-danger",
  Accepted: "bg-success-muted text-success",
};

export function MilestoneStatusBadge({ status }: { status: MilestoneExecutionStatus }) {
  const label = useStatusLabel("milestoneExecution");

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {label(status)}
    </span>
  );
}
