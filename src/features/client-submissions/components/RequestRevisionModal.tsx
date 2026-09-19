"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquareWarning } from "lucide-react";

import {
  requestRevisionFormSchema,
  type RequestRevisionFormInput,
  type RequestRevisionFormValues,
} from "../schemas/request-revision.schema";
import { useRequestRevision } from "../hooks/useRequestRevision";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import FileAttachmentInput from "@/src/shared/components/FileAttachmentInput";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface RequestRevisionModalProps {
  projectId: string;
  milestoneId: string;
  submissionId: number;
}

export function RequestRevisionModal({
  projectId,
  milestoneId,
  submissionId,
}: RequestRevisionModalProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RequestRevisionFormInput, unknown, RequestRevisionFormValues>({
    resolver: zodResolver(requestRevisionFormSchema),
    defaultValues: { reason: "", requiredChanges: "", files: [] },
  });

  const files = watch("files") ?? [];

  const { mutate, isPending, isError, error } = useRequestRevision(projectId, milestoneId);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (values: RequestRevisionFormValues) => {
    mutate(
      {
        submissionId,
        reason: values.reason,
        requiredChanges: values.requiredChanges,
        files: values.files,
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 hover:bg-surface-muted px-4 rounded-xl h-9 font-semibold text-text-secondary text-sm transition"
      >
        <MessageSquareWarning size={14} />
        Request Revision
      </button>

      <Modal open={open} onClose={handleClose} title="Request a revision">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-text-secondary text-xs">
            Revision requests address work within the approved scope and acceptance
            criteria. If you need to change scope, price, or the agreed deadline, use
            a Change Request instead — this won&apos;t alter the contract.
          </p>

          <div>
            <Textarea
              label="What's wrong with this submission?"
              rows={3}
              placeholder="Explain the issue..."
              {...register("reason")}
            />
            <InputError message={errors.reason?.message} />
          </div>

          <div>
            <Textarea
              label="Required Changes"
              rows={3}
              placeholder="Describe exactly what needs to change..."
              {...register("requiredChanges")}
            />
            <InputError message={errors.requiredChanges?.message} />
          </div>

          <FileAttachmentInput
            files={files}
            onChange={(next) => setValue("files", next, { shouldValidate: true })}
            label="Attach Supporting Files (optional)"
          />

          {isError && (
            <InputError message={getErrorMessage(error, "Failed to request revision.")} />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <Button type="submit" loading={isPending} loadingText="Sending...">
              Send Revision Request
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
