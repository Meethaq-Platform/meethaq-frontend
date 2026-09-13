"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { useClientProject } from "@/src/features/client-projects/hooks/useClientProject";
import { useClientContract } from "../hooks/useClientContract";
import { ApproveContractButton } from "./ApproveContractButton";
import { RequestChangesButton } from "./RequestChangesButton";
import { ContractFeedbackHistory } from "./ContractFeedbackHistory";
import { CONTRACT_STATUS_TO_PROJECT_STATUS } from "@/src/features/contracts/types/contract";
import { ContractStatusBadge } from "@/src/features/contracts/components/ContractStatusBadge";
import { ContractSummaryCard } from "@/src/features/contracts/components/ContractSummaryCard";
import { MilestonesSection } from "@/src/features/contracts/components/MilestonesSection";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";
import { formatCurrency, formatDate } from "@/src/shared/lib/format";

interface ContractReviewPageProps {
  projectId: string;
}

export default function ContractReviewPage({ projectId }: ContractReviewPageProps) {
  const project = useClientProject(projectId);
  const contractQuery = useClientContract(projectId);

  const isLoading = project.isLoading || contractQuery.isLoading;
  const isError = project.isError || contractQuery.isError;

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
  const contract = contractQuery.data;
  const isPendingApproval = contract?.status === 1;
  const isChangesRequested = contract?.status === 2;
  const isApproved = contract?.status === 3;
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

        {contract && isPendingApproval && (
          <div className="flex items-center gap-3">
            <RequestChangesButton
              projectId={projectId}
              concurrencyToken={contract.concurrencyToken}
            />
            <ApproveContractButton
              projectId={projectId}
              concurrencyToken={contract.concurrencyToken}
            />
          </div>
        )}
      </div>

      {!contract ? (
        <EmptyState
          icon={FileText}
          title="No contract to review yet"
          description={
            currentProject.contractStatus === "Draft"
              ? "Your freelancer is still preparing the contract for this project."
              : "Your freelancer hasn't submitted a contract for this project yet."
          }
        />
      ) : (
        <section className="space-y-6">
          <div className="bg-surface p-6 border border-border rounded-2xl">
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
                <p className="text-text-secondary text-sm text-right">
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
              <div className="mt-4 pt-4 border-border border-t">
                <p className="text-success text-sm">
                  You approved this contract on {formatDate(contract.approvedAt)} —{" "}
                  {formatCurrency(contract.summary.projectValue)} locked in.
                </p>
              </div>
            )}
          </div>

          {isChangesRequested && (
            <div className="bg-warning-muted p-4 border border-warning/20 rounded-2xl">
              <p className="text-warning text-sm">
                You requested changes on this contract. Your freelancer is revising
                it and will resubmit for your review.
              </p>
            </div>
          )}

          <ContractSummaryCard summary={contract.summary} />

          <MilestonesSection
            projectId={projectId}
            contract={contract}
            editable={false}
          />

          <ContractFeedbackHistory projectId={projectId} />
        </section>
      )}
    </div>
  );
}
