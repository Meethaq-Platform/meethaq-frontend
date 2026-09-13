"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateProjectSchema,
  type UpdateProjectFormInput,
  type UpdateProjectFormValues,
} from "../schemas/project.schema";
import { useUpdateProject } from "../hooks/useUpdateProject";
import type { Project } from "../types/project";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import Textarea from "@/src/shared/components/Textarea";

interface EditProjectFormProps {
  project: Project;
  onSuccess: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function EditProjectForm({
  project,
  onSuccess,
  onDirtyChange,
}: EditProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProjectFormInput, unknown, UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description ?? "",
      totalValue: project.totalValue ?? "",
    },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const { mutate, isError, error } = useUpdateProject(String(project.id));

  const onSubmit = (values: UpdateProjectFormValues) => {
    if (!isDirty) return;
    mutate(
      {
        ...values,
        totalValue: values.totalValue === "" ? null : values.totalValue,
      },
      { onSuccess },
    );
  };

  return (
    <form
      id="project-edit-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <Input label="Title" {...register("title")} />
        <InputError message={errors.title?.message} />
      </div>

      <div>
        <Textarea label="Description" rows={3} {...register("description")} />
        <InputError message={errors.description?.message} />
      </div>

      <div>
        <Input
          label="Project Value ($)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="e.g. 5000"
          {...register("totalValue")}
        />
        <InputError message={errors.totalValue?.message} />
      </div>

      {isError && (
        <InputError
          message={
            error instanceof Error ? error.message : "Failed to update project."
          }
        />
      )}
    </form>
  );
}
