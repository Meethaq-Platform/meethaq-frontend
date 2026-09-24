import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ProjectContractStatus } from "@/src/features/projects/types/project";
import { ContractStatusBadge } from "@/src/features/contracts/components/ContractStatusBadge";

interface ClientContractCardProps {
  projectId: number;
  contractStatus: ProjectContractStatus;
}

// Client-side mirror of the freelancer's own ContractCard — same card
// chrome and structure for visual parity, but role-appropriate copy: the
// client reviews/approves rather than drafts/manages, so there's no "Create
// Contract" CTA, and "None"/"Draft" both collapse into one "nothing to
// review yet" empty state (a Draft contract isn't actionable by the client
// either way).
export function ClientContractCard({ projectId, contractStatus }: ClientContractCardProps) {
  const t = useTranslations("clientProjects.contractCard");
  const summaryKey = `summary.${contractStatus}` as "summary.Approved";
  const summary = t.has(summaryKey) ? t(summaryKey) : t("summaryFallback");
  const hasNothingToReview = contractStatus === "None" || contractStatus === "Draft";

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-text-secondary text-xs uppercase tracking-wide">
          {t("title")}
        </p>
        {!hasNothingToReview && <ContractStatusBadge status={contractStatus} />}
      </div>

      {hasNothingToReview ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="flex justify-center items-center bg-surface-muted mb-1 rounded-full w-12 h-12 text-text-secondary">
            <FileText size={20} />
          </div>
          <p className="font-semibold text-text-primary text-sm">{t("emptyTitle")}</p>
          <p className="max-w-xs text-text-secondary text-sm">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <Link
          href={`/projects/${projectId}/contract`}
          className="flex justify-between items-center gap-3 hover:bg-surface-muted -m-2 p-2 rounded-xl transition"
        >
          <p className="text-text-secondary text-sm">
            {summary}
          </p>
          <span className="flex items-center gap-1.5 font-semibold text-primary text-sm whitespace-nowrap shrink-0">
            {contractStatus === "Approved" ? t("view") : t("review")}
            <ArrowRight size={16} className="rtl-flip" />
          </span>
        </Link>
      )}
    </div>
  );
}
