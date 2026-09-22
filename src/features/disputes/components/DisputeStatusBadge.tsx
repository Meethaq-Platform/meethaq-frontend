import { DISPUTE_STATUS_LABEL, type DisputeStatus } from "../types/dispute";

const statusStyles: Record<DisputeStatus, string> = {
  0: "bg-danger-muted text-danger",
  1: "bg-warning-muted text-warning",
  2: "bg-success-muted text-success",
  3: "bg-surface-muted text-text-secondary",
};

export function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] ?? statusStyles[0]
      }`}
    >
      {DISPUTE_STATUS_LABEL[status] ?? `Status ${status}`}
    </span>
  );
}
