"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";

import { useProject } from "../hooks/useProject";
import { usePageTitle } from "@/src/shared/hooks/usePageTitle";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { EditProjectForm } from "./EditProjectForm";
import { ClientCard } from "./ClientCard";
import { ContractCard } from "./ContractCard";
import { CompleteProjectButton } from "./CompleteProjectButton";
import { CancelProjectButton } from "./CancelProjectButton";
import { ExecutionOverviewCard } from "@/src/features/milestones/components/ExecutionOverviewCard";
import { MilestonesTab } from "@/src/features/milestones/components/MilestonesTab";
import { ProjectChatTab } from "@/src/features/project-chat/components/ProjectChatTab";
import { ActivityTab } from "@/src/features/activity-log/components/ActivityTab";
import { LastActivitySummary } from "@/src/features/activity-log/components/LastActivitySummary";
import { ProjectPaymentSummaryCard } from "@/src/features/payments/components/ProjectPaymentSummaryCard";
import { PaymentsTab } from "@/src/features/payments/components/PaymentsTab";
import { ChangeRequestsTab } from "@/src/features/change-requests/components/ChangeRequestsTab";
import { DisputesTab } from "@/src/features/disputes/components/DisputesTab";
import Button from "@/src/shared/components/Button";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import Tabs from "@/src/shared/components/Tabs";
import { formatCurrency, formatDate } from "@/src/shared/lib/format";

interface ProjectDetailPageProps {
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

// Lets other pages deep-link here with e.g. ?tab=payments (used by the
// "View Payment" link shown once a milestone is accepted) — falls back to
// "overview" for a missing/invalid value rather than an invalid tab state.
function readInitialTab(searchParams: URLSearchParams): DetailTab {
  const requested = searchParams.get("tab");
  return validTabs.includes(requested ?? "")
    ? (requested as DetailTab)
    : "overview";
}

export default function ProjectDetailPage({
  projectId,
}: ProjectDetailPageProps) {
  const { data, isLoading, isError, refetch } = useProject(projectId);
  usePageTitle(data ? `Projects/${data.title}` : undefined);
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [tab, setTab] = useState<DetailTab>(() => readInitialTab(searchParams));
  const isSaving = useIsMutating({ mutationKey: ["update-project"] }) > 0;

  const canEdit = data?.status === "Draft";
  const canCancel = data?.status === "Draft" || data?.status === "Active";
  const canComplete =
    data?.status === "Active" && data?.contractStatus === "Approved";

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
          {/* Header: title + status + metadata merged in one place, actions
              alongside — replaces the old near-empty "Dashboard" card. */}
          <div className="bg-(--card-bg) p-4 sm:p-6 border border-border rounded-2xl">
            <div className="flex flex-row justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <EditProjectForm
                    project={data}
                    onSuccess={() => setIsEditing(false)}
                    onDirtyChange={setIsFormDirty}
                  />
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h1 className="font-bold text-text-primary text-lg sm:text-xl md:text-2xl wrap-break-word">
                        {data.title}
                      </h1>
                      <ProjectStatusBadge status={data.status} />
                      {canComplete && (
                        <CompleteProjectButton projectId={data.id} />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-text-secondary text-xs sm:text-sm">
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
                      <p className="mt-3 text-text-primary text-xs sm:text-sm whitespace-pre-wrap">
                        {data.description}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-wrap justify-end items-center gap-1.5 sm:gap-2 shrink-0">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="amber"
                      onClick={() => setIsEditing(false)}
                      className="px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      form="project-edit-form"
                      disabled={!isFormDirty}
                      loading={isSaving}
                      loadingText="Saving..."
                      className="px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    {canEdit && (
                      <Button
                        type="button"
                        onClick={() => {
                          setIsFormDirty(false);
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-1.5 px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <Pencil size={14} className="sm:size-4 size-3.5" />
                        Edit
                      </Button>
                    )}

                    {canCancel && <CancelProjectButton projectId={data.id} />}
                  </>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="flex sm:justify-end mt-4">
                <LastActivitySummary projectId={projectId} />
              </div>
            )}
          </div>

          <Tabs value={tab} onChange={setTab} options={detailTabs} />

          {tab === "overview" && (
            <div className="space-y-6">
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <ClientCard project={data} canEdit={canEdit} />
                <ContractCard project={data} />
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
