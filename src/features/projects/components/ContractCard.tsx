import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Project } from "../types/project";
import { ContractStatusBadge } from "@/src/features/contracts/components/ContractStatusBadge";
import Button from "@/src/shared/components/Button";

// The "no contract" empty state intentionally doesn't reuse the shared
// EmptyState component here — EmptyState draws its own card chrome
// (border/bg/rounded), which would double up with this card's own wrapper.
export function ContractCard({ project }: { project: Project }) {
  const t = useTranslations("projects.contractCard");
  const summaryKey = `summary.${project.contractStatus}` as "summary.Draft";
  const summary = t.has(summaryKey) ? t(summaryKey) : t("summaryFallback");
  const isEligible = Boolean(project.clientId) && project.totalValue != null;

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-text-secondary text-xs uppercase tracking-wide">
          {t("title")}
        </p>
        {project.contractStatus !== "None" && (
          <ContractStatusBadge status={project.contractStatus} />
        )}
      </div>

      {project.contractStatus === "None" ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="flex justify-center items-center bg-surface-muted mb-1 rounded-full w-12 h-12 text-text-secondary">
            <FileText size={20} />
          </div>
          <p className="font-semibold text-text-primary text-sm">{t("emptyTitle")}</p>
          <p className="max-w-xs text-text-secondary text-sm">
            {isEligible ? t("emptyEligible") : t("emptyIneligible")}
          </p>
          <Link href={`/projects/${project.id}/contract`} className="mt-2">
            <Button type="button" className="h-9">
              {t("create")}
            </Button>
          </Link>
        </div>
      ) : (
        <Link
          href={`/projects/${project.id}/contract`}
          className="flex justify-between items-center gap-3 hover:bg-surface-muted -m-2 p-2 rounded-xl transition"
        >
          <p className="text-text-secondary text-sm">
            {summary}
          </p>
          <span className="flex items-center gap-1.5 font-semibold text-primary text-sm whitespace-nowrap shrink-0">
            {project.contractStatus === "Approved" ? t("view") : t("manage")}
            <ArrowRight size={16} className="rtl-flip" />
          </span>
        </Link>
      )}
    </div>
  );
}
