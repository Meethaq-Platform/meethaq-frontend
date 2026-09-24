"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Paperclip } from "lucide-react";

import {
  createAddEvidenceSchema,
  type AddEvidenceFormValues,
  createProposeResolutionSchema,
  type ProposeResolutionFormValues,
  createRejectResolutionSchema,
  type RejectResolutionFormValues,
} from "../schemas/dispute.schema";
import { useDispute } from "../hooks/useDispute";
import { useAddEvidence } from "../hooks/useAddEvidence";
import { useProposeResolution } from "../hooks/useProposeResolution";
import { useDecideResolution } from "../hooks/useDecideResolution";
import { useWithdrawDispute } from "../hooks/useWithdrawDispute";
import { getExportUrl } from "../lib/service";
import { DisputeStatusBadge } from "./DisputeStatusBadge";
import { DisputeCategoryBadge } from "./DisputeCategoryBadge";
import { useTranslations } from "next-intl";
import { useStatusLabel } from "@/src/shared/hooks/useStatusLabel";
import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import Modal from "@/src/shared/components/Modal";
import Button from "@/src/shared/components/Button";
import Input from "@/src/shared/components/Input";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import Spinner from "@/src/shared/components/Spinner";
import { useFormat } from "@/src/shared/hooks/useFormat";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface DisputeDetailModalProps {
  projectId: string;
  milestoneId: string | null;
  disputeId: number | null;
  onClose: () => void;
}

export function DisputeDetailModal({
  projectId,
  milestoneId,
  disputeId,
  onClose,
}: DisputeDetailModalProps) {
  const evidenceSourceLabel = useStatusLabel("evidenceSource");
  const tStatus = useTranslations("status");
  const t = useTranslations("disputes.detail");
  const tActions = useTranslations("common.actions");
  const tValidation = useTranslations("disputes.validation");
  const format = useFormat();
  const schemas = useMemo(
    () => ({
      addEvidence: createAddEvidenceSchema(tValidation),
      proposeResolution: createProposeResolutionSchema(tValidation),
      rejectResolution: createRejectResolutionSchema(tValidation),
    }),
    [tValidation],
  );
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [rejectingProposalId, setRejectingProposalId] = useState<number | null>(null);

  const { data: user } = useCurrentUser();
  const isOpen = Boolean(disputeId && milestoneId);
  const { data: dispute, isLoading } = useDispute(
    projectId,
    milestoneId ?? "",
    disputeId ? String(disputeId) : "",
    isOpen,
  );

  const addEvidence = useAddEvidence(projectId, milestoneId ?? "", disputeId ? String(disputeId) : "");
  const proposeResolution = useProposeResolution(
    projectId,
    milestoneId ?? "",
    disputeId ? String(disputeId) : "",
  );
  const decideResolution = useDecideResolution(
    projectId,
    milestoneId ?? "",
    disputeId ? String(disputeId) : "",
  );
  const withdrawDispute = useWithdrawDispute(
    projectId,
    milestoneId ?? "",
    disputeId ? String(disputeId) : "",
  );

  const evidenceForm = useForm<AddEvidenceFormValues>({
    resolver: zodResolver(schemas.addEvidence),
    defaultValues: { description: "", externalUrl: "" },
  });

  const proposeForm = useForm<ProposeResolutionFormValues>({
    resolver: zodResolver(schemas.proposeResolution),
    defaultValues: { proposedResolution: "" },
  });

  const rejectForm = useForm<RejectResolutionFormValues>({
    resolver: zodResolver(schemas.rejectResolution),
    defaultValues: { rejectionReason: "" },
  });

  const handleClose = () => {
    setShowEvidenceForm(false);
    setShowProposeForm(false);
    setRejectingProposalId(null);
    evidenceForm.reset();
    proposeForm.reset();
    rejectForm.reset();
    onClose();
  };

  if (!isOpen) return null;

  const isOpener = dispute && user && dispute.openedByUserId === user.id;
  const isDisputeOpen = dispute?.status === 0;
  const latestProposal = dispute?.resolutionProposals[dispute.resolutionProposals.length - 1];
  const hasPendingProposal = latestProposal?.status === 0;
  const isProposer = latestProposal && user && latestProposal.proposedByUserId === user.id;

  const onAddEvidence = (values: AddEvidenceFormValues) => {
    addEvidence.mutate(
      {
        description: values.description || undefined,
        externalUrl: values.externalUrl || undefined,
        evidenceFile: values.evidenceFile,
      },
      {
        onSuccess: () => {
          evidenceForm.reset();
          setShowEvidenceForm(false);
        },
      },
    );
  };

  const onPropose = (values: ProposeResolutionFormValues) => {
    proposeResolution.mutate(values, {
      onSuccess: () => {
        proposeForm.reset();
        setShowProposeForm(false);
      },
    });
  };

  const onReject = (values: RejectResolutionFormValues) => {
    if (!rejectingProposalId) return;
    decideResolution.mutate(
      { proposalId: rejectingProposalId, accept: false, rejectionReason: values.rejectionReason },
      { onSuccess: () => setRejectingProposalId(null) },
    );
  };

  return (
    <Modal open={isOpen} onClose={handleClose} title={t("title")} size="lg">
      {isLoading || !dispute ? (
        <div className="flex justify-center py-8">
          <Spinner size={24} />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 dir="auto" className="font-semibold text-text-primary text-base wrap-break-word">
                {dispute.milestoneTitle}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <DisputeCategoryBadge category={dispute.category} />
              </div>
            </div>
            <DisputeStatusBadge status={dispute.status} />
          </div>

          <div>
            <p className="mb-1 text-text-secondary text-xs">{t("description")}</p>
            <p dir="auto" className="text-text-primary text-sm whitespace-pre-wrap">
              {dispute.description}
            </p>
          </div>

          <div>
            <p className="mb-1 text-text-secondary text-xs">{t("requestedResolution")}</p>
            <p dir="auto" className="text-text-primary text-sm whitespace-pre-wrap">
              {dispute.requestedResolution}
            </p>
          </div>

          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 bg-surface-muted p-3 rounded-xl text-center text-xs">
            <div>
              <p className="font-numbers font-semibold text-text-primary text-base">
                {dispute.evidencePackage.submissionsCount}
              </p>
              <p className="text-text-secondary">{t("submissions")}</p>
            </div>
            <div>
              <p className="font-numbers font-semibold text-text-primary text-base">
                {dispute.evidencePackage.feedbackReviewsCount}
              </p>
              <p className="text-text-secondary">{t("feedback")}</p>
            </div>
            <div>
              <p className="font-numbers font-semibold text-text-primary text-base">
                {dispute.evidencePackage.chatMessagesCount}
              </p>
              <p className="text-text-secondary">{t("messages")}</p>
            </div>
            <div>
              <p className="font-numbers font-semibold text-text-primary text-base">
                {dispute.evidencePackage.paymentRecordsCount}
              </p>
              <p className="text-text-secondary">{t("payments")}</p>
            </div>
          </div>

          <a
            href={getExportUrl(projectId, milestoneId!, String(disputeId))}
            download
            className="flex items-center gap-1.5 font-semibold text-primary text-sm"
          >
            <Download size={14} />
            {t("export")}
          </a>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-text-primary text-sm">{t("evidence")}</p>
              {isDisputeOpen && (
                <button
                  type="button"
                  onClick={() => setShowEvidenceForm((prev) => !prev)}
                  className="flex items-center gap-1 font-semibold text-primary text-xs"
                >
                  <Paperclip size={12} />
                  {t("addEvidence")}
                </button>
              )}
            </div>

            {showEvidenceForm && (
              <form
                onSubmit={evidenceForm.handleSubmit(onAddEvidence)}
                className="space-y-2 bg-surface-muted mb-3 p-3 rounded-xl"
              >
                <Input label={t("link")} dir="ltr" {...evidenceForm.register("externalUrl")} />
                <Textarea
                  label={t("evidenceDescription")}
                  rows={2}
                  {...evidenceForm.register("description")}
                />
                <input
                  type="file"
                  onChange={(e) =>
                    evidenceForm.setValue("evidenceFile", e.target.files?.[0], {
                      shouldValidate: true,
                    })
                  }
                  className="w-full max-w-full text-text-secondary text-xs"
                />
                <InputError message={evidenceForm.formState.errors.externalUrl?.message} />
                {addEvidence.isError && (
                  <InputError
                    message={getErrorMessage(addEvidence.error, t("evidenceFailed"))}
                  />
                )}
                <div className="flex justify-end gap-2">
                  <Button type="submit" loading={addEvidence.isPending} className="h-9">
                    {t("add")}
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-1.5">
              {dispute.evidencePackage.userEvidenceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center gap-3 bg-surface-muted px-3 py-2 rounded-lg text-sm"
                >
                  <div className="min-w-0">
                    <p dir="auto" className="text-text-primary truncate">
                      {item.description || item.fileName || item.externalUrl || t("evidenceFallback")}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {evidenceSourceLabel(item.sourceType, tStatus("evidenceSourceUnknown"))} ·{" "}
                      {format.dateTime(item.addedAt)}
                    </p>
                  </div>
                  {item.downloadUrl && (
                    <a
                      href={`/api/projects/${projectId}/files/disputes/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs shrink-0"
                    >
                      {t("view")}
                    </a>
                  )}
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs shrink-0"
                    >
                      {t("openLink")}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-semibold text-text-primary text-sm">{t("resolution")}</p>

            {dispute.resolutionProposals.length === 0 && (
              <p className="text-text-secondary text-sm">{t("noProposals")}</p>
            )}

            <div className="space-y-2">
              {dispute.resolutionProposals.map((proposal) => (
                <div key={proposal.proposalId} className="bg-surface-muted p-3 rounded-lg text-sm">
                  <p dir="auto" className="text-text-primary whitespace-pre-wrap">
                    {proposal.proposedResolution}
                  </p>
                  <p className="mt-1 text-text-secondary text-xs">
                    {proposal.status === 2 && proposal.rejectionReason
                      ? t.rich("proposedRejected", {
                          date: format.dateTime(proposal.proposedAt),
                          reason: proposal.rejectionReason,
                          bdi: (chunks) => <bdi>{chunks}</bdi>,
                        })
                      : t("proposed", { date: format.dateTime(proposal.proposedAt) })}
                  </p>
                </div>
              ))}
            </div>

            {rejectingProposalId && (
              <form
                onSubmit={rejectForm.handleSubmit(onReject)}
                className="space-y-2 bg-surface-muted mt-2 p-3 rounded-xl"
              >
                <Textarea
                  label={t("rejectionReason")}
                  rows={2}
                  {...rejectForm.register("rejectionReason")}
                />
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectingProposalId(null)}
                    className="px-3 h-9 text-text-secondary text-sm"
                  >
                    {t("back")}
                  </button>
                  <Button type="submit" variant="amber" loading={decideResolution.isPending} className="h-9">
                    {t("confirmReject")}
                  </Button>
                </div>
              </form>
            )}

            {decideResolution.isError && (
              <InputError message={getErrorMessage(decideResolution.error, t("failed"))} />
            )}

            <div className="flex flex-wrap justify-end gap-2 mt-3">
              {isDisputeOpen && !hasPendingProposal && !showProposeForm && (
                <button
                  type="button"
                  onClick={() => setShowProposeForm(true)}
                  className="hover:bg-surface-muted px-4 rounded-xl h-9 font-semibold text-primary text-sm transition"
                >
                  {t("propose")}
                </button>
              )}

              {isDisputeOpen && isOpener && (
                <button
                  type="button"
                  onClick={() => withdrawDispute.mutate(undefined, { onSuccess: handleClose })}
                  disabled={withdrawDispute.isPending}
                  className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-9 font-semibold text-text-secondary text-sm transition"
                >
                  {t("withdraw")}
                </button>
              )}

              {hasPendingProposal && !isProposer && !rejectingProposalId && (
                <>
                  <button
                    type="button"
                    onClick={() => setRejectingProposalId(latestProposal!.proposalId)}
                    className="hover:bg-surface-muted px-4 rounded-xl h-9 font-semibold text-danger text-sm transition"
                  >
                    {t("reject")}
                  </button>
                  <Button
                    type="button"
                    loading={decideResolution.isPending}
                    className="h-9"
                    onClick={() =>
                      decideResolution.mutate(
                        {
                          proposalId: latestProposal!.proposalId,
                          accept: true,
                        },
                        { onSuccess: handleClose },
                      )
                    }
                  >
                    {t("accept")}
                  </Button>
                </>
              )}
            </div>

            {showProposeForm && (
              <form
                onSubmit={proposeForm.handleSubmit(onPropose)}
                className="space-y-2 bg-surface-muted mt-3 p-3 rounded-xl"
              >
                <Textarea
                  label={t("proposalLabel")}
                  rows={3}
                  {...proposeForm.register("proposedResolution")}
                />
                <InputError
                  message={proposeForm.formState.errors.proposedResolution?.message}
                />
                {proposeResolution.isError && (
                  <InputError
                    message={getErrorMessage(proposeResolution.error, t("proposeFailed"))}
                  />
                )}
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProposeForm(false)}
                    className="px-3 h-9 text-text-secondary text-sm"
                  >
                    {tActions("cancel")}
                  </button>
                  <Button type="submit" loading={proposeResolution.isPending} className="h-9">
                    {t("submitProposal")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
