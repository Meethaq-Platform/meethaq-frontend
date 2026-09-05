"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addClientSchema,
  type AddClientFormValues,
} from "../schemas/client.schema";
import { useCreateClient } from "../hooks/useCreateClient";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import Button from "@/src/shared/components/Button";

interface AddClientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddClientForm({ onSuccess, onCancel }: AddClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddClientFormValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: { fullName: "", email: "", companyName: "" },
  });

  const { mutate, isPending, isError, error } = useCreateClient();

  const onSubmit = (values: AddClientFormValues) => {
    mutate(
      {
        fullName: values.fullName,
        email: values.email,
        companyName: values.companyName,
      },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input label="Full Name" {...register("fullName")} />
        <InputError message={errors.fullName?.message} />
      </div>

      <div>
        <Input label="Email Address" type="email" {...register("email")} />
        <InputError message={errors.email?.message} />
      </div>

      <div>
        <Input label="Company Name" {...register("companyName")} />
        <InputError message={errors.companyName?.message} />
      </div>

      {isError && (
        <InputError
          message={
            error instanceof Error ? error.message : "Failed to add client."
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

        <Button type="submit" loading={isPending} loadingText="Adding...">
          Add Client
        </Button>
      </div>
    </form>
  );
}
