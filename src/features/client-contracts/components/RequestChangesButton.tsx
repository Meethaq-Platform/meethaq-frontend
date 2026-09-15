"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquareWarning } from "lucide-react";

import {
  changeRequestSchema,
  type ChangeRequestFormValues,
} from "../schemas/change-request.schema";
import { useRequestContractChanges } from "../hooks/useRequestContractChanges";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";

interface RequestChangesButtonProps {
  projectId: string;
  concurrencyToken: string | null;
}

export function RequestChangesButton({
  projectId,
  concurrencyToken,
}: RequestChangesButtonProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeRequestFormValues>({
    resolver: zodResolver(changeRequestSchema),
    defaultValues: { feedback: "" },
  });

  const { mutate, isPending, isError, error } = useRequestContractChanges(projectId);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (values: ChangeRequestFormValues) => {
    if (!concurrencyToken) return;
    mutate(
      { feedback: values.feedback, reviewVersion: concurrencyToken },
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
        Request Changes
      </button>

      <Modal open={open} onClose={handleClose} title="Request changes to this contract">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Textarea
              label="What needs to change?"
              rows={4}
              placeholder="Describe what you'd like the freelancer to update..."
              {...register("feedback")}
            />
            <InputError message={errors.feedback?.message} />
          </div>

          {isError && (
            <InputError
              message={
                error instanceof Error
                  ? error.message
                  : "Failed to request changes."
              }
            />
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
              Send Feedback
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
