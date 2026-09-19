"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

import {
  acceptDeliverableFormSchema,
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
        Accept Deliverable
      </Button>

      <Modal open={open} onClose={handleClose} title="Accept this deliverable?">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-text-secondary text-sm">
            Accepting records your approval of the delivered work and makes this
            milestone eligible for payment processing. Acceptance does not itself
            confirm that payment has been made — that happens separately.
          </p>

          <div>
            <Textarea
              label="Acceptance Note (optional)"
              rows={3}
              placeholder="Add any notes for the record..."
              {...register("note")}
            />
          </div>

          {isError && (
            <InputError message={getErrorMessage(error, "Failed to accept deliverable.")} />
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

            <Button type="submit" loading={isPending} loadingText="Accepting...">
              Yes, accept
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
