"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/src/shared/hooks/useFormat";

import { useClientProject } from "../hooks/useClientProject";
import { usePageTitle } from "@/src/shared/hooks/usePageTitle";
import { FreelancerInfoCard } from "./FreelancerInfoCard";
import { ClientContractCard } from "./ClientContractCard";
import { ProjectStatusBadge } from "@/src/features/projects/components/ProjectStatusBadge";
import { ExecutionOverviewCard } from "@/src/features/milestones/components/ExecutionOverviewCard";
import { MilestonesTab } from "@/src/features/milestones/components/MilestonesTab";
import { ProjectChatTab } from "@/src/features/project-chat/components/ProjectChatTab";
import { ActivityTab } from "@/src/features/activity-log/components/ActivityTab";
import { LastActivitySummary } from "@/src/features/activity-log/components/LastActivitySummary";
import { ProjectPaymentSummaryCard } from "@/src/features/payments/components/ProjectPaymentSummaryCard";
import { PaymentsTab } from "@/src/features/payments/components/PaymentsTab";
import { ChangeRequestsTab } from "@/src/features/change-requests/components/ChangeRequestsTab";
import { DisputesTab } from "@/src/features/disputes/components/DisputesTab";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import Tabs from "@/src/shared/components/Tabs";
import { formatCurrency } from "@/src/shared/lib/format";

interface ClientProjectDetailPageProps {
  projectId: string;
}

type DetailTab =
  | "overview"
  | "milestones"
  | "payments"
  | "changes"
  | "disputes"
  | "chat"
  | "activity";

const detailTabs: DetailTab[] = [
  "overview",
  "milestones",
  "payments",
  "changes",
  "disputes",
  "chat",
  "activity",
];

const validTabs: readonly string[] = detailTabs;

function readInitialTab(searchParams: URLSearchParams): DetailTab {
  const requested = searchParams.get("tab");
  return validTabs.includes(requested ?? "")
    ? (requested as DetailTab)
    : "overview";
}

export default function ClientProjectDetailPage({
  projectId,
}: ClientProjectDetailPageProps) {
  const t = useTranslations("projects.detail");
  const format = useFormat();
  const { data, isLoading, isError, refetch } = useClientProject(projectId);
  const tPageTitles = useTranslations("pageTitles");
  usePageTitle(data ? tPageTitles("project", { title: data.title }) : undefined);
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<DetailTab>(() => readInitialTab(searchParams));

  return (
    <div className="space-y-6 mx-auto h-full">
      <Link
        href="/projects"
        className="flex items-center gap-1.5 w-fit text-text-secondary hover:text-text-primary text-sm transition"
      >
        <ArrowLeft size={16} className="rtl-flip" />
        {t("back")}
      </Link>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message={t("loadFailed")}
          onRetry={() => refetch()}
        />
      ) : (
        <section className="space-y-6">
          <div className="bg-(--card-bg) p-6 border border-border rounded-2xl">
            <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 dir="auto" className="font-bold text-text-primary text-xl md:text-2xl truncate">
                    {data.title}
                  </h1>
                  <ProjectStatusBadge status={data.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-text-secondary text-sm">
                  <span>{t("created", { date: format.date(data.createdAt) })}</span>
                  {data.totalValue != null && (
                    <>
                      <span aria-hidden className="text-border">
                        ·
                      </span>
                      <span className="font-numbers font-semibold text-text-primary">
                        {formatCurrency(data.totalValue)}
                      </span>
                    </>
                  )}
                </div>

                {data.description && (
                  <p dir="auto" className="mt-3 text-text-primary text-sm whitespace-pre-wrap">
                    {data.description}
                  </p>
                )}
              </div>

              <LastActivitySummary projectId={projectId} />
            </div>
          </div>

          <Tabs
            value={tab}
            onChange={setTab}
            options={detailTabs.map((value) => ({ value, label: t(`tabs.${value}`) }))}
          />

          {tab === "overview" && (
            <div className="space-y-6">
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <FreelancerInfoCard freelancerName={data.freelancerName} />
                <ClientContractCard
                  projectId={data.id}
                  contractStatus={data.contractStatus}
                />
              </div>

              {data.contractStatus === "Approved" && (
                <>
                  <ExecutionOverviewCard projectId={projectId} />
                  <ProjectPaymentSummaryCard projectId={projectId} />
                </>
              )}
            </div>
          )}

          {tab === "milestones" && <MilestonesTab projectId={projectId} />}
          {tab === "payments" && <PaymentsTab projectId={projectId} />}
          {tab === "changes" && <ChangeRequestsTab projectId={projectId} />}
          {tab === "disputes" && <DisputesTab projectId={projectId} />}
          {tab === "chat" && <ProjectChatTab projectId={projectId} />}
          {tab === "activity" && <ActivityTab projectId={projectId} />}
        </section>
      )}
    </div>
  );
}
