"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ShieldAlert } from "lucide-react";

import type { MilestonePaymentSummaryItem } from "../types/payment";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentDetailCard } from "./PaymentDetailCard";
import { RecordPaymentModal } from "./RecordPaymentModal";
import { CorrectedEvidenceModal } from "./CorrectedEvidenceModal";
import { ConfirmReceiptButton } from "./ConfirmReceiptButton";
import { ReportPaymentIssueModal } from "./ReportPaymentIssueModal";
import { useMilestonePayment } from "../hooks/useMilestonePayment";
import Spinner from "@/src/shared/components/Spinner";
import { formatCurrency } from "@/src/shared/lib/format";

interface PaymentMilestoneRowProps {
  projectId: string;
  item: MilestonePaymentSummaryItem;
  isFreelancer: boolean;
}

// Every status has something worth telling the viewer even when there's no
// action for their role to take (e.g. a client looking at a NotEligible
// milestone, or a freelancer looking at one that's Eligible but not yet
// paid) — returns null only when the row already shows an action button or
// the full PaymentDetailCard for that combination.
function getStatusMessage(status: string, isFreelancer: boolean): string | null {
  switch (status) {
    case "NotEligible":
      return isFreelancer
        ? "This milestone isn't eligible for payment yet — it becomes eligible once the client accepts your delivered work."
        : "This milestone isn't eligible for payment yet — accept the delivered work to make it eligible.";
    case "Eligible":
      return isFreelancer
        ? "This milestone is eligible for payment. Waiting for the client to record payment."
        : null;
    case "AwaitingConfirmation":
      return !isFreelancer
        ? "Payment recorded — waiting for the freelancer to confirm receipt."
        : null;
    case "IssueReported":
      return isFreelancer
        ? "An issue was reported with this payment. Waiting for the client to submit corrected evidence."
        : null;
    default:
      return null;
  }
}

// One row per milestone, sourced entirely from ProjectPaymentSummaryDto's
// milestones[] (no separate milestone-list fetch needed) — the individual
// MilestonePaymentDto (evidence, corrections, confirmedAt) is only fetched
// lazily when the row is expanded, since most milestones won't need it.
export function PaymentMilestoneRow({ projectId, item, isFreelancer }: PaymentMilestoneRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasPaymentRecord = item.paymentStatus !== "NotEligible" && item.paymentStatus !== "Eligible";

  const shouldFetchDetail = expanded && hasPaymentRecord;
  const paymentQuery = useMilestonePayment(
    projectId,
    String(item.milestoneId),
    shouldFetchDetail,
  );

  return (
    <div className="border-border border-b last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 hover:bg-surface-muted p-4 w-full text-left transition"
      >
        <div className="flex flex-1 items-center gap-2 min-w-0">
          {expanded ? (
            <ChevronDown size={16} className="text-text-secondary shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-text-secondary shrink-0" />
          )}

          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary text-sm truncate">
              {item.milestoneTitle}
            </h3>
            <p className="mt-1 font-numbers text-text-secondary text-xs">
              {formatCurrency(item.amount, item.currency)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.isDisputed && (
            <span className="flex items-center gap-1 bg-danger-muted px-2.5 py-1 rounded-full font-medium text-danger text-xs">
              <ShieldAlert size={12} />
              Disputed
            </span>
          )}
          <PaymentStatusBadge status={item.paymentStatus} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {item.isDisputed && (
            <p className="bg-danger-muted mb-3 p-3 rounded-lg text-danger text-xs">
              This milestone has an open dispute — payment confirmation is on hold until it&apos;s
              resolved.
            </p>
          )}

          {!item.isDisputed && getStatusMessage(item.paymentStatus, isFreelancer) && (
            <p className="bg-surface-muted mb-3 p-3 rounded-lg text-text-secondary text-sm">
              {getStatusMessage(item.paymentStatus, isFreelancer)}
            </p>
          )}

          {shouldFetchDetail && paymentQuery.isLoading && (
            <div className="flex justify-center py-6">
              <Spinner size={20} />
            </div>
          )}

          {shouldFetchDetail && paymentQuery.data && (
            <PaymentDetailCard projectId={projectId} payment={paymentQuery.data} />
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {!isFreelancer && item.paymentStatus === "Eligible" && !item.isDisputed && (
              <RecordPaymentModal
                projectId={projectId}
                milestoneId={String(item.milestoneId)}
                defaultAmount={item.amount}
                currency={item.currency}
              />
            )}

            {!isFreelancer && item.paymentStatus === "IssueReported" && (
              <CorrectedEvidenceModal
                projectId={projectId}
                milestoneId={String(item.milestoneId)}
              />
            )}

            {isFreelancer && item.paymentStatus === "AwaitingConfirmation" && !item.isDisputed && (
              <>
                <ConfirmReceiptButton
                  projectId={projectId}
                  milestoneId={String(item.milestoneId)}
                />
                <ReportPaymentIssueModal
                  projectId={projectId}
                  milestoneId={String(item.milestoneId)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
