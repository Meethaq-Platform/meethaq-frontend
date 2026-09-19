"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";

import { useProject } from "../hooks/useProject";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { EditProjectForm } from "./EditProjectForm";
import { ClientCard } from "./ClientCard";
import { ContractCard } from "./ContractCard";
import { ProjectOverflowMenu } from "./ProjectOverflowMenu";
import { ExecutionOverviewCard } from "@/src/features/milestones/components/ExecutionOverviewCard";
import { MilestonesTab } from "@/src/features/milestones/components/MilestonesTab";
import { ProjectChatTab } from "@/src/features/project-chat/components/ProjectChatTab";
import { ActivityTab } from "@/src/features/activity-log/components/ActivityTab";
import Button from "@/src/shared/components/Button";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import Tabs from "@/src/shared/components/Tabs";
import { formatCurrency, formatDate } from "@/src/shared/lib/format";

interface ProjectDetailPageProps {
  projectId: string;
}

type DetailTab = "overview" | "milestones" | "chat" | "activity";

const detailTabs: { value: DetailTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "milestones", label: "Milestones" },
  { value: "chat", label: "Chat" },
  { value: "activity", label: "Activity" },
];

export default function ProjectDetailPage({
  projectId,
}: ProjectDetailPageProps) {
  const { data, isLoading, isError, refetch } = useProject(projectId);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [tab, setTab] = useState<DetailTab>("overview");
  const isSaving = useIsMutating({ mutationKey: ["update-project"] }) > 0;

  const canEdit = data?.status === "Draft";
  const canCancel = data?.status === "Draft" || data?.status === "Active";

  return (
    <div className="space-y-6 mx-auto h-full">
      <Link
        href="/projects"
        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
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
          <div className="bg-(--amber-bg) p-6 border border-border rounded-2xl">
            <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <EditProjectForm
                    project={data}
                    onSuccess={() => setIsEditing(false)}
                    onDirtyChange={setIsFormDirty}
                  />
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="amber"
                      onClick={() => setIsEditing(false)}
                      className="h-9"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      form="project-edit-form"
                      disabled={!isFormDirty}
                      loading={isSaving}
                      loadingText="Saving..."
                      className="h-9"
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
                        className="flex items-center gap-1.5 h-9"
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                    )}

                    {canCancel && <ProjectOverflowMenu projectId={data.id} />}
                  </>
                )}
              </div>
            </div>
          </div>

          <Tabs value={tab} onChange={setTab} options={detailTabs} />

          {tab === "overview" && (
            <div className="space-y-6">
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <ClientCard project={data} canEdit={canEdit} />
                <ContractCard project={data} />
              </div>

              {data.contractStatus === "Approved" && (
                <ExecutionOverviewCard projectId={projectId} />
              )}
            </div>
          )}

          {tab === "milestones" && <MilestonesTab projectId={projectId} />}
          {tab === "chat" && <ProjectChatTab projectId={projectId} />}
          {tab === "activity" && <ActivityTab projectId={projectId} />}
        </section>
      )}
    </div>
  );
}
