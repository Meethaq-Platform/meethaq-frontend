"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import {
  createCreateChangeRequestSchema,
  type CreateChangeRequestFormInput,
  type CreateChangeRequestFormValues,
} from "../schemas/change-request.schema";
import { useCreateChangeRequest } from "../hooks/useCreateChangeRequest";
import { MilestoneDeltaEditor } from "./MilestoneDeltaEditor";
import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { useContract } from "@/src/features/contracts/hooks/useContract";
import { useClientContract } from "@/src/features/client-contracts/hooks/useClientContract";
import type { Milestone } from "@/src/features/contracts/types/contract";
import type { MilestoneDeltaInput } from "../types/change-request";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";
import Input from "@/src/shared/components/Input";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import FileAttachmentInput from "@/src/shared/components/FileAttachmentInput";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface CreateChangeRequestModalProps {
  projectId: string;
}

function toDelta(milestone: Milestone, isPercentage: boolean): MilestoneDeltaInput {
  return {
    milestoneId: milestone.id,
    title: milestone.title,
    description: milestone.description ?? undefined,
    deliverable: milestone.deliverable,
    acceptanceCriteria: milestone.acceptanceCriteria,
    amount: isPercentage ? undefined : milestone.allocationValue,
    percentage: isPercentage ? milestone.allocationValue : undefined,
    dueDate: milestone.dueDate,
  };
}

export function CreateChangeRequestModal({ projectId }: CreateChangeRequestModalProps) {
  const t = useTranslations("changeRequests.create");
  const tActions = useTranslations("common.actions");
  const tValidation = useTranslations("changeRequests.validation");
  const createChangeRequestSchema = useMemo(
    () => createCreateChangeRequestSchema(tValidation),
    [tValidation],
  );
  const [open, setOpen] = useState(false);
  const [deltas, setDeltas] = useState<MilestoneDeltaInput[]>([]);
  const [deltasError, setDeltasError] = useState<string | null>(null);

  const { data: user } = useCurrentUser();
  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";

  const freelancerContract = useContract(projectId);
  const clientContract = useClientContract(projectId);
  const contract = isFreelancer ? freelancerContract.data : clientContract.data;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateChangeRequestFormInput, unknown, CreateChangeRequestFormValues>({
    resolver: zodResolver(createChangeRequestSchema),
    defaultValues: {
      title: "",
      reason: "",
      proposedScopeChange: "",
      resultingProjectValue: contract?.summary.projectValue ?? 0,
      attachments: [],
    },
  });

  const attachments = watch("attachments") ?? [];
  const { mutate, isPending, isError, error } = useCreateChangeRequest(projectId);

  const availableMilestones = (contract?.milestones ?? []).filter(
    (m) => !deltas.some((d) => d.milestoneId === m.id),
  );
  const isPercentage = contract?.allocationMode === 1;

  // In Fixed-amount mode, the resulting project value is just the sum of
  // every milestone's amount — fully derivable, so it's auto-computed and
  // shown read-only rather than left for the user to hand-calculate (and
  // inevitably let drift out of sync as they edit amounts below). In
  // Percentage mode there's nothing to derive it from — percentages are
  // relative to whatever total the requester is proposing — so it stays a
  // genuine, editable input there.
  const unaffectedMilestonesTotal = (contract?.milestones ?? [])
    .filter((m) => !deltas.some((d) => d.milestoneId === m.id))
    .reduce((sum, m) => sum + m.allocationValue, 0);
  const deltasTotal = deltas.reduce((sum, d) => sum + (d.amount ?? 0), 0);
  const computedFixedTotal = unaffectedMilestonesTotal + deltasTotal;

  useEffect(() => {
    if (!isPercentage) {
      setValue("resultingProjectValue", computedFixedTotal, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPercentage, computedFixedTotal]);

  const handleClose = () => {
    reset();
    setDeltas([]);
    setDeltasError(null);
    setOpen(false);
  };

  const addMilestone = (milestoneId: number) => {
    const milestone = contract?.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;
    setDeltas((prev) => [...prev, toDelta(milestone, isPercentage)]);
    setDeltasError(null);
  };

  const onSubmit = (values: CreateChangeRequestFormValues) => {
    if (deltas.length === 0) {
      setDeltasError(t("milestonesRequired"));
      return;
    }

    mutate(
      {
        title: values.title,
        reason: values.reason,
        proposedScopeChange: values.proposedScopeChange,
        resultingProjectValue: values.resultingProjectValue,
        milestoneDeltas: deltas,
        attachments: values.attachments,
      },
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
        <Plus size={14} />
        {t("button")}
      </Button>

      <Modal open={open} onClose={handleClose} title={t("title")} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input label={t("titleLabel")} {...register("title")} />
            <InputError message={errors.title?.message} />
          </div>

          <div>
            <Textarea
              label={t("reason")}
              rows={3}
              placeholder={t("reasonPlaceholder")}
              {...register("reason")}
            />
            <InputError message={errors.reason?.message} />
          </div>

          <div>
            <Textarea
              label={t("scope")}
              rows={3}
              placeholder={t("scopePlaceholder")}
              {...register("proposedScopeChange")}
            />
            <InputError message={errors.proposedScopeChange?.message} />
          </div>

          <div>
            <label className="block mb-2 font-medium text-text-primary text-sm">
              {t("milestones")}
            </label>

            {availableMilestones.length > 0 && (
              <select
                value=""
                onChange={(e) => addMilestone(Number(e.target.value))}
                className="bg-surface mb-3 px-4 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-11 text-text-primary text-sm transition"
              >
                <option value="" disabled>
                  {t("selectMilestone")}
                </option>
                {availableMilestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            )}

            <div className="space-y-3">
              {deltas.map((delta) => {
                const milestone = contract?.milestones.find((m) => m.id === delta.milestoneId);
                return (
                  <MilestoneDeltaEditor
                    key={delta.milestoneId}
                    milestoneTitle={milestone?.title ?? delta.title}
                    allocationMode={contract?.allocationMode ?? 0}
                    value={delta}
                    onChange={(next) =>
                      setDeltas((prev) =>
                        prev.map((d) => (d.milestoneId === next.milestoneId ? next : d)),
                      )
                    }
                    onRemove={() =>
                      setDeltas((prev) =>
                        prev.filter((d) => d.milestoneId !== delta.milestoneId),
                      )
                    }
                  />
                );
              })}
            </div>

            <InputError message={deltasError ?? undefined} />
          </div>

          <div>
            <Input
              type="number"
              step="0.01"
              label={t("resultingValue")}
              disabled={!isPercentage}
              className="disabled:opacity-60 disabled:cursor-not-allowed"
              {...register("resultingProjectValue")}
            />
            <p className="mt-1.5 text-text-secondary text-xs">
              {isPercentage
                ? t("resultingHintPercent")
                : t("resultingHintFixed")}
            </p>
            <InputError message={errors.resultingProjectValue?.message} />
          </div>

          <div>
            <FileAttachmentInput
              files={attachments}
              onChange={(next) => setValue("attachments", next, { shouldValidate: true })}
              label={t("attach")}
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

            <Button type="submit" loading={isPending} loadingText={t("submitting")}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
