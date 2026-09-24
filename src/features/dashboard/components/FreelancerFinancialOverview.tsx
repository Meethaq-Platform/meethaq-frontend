"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CurrencySelect from "./CurrencySelect";
import FinancialMetricCardView from "./FinancialMetricCardView";
import ShowMoreToggle from "./ShowMoreToggle";
import IncomeTrendChart from "./IncomeTrendChart";
import PaymentFollowUpTable from "./PaymentFollowUpTable";
import ErrorState from "@/src/shared/components/ErrorState";
import { useFinancialTrend } from "../hooks/useFinancialTrend";
import { usePaymentFollowUp } from "../hooks/usePaymentFollowUp";
import type { FreelancerFinancialOverview as FreelancerFinancialOverviewDto, TrendPeriod } from "../types/dashboard";

interface FreelancerFinancialOverviewProps {
  overview: FreelancerFinancialOverviewDto;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

// Feature 5/6/7. Cards are read straight off the backend's reconciled DTO —
// no client-side math combines them, per the sprint rule that overlapping
// metrics (e.g. Income Received This Month is part of Total Income Received)
// must never be presented as separately-additive balances.
export default function FreelancerFinancialOverview({
  overview,
  currency,
  onCurrencyChange,
}: FreelancerFinancialOverviewProps) {
  const t = useTranslations("dashboard.financial.freelancer");
  const [period, setPeriod] = useState<TrendPeriod>(6);
  const [showAllCards, setShowAllCards] = useState(false);
  const trend = useFinancialTrend("freelancer", period, currency);
  const followUp = usePaymentFollowUp("freelancer", currency);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <CurrencySelect
          currencies={overview.availableCurrencies ?? []}
          value={currency}
          onChange={onCurrencyChange}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="gap-3 grid grid-cols-2 lg:grid-cols-4">
          <FinancialMetricCardView card={overview.totalIncomeReceived} tone="primary" />
          <FinancialMetricCardView card={overview.incomeReceivedThisMonth} tone="info" />
          <FinancialMetricCardView card={overview.approvedProjectValue} tone="amber" />
          <FinancialMetricCardView card={overview.acceptedWorkValue} tone="success" />

          {showAllCards && (
            <>
              <FinancialMetricCardView card={overview.totalUnpaidValue} />
              <FinancialMetricCardView card={overview.readyForClientPayment} />
              <FinancialMetricCardView card={overview.awaitingReceiptConfirmation} />
              <FinancialMetricCardView card={overview.paymentIssues} />
              <FinancialMetricCardView card={overview.onDisputeHold} />
              <FinancialMetricCardView card={overview.notYetEligible} />
            </>
          )}
        </div>

        <ShowMoreToggle expanded={showAllCards} onToggle={() => setShowAllCards((prev) => !prev)} />
      </div>

      <div>
        {trend.isLoading ? (
          <div className="flex justify-center py-8">
            <div className="border-2 border-primary/30 border-t-primary rounded-full w-6 h-6 animate-spin" />
          </div>
        ) : trend.isError || !trend.data ? (
          <ErrorState message={t("trendFailed")} onRetry={() => trend.refetch()} />
        ) : (
          <IncomeTrendChart
            trend={trend.data}
            period={period}
            onPeriodChange={setPeriod}
            title={t("trendTitle")}
          />
        )}
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-text-primary text-sm">{t("followUpTitle")}</h3>
        {followUp.isLoading ? (
          <div className="flex justify-center py-8">
            <div className="border-2 border-primary/30 border-t-primary rounded-full w-6 h-6 animate-spin" />
          </div>
        ) : followUp.isError || !followUp.data ? (
          <ErrorState message={t("followUpFailed")} onRetry={() => followUp.refetch()} />
        ) : (
          <PaymentFollowUpTable items={followUp.data.items ?? []} counterpartyLabel={t("counterparty")} />
        )}
      </div>
    </div>
  );
}
