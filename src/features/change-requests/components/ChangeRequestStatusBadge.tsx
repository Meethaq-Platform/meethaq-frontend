import {
  CHANGE_REQUEST_STATUS_LABEL,
  type ChangeRequestStatus,
} from "../types/change-request";

const statusStyles: Record<ChangeRequestStatus, string> = {
  0: "bg-surface-muted text-text-secondary",
  1: "bg-warning-muted text-warning",
  2: "bg-success-muted text-success",
  3: "bg-danger-muted text-danger",
  4: "bg-surface-muted text-text-secondary",
};

export function ChangeRequestStatusBadge({ status }: { status: ChangeRequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] ?? statusStyles[0]
      }`}
    >
      {CHANGE_REQUEST_STATUS_LABEL[status] ?? `Status ${status}`}
    </span>
  );
}
