"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  createCorrectedEvidenceFormSchema,
  type CorrectedEvidenceFormInput,
  type CorrectedEvidenceFormValues,
} from "../schemas/corrected-evidence.schema";
import { useSubmitCorrectedEvidence } from "../hooks/useSubmitCorrectedEvidence";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";
import Input from "@/src/shared/components/Input";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import FileAttachmentInput from "@/src/shared/components/FileAttachmentInput";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface CorrectedEvidenceModalProps {
  projectId: string;
  milestoneId: string;
}

// Client-only action, shown when the Freelancer has reported a payment
// issue — submitting here returns the payment to AwaitingConfirmation. The
// original evidence stays available (backend appends, never overwrites); no
// need to show it here since PaymentDetailCard already lists all versions.
export function CorrectedEvidenceModal({ projectId, milestoneId }: CorrectedEvidenceModalProps) {
  const t = useTranslations("payments.corrected");
  const tActions = useTranslations("common.actions");
  const tValidation = useTranslations("payments.validation");
  const correctedEvidenceFormSchema = useMemo(() => createCorrectedEvidenceFormSchema(tValidation), [tValidation]);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CorrectedEvidenceFormInput, unknown, CorrectedEvidenceFormValues>({
    resolver: zodResolver(correctedEvidenceFormSchema),
    defaultValues: {
      updatedNotes: "",
      updatedTransactionReference: "",
      correctedReceiptFiles: [],
    },
  });

  const correctedReceiptFiles = watch("correctedReceiptFiles") ?? [];
  const { mutate, isPending, isError, error } = useSubmitCorrectedEvidence(
    projectId,
    milestoneId,
  );

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (values: CorrectedEvidenceFormValues) => {
    mutate(
      {
        updatedNotes: values.updatedNotes || undefined,
        updatedTransactionReference: values.updatedTransactionReference || undefined,
        correctedReceiptFiles: values.correctedReceiptFiles,
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="amber"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-9"
      >
        <RefreshCw size={14} />
        {t("button")}
      </Button>

      <Modal open={open} onClose={handleClose} title={t("title")} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label={t("reference")}
              {...register("updatedTransactionReference")}
            />
            <InputError message={errors.updatedTransactionReference?.message} />
          </div>

          <div>
            <Textarea label={t("notes")} rows={3} {...register("updatedNotes")} />
          </div>

          <div>
            <FileAttachmentInput
              files={correctedReceiptFiles}
              onChange={(next) =>
                setValue("correctedReceiptFiles", next, { shouldValidate: true })
              }
              label={t("attach")}
            />
          </div>

          {isError && (
            <InputError
              message={getErrorMessage(error, t("failed"))}
            />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
            >
              {tActions("cancel")}
            </button>

            <Button type="submit" loading={isPending} loadingText={t("submitting")}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
