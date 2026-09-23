"use client";

import { Search } from "lucide-react";
import type { ProjectStatus } from "../types/project";

interface ProjectsToolbarProps {
  status: ProjectStatus | "";
  onStatusChange: (value: ProjectStatus | "") => void;
  search: string;
  onSearchChange: (value: string) => void;
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
  search,
  onSearchChange,
}: ProjectsToolbarProps) {
  return (
    <div className="flex sm:flex-row flex-col gap-3">
      <div className="relative flex-1 sm:max-w-md">
        <Search
          size={18}
          className="top-1/2 left-3 absolute text-text-secondary -translate-y-1/2"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects by title..."
          className="bg-surface py-2 pr-4 pl-10 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full text-text-primary placeholder:text-text-secondary text-sm transition"
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:ml-auto">
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
    </div>
  );
}
