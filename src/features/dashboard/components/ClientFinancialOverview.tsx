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
import type { ClientFinancialOverview as ClientFinancialOverviewDto, TrendPeriod } from "../types/dashboard";

interface ClientFinancialOverviewProps {
  overview: ClientFinancialOverviewDto;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

// Feature 11/12/13. Recording a payment does not itself raise Total
// Confirmed Payments — that card only moves once the freelancer confirms
// receipt — so "Awaiting Freelancer Confirmation" and "Payment Issues" are
// shown as their own cards rather than folded into a spendable total.
export default function ClientFinancialOverview({
  overview,
  currency,
  onCurrencyChange,
}: ClientFinancialOverviewProps) {
  const t = useTranslations("dashboard.financial.client");
  const [period, setPeriod] = useState<TrendPeriod>(6);
  const [showAllCards, setShowAllCards] = useState(false);
  const trend = useFinancialTrend("client", period, currency);
  const followUp = usePaymentFollowUp("client", currency);

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
          <FinancialMetricCardView card={overview.totalConfirmedPayments} tone="primary" />
          <FinancialMetricCardView card={overview.confirmedPaymentsThisMonth} tone="info" />
          <FinancialMetricCardView card={overview.approvedProjectValue} tone="amber" />
          <FinancialMetricCardView card={overview.totalUnpaidValue} tone="success" />

          {showAllCards && (
            <>
              <FinancialMetricCardView card={overview.readyForPayment} />
              <FinancialMetricCardView card={overview.awaitingFreelancerConfirmation} />
              <FinancialMetricCardView card={overview.paymentIssues} />
              <FinancialMetricCardView card={overview.onDisputeHold} />
              <FinancialMetricCardView card={overview.futureMilestoneValue} />
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
