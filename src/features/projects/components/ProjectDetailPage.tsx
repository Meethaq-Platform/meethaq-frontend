"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";

import { useProject } from "../hooks/useProject";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { AssignClientControl } from "./AssignClientControl";
import { CancelProjectButton } from "./CancelProjectButton";
import { EditProjectForm } from "./EditProjectForm";
import { ContractStatusBadge } from "@/src/features/contracts/components/ContractStatusBadge";
import { ExecutionOverviewCard } from "@/src/features/milestones/components/ExecutionOverviewCard";
import { MilestonesTab } from "@/src/features/milestones/components/MilestonesTab";
import { ProjectChatTab } from "@/src/features/project-chat/components/ProjectChatTab";
import { ActivityTab } from "@/src/features/activity-log/components/ActivityTab";
import Button from "@/src/shared/components/Button";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import Tabs from "@/src/shared/components/Tabs";
import { formatCurrency } from "@/src/shared/lib/format";

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
      <div className="flex justify-between items-center">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {data &&
          (isEditing ? (
            <div key="editing-actions" className="flex items-center gap-3">
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
            </div>
          ) : (
            <div key="viewing-actions" className="flex items-center gap-3">
              {canCancel && <CancelProjectButton projectId={data.id} />}

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
            </div>
          ))}
      </div>

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
          <Tabs value={tab} onChange={setTab} options={detailTabs} />

          {tab === "overview" && (
            <div className="space-y-6">
              <div className="flex sm:flex-row flex-col justify-between items-start gap-4 bg-surface p-6 border border-border rounded-2xl">
                <div className="flex-1">
                  {isEditing ? (
                    <EditProjectForm
                      project={data}
                      onSuccess={() => setIsEditing(false)}
                      onDirtyChange={setIsFormDirty}
                    />
                  ) : (
                    <div>
                      <h1 className="font-semibold text-text-primary text-lg">
                        {data.title}
                      </h1>
                      <p className="mt-2 text-text-primary text-sm whitespace-pre-wrap">
                        {data.description ?? "—"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 w-fit shrink-0">
                  <ProjectStatusBadge status={data.status} />
                  <p className="text-text-secondary text-sm text-right">
                    Created {new Date(data.createdAt).toLocaleDateString()}
                  </p>
                  {data.totalValue != null && (
                    <p className="font-numbers font-semibold text-text-primary text-sm">
                      {formatCurrency(data.totalValue)}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-surface p-6 border border-border rounded-2xl">
                <p className="mb-2 text-text-secondary text-xs uppercase tracking-wide">
                  Client
                </p>

                {canEdit ? (
                  <AssignClientControl
                    projectId={data.id}
                    clientId={data.clientId}
                    clientName={data.clientName}
                  />
                ) : (
                  <p className="text-text-primary text-sm">
                    {data.clientName ?? "Unassigned"}
                  </p>
                )}
              </div>

              <Link
                href={`/projects/${data.id}/contract`}
                className="flex justify-between items-center bg-surface hover:bg-surface-muted p-6 border border-border rounded-2xl transition"
              >
                <div>
                  <p className="mb-2 text-text-secondary text-xs uppercase tracking-wide">
                    Contract
                  </p>
                  <ContractStatusBadge status={data.contractStatus} />
                </div>

                <div className="flex items-center gap-1.5 font-semibold text-primary text-sm">
                  {data.contractStatus === "None" ? "Create Contract" : "Manage Contract"}
                  <ArrowRight size={16} />
                </div>
              </Link>

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
