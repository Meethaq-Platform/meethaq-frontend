"use client";

import { Filter } from "lucide-react";
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
    <div className="flex sm:justify-end">
      <div className="relative">
        <Filter
          size={15}
          className="top-1/2 left-3 absolute text-text-secondary -translate-y-1/2 pointer-events-none"
        />

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as ProjectStatus | "")
          }
          className="bg-surface py-2 pr-8 pl-9 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto h-full text-text-primary text-sm transition appearance-none"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
