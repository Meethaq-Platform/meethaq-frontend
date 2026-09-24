import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/src/shared/hooks/useFormat";

import type { MilestoneExecutionDetail } from "../types/milestone";
import { MilestoneStatusBadge } from "./MilestoneStatusBadge";
import { formatCurrency } from "@/src/shared/lib/format";

interface MilestoneDetailShellProps {
  projectId: string;
  milestone: MilestoneExecutionDetail;
  actions?: ReactNode;
  children: ReactNode;
}

// Shared header (title/description/deliverable/acceptance criteria/due/value/
// status) used by both MilestoneWorkspacePage (freelancer) and
// MilestoneReviewPage (client) — only the body below it differs by role.
export function MilestoneDetailShell({
  projectId,
  milestone,
  actions,
  children,
}: MilestoneDetailShellProps) {
  const t = useTranslations("milestones.detail");
  const tContracts = useTranslations("contracts.workspace");
  const format = useFormat();

  return (
    <div className="space-y-6 mx-auto h-full">
      <div className="flex justify-between items-center">
        <Link
          href={`/projects/${projectId}`}
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
        >
          <ArrowLeft size={16} className="rtl-flip" />
          {tContracts("back")}
        </Link>

        {actions}
      </div>

      <div className="bg-(--card-bg) p-6 border border-border rounded-2xl">
        <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
          <div className="flex-1">
            <h1 dir="auto" className="font-semibold text-text-primary text-lg">
              {milestone.title}
            </h1>
            {milestone.description && (
              <p dir="auto" className="mt-2 text-text-primary text-sm whitespace-pre-wrap">
                {milestone.description}
              </p>
            )}
          </div>

          <div className="flex flex-row sm:flex-col flex-wrap items-center sm:items-end gap-x-3 gap-y-1 sm:gap-2 w-full sm:w-fit shrink-0">
            <MilestoneStatusBadge status={milestone.executionStatus} />
            <p className="font-numbers font-semibold text-text-primary text-sm">
              {formatCurrency(milestone.calculatedAmount)}
            </p>
            <p className="text-text-secondary text-xs">
              {t("due", { date: format.date(milestone.dueDate) })}
            </p>
          </div>
        </div>

        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 mt-4 pt-4 border-text-primary border-t">
          <div>
            <p className="mb-1 text-text-secondary text-xs uppercase tracking-wide">
              {t("deliverable")}
            </p>
            <p dir="auto" className="text-text-primary text-sm whitespace-pre-wrap">
              {milestone.deliverable}
            </p>
          </div>
          <div>
            <p className="mb-1 text-text-secondary text-xs uppercase tracking-wide">
              {t("criteria")}
            </p>
            <p dir="auto" className="text-text-primary text-sm whitespace-pre-wrap">
              {milestone.acceptanceCriteria}
            </p>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
