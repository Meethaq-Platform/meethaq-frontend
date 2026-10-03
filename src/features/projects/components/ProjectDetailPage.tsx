"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useFormat } from "@/src/shared/hooks/useFormat";

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
import { ProjectDetailSkeleton } from "./ProjectDetailSkeleton";
import ErrorState from "@/src/shared/components/ErrorState";
import Tabs from "@/src/shared/components/Tabs";
import { useProjectTab } from "../hooks/useProjectTab";
import { PROJECT_TABS } from "../lib/project-tabs";
import { formatCurrency } from "@/src/shared/lib/format";
import {
  useClearUpdates,
  useProjectUpdates,
} from "@/src/features/notifications/hooks/useProjectUpdates";
import { useActivityUpdates } from "@/src/features/activity-log/hooks/useActivityUpdates";

interface ProjectDetailPageProps {
  projectId: string;
}

export default function ProjectDetailPage({
  projectId,
}: ProjectDetailPageProps) {
  const t = useTranslations("projects.detail");
  const tActions = useTranslations("common.actions");
  const format = useFormat();
  const { data, isLoading, isError, refetch } = useProject(projectId);
  const tPageTitles = useTranslations("pageTitles");
  usePageTitle(data ? tPageTitles("project", { title: data.title }) : undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [tab, setTab] = useProjectTab();
  const updates = useProjectUpdates();
  const activityUpdates = useActivityUpdates(projectId);
  // Opening a tab clears its tab-wide updates (chat, overview...); updates
  // about one record clear when that record is opened.
  useClearUpdates(projectId, tab, null, Boolean(data));
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
        <ArrowLeft size={16} className="rtl-flip" />
        {t("back")}
      </Link>

      {isLoading ? (
        <ProjectDetailSkeleton withBackLink={false} />
      ) : isError || !data ? (
        <ErrorState
          message={t("loadFailed")}
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
                      <h1 dir="auto" className="font-bold text-text-primary text-lg sm:text-xl md:text-2xl wrap-break-word">
                        {data.title}
                      </h1>
                      <ProjectStatusBadge status={data.status} />
                      {canComplete && (
                        <CompleteProjectButton projectId={data.id} />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-text-secondary text-xs sm:text-sm">
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
                      <p dir="auto" className="mt-3 text-text-primary text-xs sm:text-sm whitespace-pre-wrap">
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
                      {tActions("cancel")}
                    </Button>

                    <Button
                      type="submit"
                      form="project-edit-form"
                      disabled={!isFormDirty}
                      loading={isSaving}
                      loadingText={tActions("saving")}
                      className="px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
                    >
                      {tActions("saveChanges")}
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
                        {tActions("edit")}
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

          <Tabs
            value={tab}
            onChange={setTab}
            options={PROJECT_TABS.map((value) => ({
              value,
              label: t(`tabs.${value}`),
              dot:
                value === "activity"
                  ? activityUpdates.hasNew
                  : updates.forTab(projectId, value),
            }))}
          />

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
