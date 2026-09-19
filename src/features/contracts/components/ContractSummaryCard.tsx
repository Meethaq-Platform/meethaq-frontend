import { AlertTriangle, CheckCircle2 } from "lucide-react";

import type { ContractSummary } from "../types/contract";
import { formatCurrency } from "@/src/shared/lib/format";

export function ContractSummaryCard({ summary }: { summary: ContractSummary }) {
  const isOverAllocated = summary.remainingValue < 0;
  const percentage = Math.min(summary.totalPercentage, 100);

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <h2 className="mb-4 font-semibold text-text-primary text-base">
        Value Breakdown
      </h2>

      <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">
            Project Value
          </p>
          <p className="font-numbers font-semibold text-text-primary text-lg">
            {formatCurrency(summary.projectValue)}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">
            Allocated
          </p>
          <p className="font-numbers font-semibold text-text-primary text-lg">
            {formatCurrency(summary.allocatedValue)}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide">
            Remaining
          </p>
          <p
            className={`font-numbers font-semibold text-lg ${
              isOverAllocated ? "text-danger" : "text-text-primary"
            }`}
          >
            {isOverAllocated
              ? `−${formatCurrency(Math.abs(summary.remainingValue))}`
              : formatCurrency(summary.remainingValue)}
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
                Fully allocated across {summary.milestoneCount}{" "}
                {summary.milestoneCount === 1 ? "milestone" : "milestones"}
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
                  ? `Over-allocated by ${formatCurrency(Math.abs(summary.remainingValue))} — reduce a milestone before submitting`
                  : `${summary.totalPercentage.toFixed(1)}% allocated across ${summary.milestoneCount} ${summary.milestoneCount === 1 ? "milestone" : "milestones"} — must total 100% before submitting`}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
