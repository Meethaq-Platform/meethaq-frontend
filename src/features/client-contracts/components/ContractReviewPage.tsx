"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/src/shared/hooks/useFormat";

import { useClientProject } from "@/src/features/client-projects/hooks/useClientProject";
import { useClientContract } from "../hooks/useClientContract";
import { usePageTitle } from "@/src/shared/hooks/usePageTitle";
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
import { formatCurrency } from "@/src/shared/lib/format";

interface ContractReviewPageProps {
  projectId: string;
}

export default function ContractReviewPage({ projectId }: ContractReviewPageProps) {
  const t = useTranslations("clientContracts.review");
  const tContracts = useTranslations("contracts.workspace");
  const format = useFormat();
  const project = useClientProject(projectId);
  const contractQuery = useClientContract(projectId);
  usePageTitle(project.data ? `Projects/${project.data.title}/Contract` : undefined);

  const isLoading = project.isLoading || contractQuery.isLoading;
  const isError = project.isError || contractQuery.isError;

  const backLink = (
    <Link
      href={`/projects/${projectId}`}
      className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
    >
      <ArrowLeft size={16} className="rtl-flip" />
      {tContracts("back")}
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
          message={t("loadFailed")}
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
          title={t("emptyTitle")}
          description={
            currentProject.contractStatus === "Draft"
              ? t("preparing")
              : t("notSubmitted")
          }
        />
      ) : (
        <section className="space-y-6">
          <div className="bg-surface p-6 border border-border rounded-2xl">
            <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
              <div className="flex-1">
                <h1 dir="auto" className="font-semibold text-text-primary text-lg">
                  {contract.title}
                </h1>
                <p dir="auto" className="mt-2 text-text-primary text-sm whitespace-pre-wrap">
                  {contract.scopeOfWork}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 w-fit shrink-0">
                <ContractStatusBadge status={displayedContractStatus} />
                <p className="text-text-secondary text-sm text-end">
                  {format.date(contract.startDate)} –{" "}
                  {format.date(contract.expectedEndDate)}
                </p>
              </div>
            </div>

            {contract.generalTerms && (
              <div className="mt-4 pt-4 border-border border-t">
                <p className="mb-1 text-text-secondary text-xs uppercase tracking-wide">
                  {tContracts("generalTerms")}
                </p>
                <p dir="auto" className="text-text-primary text-sm whitespace-pre-wrap">
                  {contract.generalTerms}
                </p>
              </div>
            )}

            {isApproved && contract.approvedAt && (
              <div className="mt-4 pt-4 border-border border-t">
                <p className="text-success text-sm">
                  {t.rich("approvedOn", {
                    date: format.date(contract.approvedAt),
                    amount: formatCurrency(contract.summary.projectValue),
                    bdi: (chunks) => <bdi>{chunks}</bdi>,
                  })}
                </p>
              </div>
            )}
          </div>

          {isChangesRequested && (
            <div className="bg-warning-muted p-4 border border-warning/20 rounded-2xl">
              <p className="text-warning text-sm">
                {t("changesRequested")}
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
