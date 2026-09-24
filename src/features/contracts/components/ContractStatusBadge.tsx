import type { ProjectContractStatus } from "@/src/features/projects/types/project";
import { useStatusLabel } from "@/src/shared/hooks/useStatusLabel";

const statusStyles: Record<ProjectContractStatus, string> = {
  None: "bg-surface-muted text-text-secondary",
  Draft: "bg-surface-muted text-text-secondary",
  PendingApproval: "bg-warning-muted text-warning",
  ChangesRequested: "bg-danger-muted text-danger",
  Approved: "bg-success-muted text-success",
};

export function ContractStatusBadge({ status }: { status: ProjectContractStatus }) {
  const label = useStatusLabel("projectContract");

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] ?? statusStyles.None}`}
    >
      {label(status)}
    </span>
  );
}
