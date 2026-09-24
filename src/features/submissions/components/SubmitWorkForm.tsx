"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createSubmissionFormSchema,
  type SubmissionFormInput,
  type SubmissionFormValues,
} from "../schemas/submission.schema";
import { useCreateSubmission } from "../hooks/useCreateSubmission";
import Button from "@/src/shared/components/Button";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import FileAttachmentInput from "@/src/shared/components/FileAttachmentInput";
import LinkInput from "@/src/shared/components/LinkInput";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface SubmitWorkFormProps {
  projectId: string;
  milestoneId: string;
  onSuccess?: () => void;
}

export function SubmitWorkForm({
  projectId,
  milestoneId,
  onSuccess,
}: SubmitWorkFormProps) {
  const t = useTranslations("submissions.form");
  const tValidation = useTranslations("submissions.validation");
  const submissionFormSchema = useMemo(() => createSubmissionFormSchema(tValidation), [tValidation]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubmissionFormInput, unknown, SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: { notes: "", links: [], files: [] },
  });

  const files = watch("files") ?? [];
  const links = watch("links") ?? [];

  const createSubmission = useCreateSubmission(projectId, milestoneId);

  const onSubmit = (values: SubmissionFormValues) => {
    createSubmission.mutate(
      { notes: values.notes, links: values.links, files: values.files },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Textarea
          label={t("notes")}
          rows={4}
          placeholder={t("notesPlaceholder")}
          {...register("notes")}
        />
        <InputError message={errors.notes?.message} />
      </div>

      <div>
        <FileAttachmentInput
          files={files}
          onChange={(next) => setValue("files", next, { shouldValidate: true })}
          label={t("attach")}
        />
      </div>

      <div>
        <LinkInput
          links={links}
          onChange={(next) => setValue("links", next, { shouldValidate: true })}
          errors={links.map((_, index) => errors.links?.[index]?.url?.message)}
        />
        <InputError message={errors.links?.message} />
      </div>

      {createSubmission.isError && (
        <InputError
          message={getErrorMessage(createSubmission.error, t("failed"))}
        />
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          loading={createSubmission.isPending}
          loadingText={t("submitting")}
        >
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
