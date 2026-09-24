import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ProjectSummary } from "@/src/features/projects/types/project";
import { ProjectStatusBadge } from "@/src/features/projects/components/ProjectStatusBadge";
import { ContractStatusBadge } from "@/src/features/contracts/components/ContractStatusBadge";
import Pagination from "@/src/shared/components/Pagination";
import EmptyState from "@/src/shared/components/EmptyState";
import RelativeTime from "@/src/shared/components/RelativeTime";
import { formatCurrency } from "@/src/shared/lib/format";

interface ClientProjectsTableProps {
  projects: ProjectSummary[];
  isFiltering?: boolean;
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function ClientProjectsTable({
  projects,
  isFiltering = false,
  pageNumber,
  totalPages,
  totalCount,
  onPageChange,
}: ClientProjectsTableProps) {
  const t = useTranslations("clientProjects.list");
  const tProjects = useTranslations("projects.list");

  if (projects.length === 0) {
    return isFiltering ? (
      <EmptyState
        icon={Briefcase}
        title={tProjects("noResultsTitle")}
        description={tProjects("noResultsDescription")}
      />
    ) : (
      <EmptyState
        icon={Briefcase}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
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
                {tProjects("columns.title")}
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                {tProjects("columns.status")}
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                {tProjects("columns.contract")}
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 font-medium text-primary text-xs text-end uppercase tracking-wide">
                {tProjects("columns.value")}
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                {tProjects("columns.updated")}
              </th>
              <th className="relative px-6 py-3.5 font-medium text-primary text-xs text-end uppercase tracking-wide">
                <span className="sr-only">{tProjects("columns.actions")}</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="even:bg-surface-muted hover:bg-border/40 transition"
              >
                <td dir="auto" className="px-6 py-4 font-medium text-text-primary">
                  {project.title}
                </td>

                <td className="px-6 py-4">
                  <ProjectStatusBadge status={project.status} />
                </td>

                <td className="px-6 py-4">
                  <ContractStatusBadge status={project.contractStatus} />
                </td>

                <td className="hidden lg:table-cell px-6 py-4 font-numbers text-text-primary text-end">
                  {project.totalValue != null ? formatCurrency(project.totalValue) : "—"}
                </td>

                <td className="hidden lg:table-cell px-6 py-4 text-text-secondary">
                  <RelativeTime value={project.updatedAt ?? project.createdAt} />
                </td>

                <td className="px-6 py-4 text-end">
                  <Link
                    href={`/projects/${project.id}`}
                    aria-label={tProjects("viewDetails", { title: project.title })}
                    className="inline-flex justify-center items-center hover:bg-surface p-2 rounded-lg text-text-secondary hover:text-primary transition"
                  >
                    <ArrowRight size={16} className="rtl-flip" />
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
