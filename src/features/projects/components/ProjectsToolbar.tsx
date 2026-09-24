"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStatusLabel } from "@/src/shared/hooks/useStatusLabel";
import type { ProjectStatus } from "../types/project";

interface ProjectsToolbarProps {
  status: ProjectStatus | "";
  onStatusChange: (value: ProjectStatus | "") => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const statusOptions: (ProjectStatus | "")[] = ["", "Draft", "Active", "Cancelled", "Completed"];

export function ProjectsToolbar({
  status,
  onStatusChange,
  search,
  onSearchChange,
}: ProjectsToolbarProps) {
  const t = useTranslations("projects.toolbar");
  const statusLabel = useStatusLabel("project");

  return (
    <div className="flex sm:flex-row flex-col gap-3">
      <div className="relative flex-1 sm:max-w-md">
        <Search
          size={16}
          className="top-1/2 inset-s-3 absolute sm:size-4.5 text-text-secondary -translate-y-1/2"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="bg-surface py-1.5 sm:py-2 pe-4 ps-9 sm:ps-10 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full text-text-primary placeholder:text-text-secondary text-xs sm:text-sm transition"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 sm:ms-auto">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onStatusChange(option)}
            aria-pressed={status === option}
            className={`px-3 sm:px-4 h-8 sm:h-9 rounded-lg font-medium text-xs sm:text-sm transition ${
              status === option
                ? "bg-primary text-on-primary"
                : "bg-surface hover:bg-border/40 text-text-secondary hover:text-text-primary"
            }`}
          >
            {option ? statusLabel(option) : t("allStatuses")}
          </button>
        ))}
      </div>
    </div>
  );
}
