"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  milestoneFormSchema,
  type MilestoneFormInput,
  type MilestoneFormValues,
} from "../schemas/milestone.schema";
import { useCreateMilestone } from "../hooks/useCreateMilestone";
import { useUpdateMilestone } from "../hooks/useUpdateMilestone";
import type { ContractAllocationMode, Milestone } from "../types/contract";
import Modal from "@/src/shared/components/Modal";
import Button from "@/src/shared/components/Button";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import Textarea from "@/src/shared/components/Textarea";

interface MilestoneFormModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  allocationMode: ContractAllocationMode;
  milestone?: Milestone;
}

function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

export function MilestoneFormModal({
  open,
  onClose,
  projectId,
  allocationMode,
  milestone,
}: MilestoneFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MilestoneFormInput, unknown, MilestoneFormValues>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: milestone
      ? {
          title: milestone.title,
          description: milestone.description ?? "",
          deliverable: milestone.deliverable,
          acceptanceCriteria: milestone.acceptanceCriteria,
          dueDate: toDateInputValue(milestone.dueDate),
          allocationValue: milestone.allocationValue,
        }
      : {
          title: "",
          description: "",
          deliverable: "",
          acceptanceCriteria: "",
          dueDate: "",
          allocationValue: 0,
        },
  });

  const createMilestone = useCreateMilestone(projectId);
  const updateMilestone = useUpdateMilestone(projectId);
  const mutation = milestone ? updateMilestone : createMilestone;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: MilestoneFormValues) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      deliverable: values.deliverable,
      acceptanceCriteria: values.acceptanceCriteria,
      dueDate: new Date(`${values.dueDate}T00:00:00.000Z`).toISOString(),
      allocationValue: values.allocationValue,
    };

    if (milestone) {
      updateMilestone.mutate(
        { milestoneId: milestone.id, data: payload },
        { onSuccess: handleClose },
      );
    } else {
      createMilestone.mutate(payload, { onSuccess: handleClose });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={milestone ? "Edit Milestone" : "Add Milestone"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input label="Title" {...register("title")} />
          <InputError message={errors.title?.message} />
        </div>

        <div>
          <Textarea
            label="Description (optional)"
            rows={2}
            {...register("description")}
          />
          <InputError message={errors.description?.message} />
        </div>

        <div>
          <Textarea label="Deliverable" rows={2} {...register("deliverable")} />
          <InputError message={errors.deliverable?.message} />
        </div>

        <div>
          <Textarea
            label="Acceptance Criteria"
            rows={2}
            {...register("acceptanceCriteria")}
          />
          <InputError message={errors.acceptanceCriteria?.message} />
        </div>

        <div className="gap-4 grid grid-cols-2">
          <div>
            <Input label="Due Date" type="date" {...register("dueDate")} />
            <InputError message={errors.dueDate?.message} />
          </div>

          <div>
            <Input
              label={allocationMode === 1 ? "Allocation (%)" : "Allocation ($)"}
              type="number"
              step="0.01"
              min="0.01"
              {...register("allocationValue")}
            />
            <InputError message={errors.allocationValue?.message} />
          </div>
        </div>

        {mutation.isError && (
          <InputError
            message={
              mutation.error instanceof Error
                ? mutation.error.message
                : "Failed to save milestone."
            }
          />
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={mutation.isPending}
            className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <Button type="submit" loading={mutation.isPending} loadingText="Saving...">
            {milestone ? "Save Changes" : "Add Milestone"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
