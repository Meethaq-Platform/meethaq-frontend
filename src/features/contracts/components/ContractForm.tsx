"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createContractFormSchema,
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
  const t = useTranslations("contracts.form");
  const tValidation = useTranslations("contracts.validation");
  const contractFormSchema = useMemo(() => createContractFormSchema(tValidation), [tValidation]);

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
        <Input label={t("title")} {...register("title")} />
        <InputError message={errors.title?.message} />
      </div>

      <div>
        <Textarea
          label={t("scope")}
          rows={4}
          placeholder={t("scopePlaceholder")}
          {...register("scopeOfWork")}
        />
        <InputError message={errors.scopeOfWork?.message} />
      </div>

      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
        <div>
          <Input label={t("startDate")} type="date" {...register("startDate")} />
          <InputError message={errors.startDate?.message} />
        </div>

        <div>
          <Input
            label={t("endDate")}
            type="date"
            {...register("expectedEndDate")}
          />
          <InputError message={errors.expectedEndDate?.message} />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium text-text-primary text-sm">
          {t("allocationMode")}
        </label>
        <select
          {...register("allocationMode", { valueAsNumber: true })}
          disabled={hasMilestones}
          className="bg-surface disabled:opacity-60 px-4 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-11 text-text-primary text-sm transition disabled:cursor-not-allowed"
        >
          <option value={0}>{t("fixed")}</option>
          <option value={1}>{t("percentage")}</option>
        </select>
        {hasMilestones && (
          <p className="mt-1.5 text-text-secondary text-xs">
            {t("allocationLocked")}
          </p>
        )}
      </div>

      <div>
        <Textarea
          label={t("terms")}
          rows={3}
          placeholder={t("termsPlaceholder")}
          {...register("generalTerms")}
        />
        <InputError message={errors.generalTerms?.message} />
      </div>

      {mutation.isError && (
        <InputError
          message={
            mutation.error instanceof Error
              ? mutation.error.message
              : t("saveFailed")
          }
        />
      )}
    </form>
  );
}
