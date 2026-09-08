import type { ProjectStatus } from "../types/project";

const statusStyles: Record<ProjectStatus, string> = {
  Draft: "bg-surface-muted text-text-secondary",
  Active: "bg-success-muted text-success",
  Cancelled: "bg-danger-muted text-danger",
  Completed: "bg-info-muted text-info",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] ?? statusStyles.Draft}`}
    >
      {status}
    </span>
  );
}
