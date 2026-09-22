"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useProjects } from "../hooks/useProjects";
import { ProjectsToolbar } from "./ProjectsToolbar";
import { ProjectsTable } from "./ProjectsTable";
import type { ProjectStatus } from "../types/project";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

const PAGE_SIZE = 10;
const VALID_STATUSES: ProjectStatus[] = ["Draft", "Active", "Cancelled", "Completed"];

// Dashboard summary cards deep-link here as /projects?status=Active — the
// initial filter is read once from the URL so those links actually filter.
function useInitialStatus(): ProjectStatus | "" {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  return VALID_STATUSES.includes(status as ProjectStatus) ? (status as ProjectStatus) : "";
}

export default function ProjectsPage() {
  const [status, setStatus] = useState<ProjectStatus | "">(useInitialStatus());
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError, refetch } = useProjects({
    pageNumber,
    pageSize: PAGE_SIZE,
    status: status || undefined,
  });

  const handleStatusChange = (value: ProjectStatus | "") => {
    setStatus(value);
    setPageNumber(1);
  };

  return (
    <>
      <ProjectsToolbar status={status} onStatusChange={handleStatusChange} />

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message="Failed to load your projects."
          onRetry={() => refetch()}
        />
      ) : (
        <ProjectsTable
          projects={data.items}
          isFiltering={status.length > 0}
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          onPageChange={setPageNumber}
        />
      )}
    </>
  );
}
