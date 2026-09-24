import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ContractSummary } from "../types/contract";
import { formatCurrency } from "@/src/shared/lib/format";

export function ContractSummaryCard({ summary }: { summary: ContractSummary }) {
  const t = useTranslations("contracts.summary");
  const isOverAllocated = summary.remainingValue < 0;
  const percentage = Math.min(summary.totalPercentage, 100);

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <h2 className="mb-4 font-semibold text-text-primary text-base">
        {t("title")}
      </h2>

      <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">
            {t("projectValue")}
          </p>
          <p className="font-numbers font-semibold text-text-primary text-lg">
            {formatCurrency(summary.projectValue)}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">
            {t("allocated")}
          </p>
          <p className="font-numbers font-semibold text-text-primary text-lg">
            {formatCurrency(summary.allocatedValue)}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">
            {t("remaining")}
          </p>
          <p
            className={`font-numbers font-semibold text-lg ${
              isOverAllocated ? "text-danger" : "text-text-primary"
            }`}
          >
            {/* ltr keeps the minus sign in front of the amount in Arabic */}
            <span dir="ltr">
              {isOverAllocated
                ? `−${formatCurrency(Math.abs(summary.remainingValue))}`
                : formatCurrency(summary.remainingValue)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="bg-surface-muted rounded-full w-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              summary.isAllocationComplete
                ? "bg-primary"
                : isOverAllocated
                  ? "bg-danger"
                  : "bg-accent-value"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          {summary.isAllocationComplete ? (
            <>
              <CheckCircle2 size={14} className="text-success" />
              <p className="text-success text-xs">
                {t("fullyAllocated", { count: summary.milestoneCount })}
              </p>
            </>
          ) : (
            <>
              <AlertTriangle
                size={14}
                className={
                  isOverAllocated ? "text-danger" : "text-accent-value"
                }
              />
              <p
                className={
                  isOverAllocated
                    ? "text-danger text-xs"
                    : "text-text-secondary text-xs"
                }
              >
                {isOverAllocated
                  ? t.rich("overAllocated", {
                      amount: formatCurrency(Math.abs(summary.remainingValue)),
                      bdi: (chunks) => <bdi>{chunks}</bdi>,
                    })
                  : t("partial", {
                      percent: summary.totalPercentage.toFixed(1),
                      count: summary.milestoneCount,
                    })}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
