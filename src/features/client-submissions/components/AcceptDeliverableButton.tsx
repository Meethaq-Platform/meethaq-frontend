"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

import {
  createAcceptDeliverableFormSchema,
  type AcceptDeliverableFormValues,
} from "../schemas/accept-deliverable.schema";
import { useAcceptDeliverable } from "../hooks/useAcceptDeliverable";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface AcceptDeliverableButtonProps {
  projectId: string;
  milestoneId: string;
  submissionId: number;
}

export function AcceptDeliverableButton({
  projectId,
  milestoneId,
  submissionId,
}: AcceptDeliverableButtonProps) {
  const t = useTranslations("clientSubmissions.accept");
  const tActions = useTranslations("common.actions");
  const tValidation = useTranslations("clientSubmissions.validation");
  const acceptDeliverableFormSchema = useMemo(() => createAcceptDeliverableFormSchema(tValidation), [tValidation]);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<AcceptDeliverableFormValues>({
    resolver: zodResolver(acceptDeliverableFormSchema),
    defaultValues: { note: "" },
  });

  const { mutate, isPending, isError, error } = useAcceptDeliverable(projectId, milestoneId);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (values: AcceptDeliverableFormValues) => {
    mutate(
      { submissionId, acceptanceNote: values.note || undefined },
      { onSuccess: handleClose },
    );
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-9"
      >
        <Check size={14} />
        {t("button")}
      </Button>

      <Modal open={open} onClose={handleClose} title={t("title")}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-text-secondary text-sm">
            {t("description")}
          </p>

          <div>
            <Textarea
              label={t("note")}
              rows={3}
              placeholder={t("notePlaceholder")}
              {...register("note")}
            />
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

            <Button type="submit" loading={isPending} loadingText={t("confirming")}>
              {t("confirm")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
