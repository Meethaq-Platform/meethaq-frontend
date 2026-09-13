"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  contractFormSchema,
  type ContractFormValues,
} from "../schemas/contract.schema";
import { useCreateContract } from "../hooks/useCreateContract";
import { useUpdateContract } from "../hooks/useUpdateContract";
import type { Contract } from "../types/contract";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import Textarea from "@/src/shared/components/Textarea";

interface ContractFormProps {
  projectId: string;
  contract?: Contract;
  formId: string;
  onSuccess: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
  onPendingChange?: (isPending: boolean) => void;
}

function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

export function ContractForm({
  projectId,
  contract,
  formId,
  onSuccess,
  onDirtyChange,
  onPendingChange,
}: ContractFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: contract
      ? {
          title: contract.title,
          scopeOfWork: contract.scopeOfWork,
          startDate: toDateInputValue(contract.startDate),
          expectedEndDate: toDateInputValue(contract.expectedEndDate),
          generalTerms: contract.generalTerms ?? "",
          allocationMode: contract.allocationMode,
        }
      : {
          title: "",
          scopeOfWork: "",
          startDate: "",
          expectedEndDate: "",
          generalTerms: "",
          allocationMode: 0,
        },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const createContract = useCreateContract(projectId);
  const updateContract = useUpdateContract(projectId);
  const mutation = contract ? updateContract : createContract;
  const hasMilestones = (contract?.milestones.length ?? 0) > 0;

  useEffect(() => {
    onPendingChange?.(mutation.isPending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isPending]);

  const onSubmit = (values: ContractFormValues) => {
    const payload = {
      title: values.title,
      scopeOfWork: values.scopeOfWork,
      startDate: new Date(`${values.startDate}T00:00:00.000Z`).toISOString(),
      expectedEndDate: new Date(
        `${values.expectedEndDate}T00:00:00.000Z`,
      ).toISOString(),
      generalTerms: values.generalTerms || undefined,
      allocationMode: values.allocationMode,
    };

    mutation.mutate(payload, { onSuccess });
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input label="Contract Title" {...register("title")} />
        <InputError message={errors.title?.message} />
      </div>

      <div>
        <Textarea
          label="Scope of Work"
          rows={4}
          placeholder="Describe the work to be delivered under this contract..."
          {...register("scopeOfWork")}
        />
        <InputError message={errors.scopeOfWork?.message} />
      </div>

      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
        <div>
          <Input label="Start Date" type="date" {...register("startDate")} />
          <InputError message={errors.startDate?.message} />
        </div>

        <div>
          <Input
            label="Expected End Date"
            type="date"
            {...register("expectedEndDate")}
          />
          <InputError message={errors.expectedEndDate?.message} />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium text-text-primary text-sm">
          Milestone Allocation Mode
        </label>
        <select
          {...register("allocationMode", { valueAsNumber: true })}
          disabled={hasMilestones}
          className="bg-surface disabled:opacity-60 px-4 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-11 text-text-primary text-sm transition disabled:cursor-not-allowed"
        >
          <option value={0}>Fixed amount ($ per milestone)</option>
          <option value={1}>Percentage (% of project value)</option>
        </select>
        {hasMilestones && (
          <p className="mt-1.5 text-text-secondary text-xs">
            Allocation mode can&apos;t change once milestones exist.
          </p>
        )}
      </div>

      <div>
        <Textarea
          label="General Terms (optional)"
          rows={3}
          placeholder="Payment terms, ownership, termination clauses..."
          {...register("generalTerms")}
        />
        <InputError message={errors.generalTerms?.message} />
      </div>

      {mutation.isError && (
        <InputError
          message={
            mutation.error instanceof Error
              ? mutation.error.message
              : "Failed to save contract."
          }
        />
      )}
    </form>
  );
}
