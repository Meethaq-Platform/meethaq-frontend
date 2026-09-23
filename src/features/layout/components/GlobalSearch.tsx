"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, Loader2, Users } from "lucide-react";

import { useDebouncedValue } from "@/src/features/clients/hooks/useDebouncedValue";
import {
  useGlobalSearch,
  type SearchResultItem,
} from "../hooks/useGlobalSearch";
import { SearchField } from "./SearchField";

interface FlatResult extends SearchResultItem {
  group: "project" | "client";
}

export function GlobalSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebouncedValue(query, 400);
  const { projects, clients, isLoading, isError } =
    useGlobalSearch(debouncedQuery);

  const results: FlatResult[] = useMemo(
    () => [
      ...projects.map((item): FlatResult => ({ ...item, group: "project" })),
      ...clients.map((item): FlatResult => ({ ...item, group: "client" })),
    ],
    [projects, clients],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasQuery = query.trim().length > 0;
  const showDropdown = isOpen && hasQuery;

  const goTo = (item: FlatResult) => {
    setIsOpen(false);
    setQuery("");
    router.push(item.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!results.length) return;
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!results.length) return;
      setIsOpen(true);
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault();
        goTo(results[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SearchField
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
        }
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => {
          if (hasQuery) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search projects and clients..."
      />

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="top-full z-20 absolute bg-surface shadow-lg mt-1.5 border border-border rounded-xl w-full max-h-96 overflow-auto"
        >
          {isLoading ? (
            <p className="flex items-center gap-2 px-4 py-3 text-text-secondary text-sm">
              <Loader2 size={14} className="animate-spin" />
              Searching...
            </p>
          ) : isError ? (
            <p className="px-4 py-3 text-danger text-sm">
              Search failed. Try again.
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-text-secondary text-sm">
              No projects or clients match &ldquo;{query.trim()}&rdquo;.
            </p>
          ) : (
            <>
              {projects.length > 0 && (
                <ResultGroup
                  label="Projects"
                  icon={Briefcase}
                  items={projects}
                  listboxId={listboxId}
                  startIndex={0}
                  activeIndex={activeIndex}
                  onSelect={(item) => goTo({ ...item, group: "project" })}
                  onHover={setActiveIndex}
                />
              )}

              {clients.length > 0 && (
                <ResultGroup
                  label="Clients"
                  icon={Users}
                  items={clients}
                  listboxId={listboxId}
                  startIndex={projects.length}
                  activeIndex={activeIndex}
                  onSelect={(item) => goTo({ ...item, group: "client" })}
                  onHover={setActiveIndex}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface ResultGroupProps {
  label: string;
  icon: typeof Briefcase;
  items: SearchResultItem[];
  listboxId: string;
  startIndex: number;
  activeIndex: number;
  onSelect: (item: SearchResultItem) => void;
  onHover: (index: number) => void;
}

function ResultGroup({
  label,
  icon: Icon,
  items,
  listboxId,
  startIndex,
  activeIndex,
  onSelect,
  onHover,
}: ResultGroupProps) {
  return (
    <div className="py-1">
      <p className="px-4 py-1 font-semibold text-text-secondary text-xs uppercase tracking-wide">
        {label}
      </p>
      {items.map((item, i) => {
        const index = startIndex + i;
        const isActive = index === activeIndex;

        return (
          <Link
            key={item.href}
            id={`${listboxId}-${index}`}
            role="option"
            aria-selected={isActive}
            href={item.href}
            onMouseEnter={() => onHover(index)}
            onClick={() => onSelect(item)}
            className={`flex items-center gap-2.5 px-4 py-2 text-sm transition ${
              isActive ? "bg-surface-muted" : "hover:bg-surface-muted"
            }`}
          >
            <Icon size={14} className="text-text-secondary shrink-0" />
            <span className="flex-1 min-w-0">
              <span className="block text-text-primary truncate">
                {item.title}
              </span>
              {item.subtitle && (
                <span className="block text-text-secondary text-xs truncate">
                  {item.subtitle}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
