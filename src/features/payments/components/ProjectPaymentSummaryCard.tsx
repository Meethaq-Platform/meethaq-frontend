"use client";

import { useTranslations } from "next-intl";

import { usePaymentsSummary } from "../hooks/usePaymentsSummary";
import Spinner from "@/src/shared/components/Spinner";
import { formatCurrency } from "@/src/shared/lib/format";

interface ProjectPaymentSummaryCardProps {
  projectId: string;
}

// Tracking-only summary (not a wallet balance) — modeled directly on
// ExecutionOverviewCard's stats-grid layout for visual consistency between
// the two "project-wide numbers" cards on the Overview tab.
export function ProjectPaymentSummaryCard({ projectId }: ProjectPaymentSummaryCardProps) {
  const t = useTranslations("payments.summary");
  const { data: summary, isLoading } = usePaymentsSummary(projectId);

  if (isLoading) {
    return (
      <div className="bg-surface p-6 border border-border rounded-2xl">
        <Spinner size={20} />
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const currency = summary.currency;

  const stats = [
    { label: t("approvedValue"), value: formatCurrency(summary.approvedProjectValue, currency) },
    { label: t("totalPaid"), value: formatCurrency(summary.totalPaid, currency) },
    { label: t("totalUnpaid"), value: formatCurrency(summary.totalUnpaid, currency) },
    { label: t("eligible"), value: formatCurrency(summary.amountEligible, currency) },
    {
      label: t("awaitingConfirmation"),
      value: formatCurrency(summary.amountAwaitingConfirmation, currency),
    },
    {
      label: t("issues"),
      value: formatCurrency(summary.amountWithPaymentIssues, currency),
      danger: summary.amountWithPaymentIssues > 0,
    },
    {
      label: t("disputeHold"),
      value: formatCurrency(summary.amountOnDisputeHold, currency),
      danger: summary.amountOnDisputeHold > 0,
    },
  ];

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <h2 className="mb-4 font-semibold text-text-primary text-base">
        {t("title")}
      </h2>

      <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p
              className={`font-numbers font-semibold text-lg ${
                stat.danger ? "text-danger" : "text-text-primary"
              }`}
            >
              {stat.value}
            </p>
            <p className="text-text-secondary text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
