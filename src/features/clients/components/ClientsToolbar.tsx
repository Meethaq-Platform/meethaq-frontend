"use client";

import { ArrowUpDown, Search } from "lucide-react";

interface ClientsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

// The only values /clients' SortBy param accepts.
const sortOptions: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
];

export function ClientsToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
}: ClientsToolbarProps) {
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
          placeholder="Search by name, email, or company..."
          className="bg-surface py-2 pr-4 pl-10 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full text-text-primary placeholder:text-text-secondary text-sm transition"
        />
      </div>

      <div className="relative sm:ml-auto">
        <ArrowUpDown
          size={15}
          className="top-1/2 left-3 absolute text-text-secondary -translate-y-1/2 pointer-events-none"
        />

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="bg-surface py-2 pr-8 pl-9 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto h-full text-text-primary text-sm transition appearance-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
