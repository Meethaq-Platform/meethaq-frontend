"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";

import { useProject } from "../hooks/useProject";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { AssignClientControl } from "./AssignClientControl";
import { CancelProjectButton } from "./CancelProjectButton";
import { EditProjectForm } from "./EditProjectForm";
import Button from "@/src/shared/components/Button";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

interface ProjectDetailPageProps {
  projectId: string;
}

export default function ProjectDetailPage({
  projectId,
}: ProjectDetailPageProps) {
  const { data, isLoading, isError, refetch } = useProject(projectId);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
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
        </section>
      )}
    </div>
  );
}
