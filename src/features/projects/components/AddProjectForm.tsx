"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCreateProjectSchema,
  type CreateProjectFormInput,
  type CreateProjectFormValues,
} from "../schemas/project.schema";
import { useCreateProject } from "../hooks/useCreateProject";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import Textarea from "@/src/shared/components/Textarea";
import Button from "@/src/shared/components/Button";

interface AddProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddProjectForm({ onSuccess, onCancel }: AddProjectFormProps) {
  const t = useTranslations("projects.form");
  const tActions = useTranslations("common.actions");
  const tValidation = useTranslations("projects.validation");
  const createProjectSchema = useMemo(() => createCreateProjectSchema(tValidation), [tValidation]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormInput, unknown, CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { title: "", description: "", totalValue: "" },
  });

  const { mutate, isPending, isError, error } = useCreateProject();

  const onSubmit = (values: CreateProjectFormValues) => {
    mutate(
      {
        title: values.title,
        description: values.description,
        totalValue: values.totalValue === "" ? undefined : values.totalValue,
      },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input label={t("title")} {...register("title")} />
        <InputError message={errors.title?.message} />
      </div>

      <div>
        <Textarea label={t("description")} rows={3} {...register("description")} />
        <InputError message={errors.description?.message} />
      </div>

      <div>
        <Input
          label={t("value")}
          type="number"
          step="0.01"
          min="0.01"
          placeholder={t("valuePlaceholder")}
          {...register("totalValue")}
        />
        <InputError message={errors.totalValue?.message} />
      </div>

      {isError && (
        <InputError
          message={
            error instanceof Error ? error.message : t("createFailed")
          }
        />
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="hover:bg-surface-muted px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition"
        >
          {tActions("cancel")}
        </button>

        <Button type="submit" loading={isPending} loadingText={t("creating")}>
          {t("create")}
        </Button>
      </div>
    </form>
  );
}
