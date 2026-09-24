"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  decideChangeRequestSchema,
  type DecideChangeRequestFormValues,
} from "../schemas/change-request.schema";
import { useChangeRequest } from "../hooks/useChangeRequest";
import { useDecideChangeRequest } from "../hooks/useDecideChangeRequest";
import { useWithdrawChangeRequest } from "../hooks/useWithdrawChangeRequest";
import { ChangeRequestStatusBadge } from "./ChangeRequestStatusBadge";
import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import Modal from "@/src/shared/components/Modal";
import Button from "@/src/shared/components/Button";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import Spinner from "@/src/shared/components/Spinner";
import AttachmentList from "@/src/shared/components/AttachmentList";
import { formatCurrency, formatDateTime } from "@/src/shared/lib/format";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface ChangeRequestDetailModalProps {
  projectId: string;
  changeRequestId: number | null;
  onClose: () => void;
}

// Requester cannot approve their own request (Module 6 rule) and a pending
// request is read-only for the requester — this modal derives both from
// comparing the current user's id to requestedByUserId, but the real
// enforcement is server-side; this is UI-level guidance only.
export function ChangeRequestDetailModal({
  projectId,
  changeRequestId,
  onClose,
}: ChangeRequestDetailModalProps) {
  const [showReject, setShowReject] = useState(false);
  const { data: user } = useCurrentUser();
  const { data: cr, isLoading } = useChangeRequest(
    projectId,
    changeRequestId ? String(changeRequestId) : "",
  );

  const decide = useDecideChangeRequest(projectId, changeRequestId ? String(changeRequestId) : "");
  const withdraw = useWithdrawChangeRequest(
    projectId,
    changeRequestId ? String(changeRequestId) : "",
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DecideChangeRequestFormValues>({
    resolver: zodResolver(decideChangeRequestSchema),
    defaultValues: { rejectionReason: "" },
  });

  const handleClose = () => {
    setShowReject(false);
    reset();
    onClose();
  };

  if (!changeRequestId) return null;

  const isRequester = cr && user && cr.requestedByUserId === user.id;
  const isPending = cr?.status === 1;
  const canDecide = isPending && !isRequester;
  const canWithdraw = isPending && isRequester;

  const attachments = (cr?.attachments ?? []).map((a) => ({
    id: a.id,
    fileName: a.fileName,
    fileUrl: `/api/projects/${projectId}/files/change-requests/${a.id}`,
    fileSizeBytes: a.fileSizeBytes,
    contentType: "application/octet-stream",
  }));

  const onReject = (values: DecideChangeRequestFormValues) => {
    decide.mutate(
      { approved: false, rejectionReason: values.rejectionReason },
      { onSuccess: handleClose },
    );
  };

  return (
    <Modal
      open={Boolean(changeRequestId)}
      onClose={handleClose}
      title="Change Request"
      size="lg"
    >
      {isLoading || !cr ? (
        <div className="flex justify-center py-8">
          <Spinner size={24} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-3">
            <h3 className="font-semibold text-text-primary text-base">{cr.title}</h3>
            <ChangeRequestStatusBadge status={cr.status} />
          </div>

          <p dir="auto" className="text-text-secondary text-sm whitespace-pre-wrap">{cr.reason}</p>

          {cr.proposedScopeChange && (
            <div>
              <p className="mb-1 text-text-secondary text-xs">Proposed Scope Change</p>
              <p className="text-text-primary text-sm whitespace-pre-wrap">
                {cr.proposedScopeChange}
              </p>
            </div>
          )}

          <div className="gap-3 grid grid-cols-2 bg-surface-muted p-3 rounded-xl text-sm">
            <div>
              <p className="text-text-secondary text-xs">Current Value</p>
              <p className="font-numbers text-text-primary">
                {formatCurrency(cr.currentProjectValue)}
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Resulting Value</p>
              <p className="font-numbers text-text-primary">
                {formatCurrency(cr.resultingProjectValue)}
              </p>
            </div>
          </div>

          {cr.milestoneDeltas.length > 0 && (
            <div>
              <p className="mb-1.5 text-text-secondary text-xs">Proposed Milestone Terms</p>
              <div className="space-y-2">
                {cr.milestoneDeltas.map((delta) => (
                  <div
                    key={delta.id}
                    className="bg-surface-muted p-3 rounded-lg text-sm"
                  >
                    <p className="font-medium text-text-primary">{delta.title}</p>
                    <p className="mt-1 text-text-secondary text-xs">
                      Due {delta.dueDate ? formatDateTime(delta.dueDate) : "—"} ·{" "}
                      {delta.percentage != null
                        ? `${delta.percentage}%`
                        : delta.amount != null
                          ? formatCurrency(delta.amount)
                          : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {attachments.length > 0 && (
            <div>
              <p className="mb-1.5 text-text-secondary text-xs">Attachments</p>
              <AttachmentList attachments={attachments} />
            </div>
          )}

          {cr.status === 3 && cr.rejectionReason && (
            <div className="bg-danger-muted p-3 rounded-lg text-danger text-sm">
              Rejected: {cr.rejectionReason}
            </div>
          )}

          {(decide.isError || withdraw.isError) && (
            <InputError
              message={getErrorMessage(decide.error ?? withdraw.error, "Action failed.")}
            />
          )}

          {canDecide && !showReject && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReject(true)}
                disabled={decide.isPending}
                className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-danger text-sm transition disabled:cursor-not-allowed"
              >
                Reject
              </button>
              <Button
                type="button"
                loading={decide.isPending}
                loadingText="Approving..."
                onClick={() => decide.mutate({ approved: true }, { onSuccess: handleClose })}
              >
                Approve
              </Button>
            </div>
          )}

          {canDecide && showReject && (
            <form onSubmit={handleSubmit(onReject)} className="space-y-3 pt-2">
              <Textarea
                label="Rejection reason"
                rows={3}
                {...register("rejectionReason")}
              />
              <InputError message={errors.rejectionReason?.message} />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReject(false)}
                  disabled={decide.isPending}
                  className="hover:bg-surface-muted px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition"
                >
                  Back
                </button>
                <Button
                  type="submit"
                  variant="amber"
                  loading={decide.isPending}
                  loadingText="Rejecting..."
                >
                  Confirm Reject
                </Button>
              </div>
            </form>
          )}

          {canWithdraw && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => withdraw.mutate(undefined, { onSuccess: handleClose })}
                disabled={withdraw.isPending}
                className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
              >
                {withdraw.isPending ? "Withdrawing..." : "Withdraw Request"}
              </button>
            </div>
          )}

          {isPending && isRequester && (
            <p className="text-text-secondary text-xs">
              This request is pending the other party&apos;s decision and is read-only until then.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
