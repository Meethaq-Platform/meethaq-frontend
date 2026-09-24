"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";

import {
  openDisputeSchema,
  type OpenDisputeFormInput,
  type OpenDisputeFormValues,
} from "../schemas/dispute.schema";
import { useOpenDispute } from "../hooks/useOpenDispute";
import { DISPUTE_CATEGORIES } from "../types/dispute";
import { useStatusLabel } from "@/src/shared/hooks/useStatusLabel";
import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { useContract } from "@/src/features/contracts/hooks/useContract";
import { useClientContract } from "@/src/features/client-contracts/hooks/useClientContract";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import FileAttachmentInput from "@/src/shared/components/FileAttachmentInput";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface OpenDisputeModalProps {
  projectId: string;
  // When provided (opened from a milestone's own page), the picker is
  // pre-selected and locked instead of shown.
  milestoneId?: string;
}

export function OpenDisputeModal({ projectId, milestoneId: fixedMilestoneId }: OpenDisputeModalProps) {
  const categoryLabel = useStatusLabel("disputeCategory");
  const [open, setOpen] = useState(false);
  const [milestoneId, setMilestoneId] = useState(fixedMilestoneId ?? "");

  const { data: user } = useCurrentUser();
  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";
  const freelancerContract = useContract(projectId);
  const clientContract = useClientContract(projectId);
  const milestones = (isFreelancer ? freelancerContract.data : clientContract.data)?.milestones ?? [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OpenDisputeFormInput, unknown, OpenDisputeFormValues>({
    resolver: zodResolver(openDisputeSchema),
    defaultValues: {
      category: 0,
      description: "",
      requestedResolution: "",
      evidenceFiles: [],
    },
  });

  const evidenceFiles = watch("evidenceFiles") ?? [];
  const { mutate, isPending, isError, error } = useOpenDispute(projectId, milestoneId);

  const handleClose = () => {
    reset();
    if (!fixedMilestoneId) setMilestoneId("");
    setOpen(false);
  };

  const onSubmit = (values: OpenDisputeFormValues) => {
    if (!milestoneId) return;
    mutate(
      {
        category: values.category,
        description: values.description,
        requestedResolution: values.requestedResolution,
        evidenceFiles: values.evidenceFiles,
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="danger"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-9"
      >
        <ShieldAlert size={14} />
        Open Dispute
      </Button>

      <Modal open={open} onClose={handleClose} title="Open a dispute" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!fixedMilestoneId && (
            <div>
              <label className="block mb-2 font-medium text-text-primary text-sm">
                Milestone
              </label>
              <select
                value={milestoneId}
                onChange={(e) => setMilestoneId(e.target.value)}
                className="bg-surface px-4 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-11 text-text-primary text-sm transition"
              >
                <option value="" disabled>
                  Select the affected milestone...
                </option>
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
              {!milestoneId && (
                <p className="mt-1 text-text-secondary text-xs">
                  Choose which milestone this dispute concerns.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium text-text-primary text-sm">Category</label>
            <select
              {...register("category", { valueAsNumber: true })}
              className="bg-surface px-4 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-11 text-text-primary text-sm transition"
            >
              {DISPUTE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {categoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Textarea
              label="Description"
              rows={4}
              placeholder="What went wrong?"
              {...register("description")}
            />
            <InputError message={errors.description?.message} />
          </div>

          <div>
            <Textarea
              label="Requested Resolution"
              rows={3}
              placeholder="What outcome are you asking for?"
              {...register("requestedResolution")}
            />
            <InputError message={errors.requestedResolution?.message} />
          </div>

          <div>
            <FileAttachmentInput
              files={evidenceFiles}
              onChange={(next) => setValue("evidenceFiles", next, { shouldValidate: true })}
              label="Attach Evidence"
            />
          </div>

          {isError && (
            <InputError message={getErrorMessage(error, "Failed to open dispute.")} />
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

            <Button
              type="submit"
              variant="danger"
              disabled={!milestoneId}
              loading={isPending}
              loadingText="Opening..."
            >
              Open Dispute
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
