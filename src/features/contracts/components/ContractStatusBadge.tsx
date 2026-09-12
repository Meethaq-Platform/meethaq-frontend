import type { ProjectContractStatus } from "@/src/features/projects/types/project";

const statusStyles: Record<ProjectContractStatus, string> = {
  None: "bg-surface-muted text-text-secondary",
  Draft: "bg-surface-muted text-text-secondary",
  PendingApproval: "bg-warning-muted text-warning",
  ChangesRequested: "bg-danger-muted text-danger",
  Approved: "bg-success-muted text-success",
};

const statusLabels: Record<ProjectContractStatus, string> = {
  None: "No Contract",
  Draft: "Draft",
  PendingApproval: "Pending Approval",
  ChangesRequested: "Changes Requested",
  Approved: "Approved",
};

export function ContractStatusBadge({ status }: { status: ProjectContractStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] ?? statusStyles.None}`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
