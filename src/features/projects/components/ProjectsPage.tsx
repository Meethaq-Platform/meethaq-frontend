"use client";

import { useTranslations } from "next-intl";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useProjects } from "../hooks/useProjects";
import { useDebouncedValue } from "@/src/features/clients/hooks/useDebouncedValue";
import { ProjectsToolbar } from "./ProjectsToolbar";
import { ProjectsTable } from "./ProjectsTable";
import type { ProjectStatus } from "../types/project";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

const PAGE_SIZE = 10;
// /projects has no server-side title filter (only PageNumber/PageSize/Status)
// — while searching, a larger page is fetched and matched by title
// client-side instead, then paginated locally at the same PAGE_SIZE. 50 is
// the backend's own max PageSize (it 400s above that).
const SEARCH_FETCH_SIZE = 50;
const VALID_STATUSES: ProjectStatus[] = ["Draft", "Active", "Cancelled", "Completed"];

// Dashboard summary cards deep-link here as /projects?status=Active — the
// initial filter is read once from the URL so those links actually filter.
function useInitialStatus(): ProjectStatus | "" {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  return VALID_STATUSES.includes(status as ProjectStatus) ? (status as ProjectStatus) : "";
}

export default function ProjectsPage() {
  const t = useTranslations("projects.list");
  const [status, setStatus] = useState<ProjectStatus | "">(useInitialStatus());
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 400);
  const isSearching = debouncedSearch.trim().length > 0;

  const { data, isLoading, isError, refetch } = useProjects({
    pageNumber: isSearching ? 1 : pageNumber,
    pageSize: isSearching ? SEARCH_FETCH_SIZE : PAGE_SIZE,
    status: status || undefined,
  });

  const filteredItems = useMemo(() => {
    if (!isSearching) return data?.items ?? [];
    const needle = debouncedSearch.trim().toLowerCase();
    return (data?.items ?? []).filter((project) =>
      project.title.toLowerCase().includes(needle),
    );
  }, [data?.items, isSearching, debouncedSearch]);

  const pageItems = isSearching
    ? filteredItems.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE)
    : filteredItems;

  const totalCount = isSearching ? filteredItems.length : (data?.totalCount ?? 0);
  const totalPages = isSearching
    ? Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
    : (data?.totalPages ?? 1);

  const handleStatusChange = (value: ProjectStatus | "") => {
    setStatus(value);
    setPageNumber(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageNumber(1);
  };

  return (
    <>
      <ProjectsToolbar
        status={status}
        onStatusChange={handleStatusChange}
        search={search}
        onSearchChange={handleSearchChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message={t("loadFailed")}
          onRetry={() => refetch()}
        />
      ) : (
        <ProjectsTable
          projects={pageItems}
          isFiltering={status.length > 0 || isSearching}
          pageNumber={pageNumber}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setPageNumber}
        />
      )}
    </>
  );
}
