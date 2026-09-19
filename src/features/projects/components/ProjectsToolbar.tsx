"use client";

import type { ProjectStatus } from "../types/project";

interface ProjectsToolbarProps {
  status: ProjectStatus | "";
  onStatusChange: (value: ProjectStatus | "") => void;
}

const statusOptions: { value: ProjectStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "Draft", label: "Draft" },
  { value: "Active", label: "Active" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Completed", label: "Completed" },
];

export function ProjectsToolbar({
  status,
  onStatusChange,
}: ProjectsToolbarProps) {
  return (
    <div className="flex flex-wrap sm:justify-end gap-2">
      {statusOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onStatusChange(option.value)}
          aria-pressed={status === option.value}
          className={`px-4 h-9 rounded-lg font-medium text-sm transition ${
            status === option.value
              ? "bg-primary text-white"
              : "bg-surface hover:bg-border/40 text-text-secondary hover:text-text-primary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
