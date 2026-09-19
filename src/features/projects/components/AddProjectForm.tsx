"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProjectSchema,
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
            error instanceof Error ? error.message : "Failed to create project."
          }
        />
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="hover:bg-surface-muted px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition"
        >
          Cancel
        </button>

        <Button type="submit" loading={isPending} loadingText="Creating...">
          Create Project
        </Button>
      </div>
    </form>
  );
}
