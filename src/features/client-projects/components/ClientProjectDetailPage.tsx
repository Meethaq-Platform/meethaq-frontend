"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useClientProject } from "../hooks/useClientProject";
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
import { formatCurrency, formatDate } from "@/src/shared/lib/format";

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

const detailTabs: { value: DetailTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "milestones", label: "Milestones" },
  { value: "payments", label: "Payments" },
  { value: "changes", label: "Change Requests" },
  { value: "disputes", label: "Disputes" },
  { value: "chat", label: "Chat" },
  { value: "activity", label: "Activity" },
];

const validTabs: readonly string[] = detailTabs.map((t) => t.value);

function readInitialTab(searchParams: URLSearchParams): DetailTab {
  const requested = searchParams.get("tab");
  return validTabs.includes(requested ?? "")
    ? (requested as DetailTab)
    : "overview";
}

export default function ClientProjectDetailPage({
  projectId,
}: ClientProjectDetailPageProps) {
  const { data, isLoading, isError, refetch } = useClientProject(projectId);
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<DetailTab>(() => readInitialTab(searchParams));

  return (
    <div className="space-y-6 mx-auto h-full">
      <Link
        href="/projects"
        className="flex items-center gap-1.5 w-fit text-text-secondary hover:text-text-primary text-sm transition"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message="Failed to load this project."
          onRetry={() => refetch()}
        />
      ) : (
        <section className="space-y-6">
          <div className="bg-(--amber-bg) p-6 border border-border rounded-2xl">
            <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-bold text-text-primary text-xl md:text-2xl truncate">
                    {data.title}
                  </h1>
                  <ProjectStatusBadge status={data.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-text-secondary text-sm">
                  <span>Created {formatDate(data.createdAt)}</span>
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
                  <p className="mt-3 text-text-primary text-sm whitespace-pre-wrap">
                    {data.description}
                  </p>
                )}
              </div>

              <LastActivitySummary projectId={projectId} />
            </div>
          </div>

          <Tabs value={tab} onChange={setTab} options={detailTabs} />

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
