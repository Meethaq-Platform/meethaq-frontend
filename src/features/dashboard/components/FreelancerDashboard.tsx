"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import { useFreelancerDashboard } from "../hooks/useFreelancerDashboard";
import WelcomeHeader, { NEEDS_ATTENTION_ANCHOR_ID } from "./WelcomeHeader";
import LastUpdatedBar from "./LastUpdatedBar";
import SectionCard from "./SectionCard";
import ActionCenterList from "./ActionCenterList";
import FreelancerFinancialOverview from "./FreelancerFinancialOverview";
import FreelancerProjectOverview from "./FreelancerProjectOverview";
import UpcomingMilestonesList from "./UpcomingMilestonesList";
import RecentActivityFeed from "./RecentActivityFeed";
import FreelancerFirstUse from "./FreelancerFirstUse";

const CURRENCY_STORAGE_KEY = "dashboard-currency-freelancer";

function readStoredCurrency(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return localStorage.getItem(CURRENCY_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

function storeCurrency(currency: string) {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  } catch {
    // Best-effort only — a blocked/private-mode store just means the
    // selection won't persist across visits, not a broken dashboard.
  }
}

export default function FreelancerDashboard() {
  const t = useTranslations("dashboard");
  // Lazy initializer (not an effect): runs once per mount, safe on the
  // server (window guard) and doesn't need a setState-after-mount sync.
  const [currency, setCurrency] = useState<string | undefined>(
    readStoredCurrency,
  );
  const [isStale, setIsStale] = useState(false);

  const { data, isLoading, isError, isFetching, refetch } =
    useFreelancerDashboard(currency);

  const handleCurrencyChange = (next: string) => {
    setCurrency(next);
    storeCurrency(next);
  };

  const handleRefresh = async () => {
    const result = await refetch();
    setIsStale(!!result.error);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        message={t("loadFailed")}
        onRetry={() => refetch()}
      />
    );
  }

  if (data.firstUse.data?.isFirstUse) {
    return (
      <FreelancerFirstUse
        firstUse={data.firstUse.data}
        userName={data.welcome.data?.userName ?? null}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <LastUpdatedBar
        lastUpdatedAtUtc={data.lastUpdatedAtUtc}
        isRefreshing={isFetching}
        isStale={isStale}
        onRefresh={handleRefresh}
      />

      <div className="flex lg:flex-row flex-col gap-5">
        {data.welcome.data && (
          <div className="flex-1 min-w-0">
            <WelcomeHeader
              welcome={data.welcome.data}
              pendingActionsCount={data.actionCenter.data?.totalPendingCount}
            />
          </div>
        )}

        <div className="lg:w-96 shrink-0">
          <SectionCard
            title={t("sections.projectOverview")}
            section={data.projectOverview}
            viewAllHref={data.projectOverview.data?.viewAllNavigationUrl}
            onRetry={refetch}
          >
            {(overview) => <FreelancerProjectOverview overview={overview} />}
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title={t("sections.financialOverview")}
        section={data.financialOverview}
        onRetry={refetch}
      >
        {(overview) => (
          <FreelancerFinancialOverview
            overview={overview}
            currency={currency ?? overview.selectedCurrency ?? "USD"}
            onCurrencyChange={handleCurrencyChange}
          />
        )}
      </SectionCard>

      <div className="flex lg:flex-row flex-col gap-5">
        <div id={NEEDS_ATTENTION_ANCHOR_ID} className="flex-1 min-w-0 scroll-mt-6">
          <SectionCard
            title={t("sections.needsAttention")}
            section={data.actionCenter}
            onRetry={refetch}
          >
            {(actionCenter) => (
              <ActionCenterList
                items={actionCenter.items ?? []}
                emptyMessage={t("allCaughtUp")}
              />
            )}
          </SectionCard>
        </div>

        <div className="flex-1 min-w-0">
          <SectionCard
            title={t("sections.upcomingMilestones")}
            section={data.upcomingMilestones}
            onRetry={refetch}
          >
            {(items) => <UpcomingMilestonesList items={items} />}
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title={t("sections.recentActivity")}
        section={data.recentActivity}
        onRetry={refetch}
      >
        {(items) => <RecentActivityFeed items={items} />}
      </SectionCard>
    </div>
  );
}
