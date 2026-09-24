"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  createReportPaymentIssueSchema,
  type ReportPaymentIssueFormValues,
} from "../schemas/report-payment-issue.schema";
import { useReportPaymentIssue } from "../hooks/useReportPaymentIssue";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface ReportPaymentIssueModalProps {
  projectId: string;
  milestoneId: string;
}

// Freelancer-only action, shown once a payment is AwaitingConfirmation, as
// the alternative to Confirm Receipt.
export function ReportPaymentIssueModal({ projectId, milestoneId }: ReportPaymentIssueModalProps) {
  const t = useTranslations("payments.report");
  const tActions = useTranslations("common.actions");
  const tValidation = useTranslations("payments.validation");
  const reportPaymentIssueSchema = useMemo(() => createReportPaymentIssueSchema(tValidation), [tValidation]);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportPaymentIssueFormValues>({
    resolver: zodResolver(reportPaymentIssueSchema),
    defaultValues: { reason: "" },
  });

  const { mutate, isPending, isError, error } = useReportPaymentIssue(projectId, milestoneId);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (values: ReportPaymentIssueFormValues) => {
    mutate(values, { onSuccess: handleClose });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 hover:bg-surface-muted px-4 rounded-xl h-9 font-semibold text-danger text-sm transition"
      >
        <AlertTriangle size={14} />
        {t("button")}
      </button>

      <Modal open={open} onClose={handleClose} title={t("title")}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-text-secondary text-sm">
            {t("description")}
          </p>

          <div>
            <Textarea
              label={t("reason")}
              rows={4}
              placeholder={t("reasonPlaceholder")}
              {...register("reason")}
            />
            <InputError message={errors.reason?.message} />
          </div>

          {isError && (
            <InputError message={getErrorMessage(error, t("failed"))} />
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

            <Button type="submit" variant="amber" loading={isPending} loadingText={t("reporting")}>
              {t("button")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
