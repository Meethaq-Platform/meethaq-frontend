import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

import type { ProjectSummary } from "../types/project";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ContractStatusBadge } from "@/src/features/contracts/components/ContractStatusBadge";
import Pagination from "@/src/shared/components/Pagination";
import EmptyState from "@/src/shared/components/EmptyState";
import RelativeTime from "@/src/shared/components/RelativeTime";
import { formatCurrency } from "@/src/shared/lib/format";

interface ProjectsTableProps {
  projects: ProjectSummary[];
  isFiltering: boolean;
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function ProjectsTable({
  projects,
  isFiltering,
  pageNumber,
  totalPages,
  totalCount,
  onPageChange,
}: ProjectsTableProps) {
  if (projects.length === 0) {
    return isFiltering ? (
      <EmptyState
        icon={Briefcase}
        title="No projects found"
        description="Try a different search or status filter."
      />
    ) : (
      <EmptyState
        icon={Briefcase}
        title="No projects yet"
        description="Create your first project to get started."
      />
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary-muted">
            <tr className="border-border border-b">
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                Title
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                Contract
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                Client
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 font-medium text-primary text-xs text-end uppercase tracking-wide">
                Value
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                Updated
              </th>
              <th className="relative px-6 py-3.5 font-medium text-primary text-xs text-end uppercase tracking-wide">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="even:bg-surface-muted hover:bg-border/40 transition"
              >
                <td className="px-6 py-4 font-medium text-text-primary">
                  {project.title}
                </td>

                <td className="px-6 py-4">
                  <ProjectStatusBadge status={project.status} />
                </td>

                <td className="px-6 py-4">
                  <ContractStatusBadge status={project.contractStatus} />
                </td>

                <td className="px-6 py-4 text-text-secondary">
                  {project.clientName ?? "Unassigned"}
                </td>

                <td className="hidden lg:table-cell px-6 py-4 font-numbers text-text-primary text-end">
                  {project.totalValue != null
                    ? formatCurrency(project.totalValue)
                    : "—"}
                </td>

                <td className="hidden lg:table-cell px-6 py-4 text-text-secondary">
                  <RelativeTime
                    value={project.updatedAt ?? project.createdAt}
                  />
                </td>

                <td className="px-6 py-4 text-end">
                  <Link
                    href={`/projects/${project.id}`}
                    aria-label={`View ${project.title} details`}
                    className="inline-flex justify-center items-center hover:bg-surface p-2 rounded-lg text-text-secondary hover:text-primary transition"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={onPageChange}
        itemLabel="project"
      />
    </div>
  );
}
