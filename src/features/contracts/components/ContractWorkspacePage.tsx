"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Pencil } from "lucide-react";

import { useProject } from "@/src/features/projects/hooks/useProject";
import { useContract } from "../hooks/useContract";
import { usePageTitle } from "@/src/shared/hooks/usePageTitle";
import { CONTRACT_STATUS_TO_PROJECT_STATUS } from "../types/contract";
import { ContractStatusBadge } from "./ContractStatusBadge";
import { ContractForm } from "./ContractForm";
import { ContractFeedbackBanner } from "./ContractFeedbackBanner";
import { ContractSummaryCard } from "./ContractSummaryCard";
import { MilestonesSection } from "./MilestonesSection";
import { SubmitContractButton } from "./SubmitContractButton";
import { WithdrawContractButton } from "./WithdrawContractButton";
import { DeleteContractButton } from "./DeleteContractButton";
import Button from "@/src/shared/components/Button";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";
import { formatCurrency, formatDate } from "@/src/shared/lib/format";

interface ContractWorkspacePageProps {
  projectId: string;
}

export default function ContractWorkspacePage({
  projectId,
}: ContractWorkspacePageProps) {
  const project = useProject(projectId);
  const contractQuery = useContract(projectId);
  usePageTitle(project.data ? `Projects/${project.data.title}/Contract` : undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isLoading = project.isLoading || contractQuery.isLoading;
  const isError = project.isError || contractQuery.isError;

  const contract = contractQuery.data;
  const isDraft = contract?.status === 0;
  const isPendingApproval = contract?.status === 1;
  const isChangesRequested = contract?.status === 2;
  const isApproved = contract?.status === 3;
  const canEdit = isDraft || isChangesRequested;
  // The backend only allows deleting a contract that has never been
  // submitted — one that was submitted and later withdrawn keeps a
  // submittedAt and must be discarded via editing instead.
  const canDelete = isDraft && !contract?.submittedAt;

  const backLink = (
    <Link
      href={`/projects/${projectId}`}
      className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
    >
      <ArrowLeft size={16} />
      Back to Project
    </Link>
  );

  if (isLoading) {
    return (
      <div className="space-y-6 mx-auto h-full">
        {backLink}
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      </div>
    );
  }

  if (isError || !project.data) {
    return (
      <div className="space-y-6 mx-auto h-full">
        {backLink}
        <ErrorState
          message="Failed to load this contract."
          onRetry={() => {
            project.refetch();
            contractQuery.refetch();
          }}
        />
      </div>
    );
  }

  const currentProject = project.data;
  const isEligible =
    Boolean(currentProject.clientId) && Boolean(currentProject.totalValue);
  // Derive the badge from the freshly-mutated contract when one exists, so it
  // never lags behind the rest of the page while the invalidated project
  // query is still refetching in the background.
  const displayedContractStatus = contract
    ? CONTRACT_STATUS_TO_PROJECT_STATUS[contract.status]
    : currentProject.contractStatus;

  return (
    <div className="space-y-6 mx-auto h-full">
      <div className="flex justify-between items-center">
        {backLink}

        {contract &&
          (isEditing ? (
            <div className="flex items-center gap-3">
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
                form="contract-edit-form"
                disabled={!isFormDirty}
                loading={isSaving}
                loadingText="Saving..."
                className="h-9"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {canDelete && <DeleteContractButton projectId={projectId} />}
              {isPendingApproval && (
                <WithdrawContractButton projectId={projectId} />
              )}

              {canEdit && (
                <Button
                  type="button"
                  onClick={() => {
                    setIsFormDirty(false);
                    setIsEditing(true);
                  }}
                  variant="amber"
                  className="flex items-center gap-1.5 h-9"
                >
                  <Pencil size={14} />
                  Edit
                </Button>
              )}

              {canEdit && <SubmitContractButton projectId={projectId} />}
            </div>
          ))}
      </div>

      {!contract ? (
        !isEligible ? (
          <EmptyState
            icon={FileText}
            title="Not ready for a contract yet"
            description="Assign a client and set a project value on the project page before creating a contract."
            action={
              <Link href={`/projects/${projectId}`}>
                <Button type="button">Go to Project</Button>
              </Link>
            }
          />
        ) : (
          <div className="bg-surface p-6 border border-border rounded-2xl">
            <h1 className="mb-4 font-semibold text-text-primary text-lg">
              Create Your Contract
            </h1>
            <ContractForm
              projectId={projectId}
              formId="contract-create-form"
              onSuccess={() => {}}
              onPendingChange={setIsSaving}
            />
            <div className="flex justify-end mt-5">
              <Button
                type="submit"
                form="contract-create-form"
                loading={isSaving}
                loadingText="Creating..."
              >
                Create Draft Contract
              </Button>
            </div>
          </div>
        )
      ) : (
        <section className="space-y-6">
          <div className="bg-(--card-bg) p-6 border border-border rounded-2xl">
            {isEditing ? (
              <ContractForm
                projectId={projectId}
                contract={contract}
                formId="contract-edit-form"
                onSuccess={() => setIsEditing(false)}
                onDirtyChange={setIsFormDirty}
                onPendingChange={setIsSaving}
              />
            ) : (
              <div>
                <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
                  <div className="flex-1">
                    <h1 className="font-semibold text-text-primary text-lg">
                      {contract.title}
                    </h1>
                    <p className="mt-2 text-text-primary text-sm whitespace-pre-wrap">
                      {contract.scopeOfWork}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 w-fit shrink-0">
                    <ContractStatusBadge status={displayedContractStatus} />
                    <p className="text-text-secondary text-sm text-end">
                      {formatDate(contract.startDate)} –{" "}
                      {formatDate(contract.expectedEndDate)}
                    </p>
                  </div>
                </div>

                {contract.generalTerms && (
                  <div className="mt-4 pt-4 border-border border-t">
                    <p className="mb-1 text-text-secondary text-xs uppercase tracking-wide">
                      General Terms
                    </p>
                    <p className="text-text-primary text-sm whitespace-pre-wrap">
                      {contract.generalTerms}
                    </p>
                  </div>
                )}

                {isApproved && contract.approvedAt && (
                  <div className="mt-4 pt-4 border-text-primary border-t">
                    <p className="text-primary text-sm">
                      Approved by {currentProject.clientName ?? "the client"} on{" "}
                      {formatDate(contract.approvedAt)} —{" "}
                      {formatCurrency(contract.summary.projectValue)} locked in.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {isChangesRequested && currentProject.contractFeedbackSummary && (
            <ContractFeedbackBanner
              feedback={currentProject.contractFeedbackSummary}
            />
          )}

          {isPendingApproval && (
            <div className="bg-warning-muted p-4 border border-warning/20 rounded-2xl">
              <p className="text-warning text-sm">
                This contract was submitted on{" "}
                {contract.submittedAt ? formatDate(contract.submittedAt) : "—"}{" "}
                and is awaiting your client&apos;s review.
              </p>
            </div>
          )}

          <ContractSummaryCard summary={contract.summary} />

          <MilestonesSection
            projectId={projectId}
            contract={contract}
            editable={canEdit}
          />
        </section>
      )}
    </div>
  );
}
