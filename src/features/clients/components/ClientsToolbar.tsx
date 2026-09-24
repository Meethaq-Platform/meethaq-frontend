"use client";

import { ArrowDown, ArrowUp, Search } from "lucide-react";

interface ClientsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export function ClientsToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
}: ClientsToolbarProps) {
  const isDateActive = sort === "newest" || sort === "oldest";
  const isNameActive = sort === "name_asc" || sort === "name_desc";

  const toggleDate = () =>
    onSortChange(sort === "newest" ? "oldest" : "newest");

  const toggleName = () =>
    onSortChange(sort === "name_asc" ? "name_desc" : "name_asc");

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
          placeholder="Search by name, email, or company..."
          className="bg-surface py-1.5 sm:py-2 pe-4 ps-9 sm:ps-10 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full text-text-primary placeholder:text-text-secondary text-xs sm:text-sm transition"
        />
      </div>

      <div className="flex gap-1.5 sm:gap-2 sm:ms-auto">
        <button
          type="button"
          onClick={toggleDate}
          aria-pressed={isDateActive}
          className={`flex items-center gap-1.5 px-3 sm:px-4 h-8 sm:h-9 rounded-lg font-medium text-xs sm:text-sm transition ${
            isDateActive
              ? "bg-primary text-on-primary"
              : "bg-surface hover:bg-border/40 text-text-secondary hover:text-text-primary"
          }`}
        >
          {sort === "oldest" ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
          {sort === "oldest" ? "Oldest" : "Newest"}
        </button>

        <button
          type="button"
          onClick={toggleName}
          aria-pressed={isNameActive}
          className={`flex items-center gap-1.5 px-3 sm:px-4 h-8 sm:h-9 rounded-lg font-medium text-xs sm:text-sm transition ${
            isNameActive
              ? "bg-primary text-on-primary"
              : "bg-surface hover:bg-border/40 text-text-secondary hover:text-text-primary"
          }`}
        >
          {sort === "name_desc" ? (
            <ArrowDown size={13} />
          ) : (
            <ArrowUp size={13} />
          )}
          {sort === "name_desc" ? "Name (Z–A)" : "Name (A–Z)"}
        </button>
      </div>
    </div>
  );
}
