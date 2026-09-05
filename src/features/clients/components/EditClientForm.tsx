"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateClientSchema,
  type UpdateClientFormValues,
} from "../schemas/client.schema";
import { useUpdateClient } from "../hooks/useUpdateClient";
import type { Client } from "../types/client";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import Textarea from "@/src/shared/components/Textarea";

interface EditClientFormProps {
  client: Client;
  onSuccess: () => void;
}

export function EditClientForm({ client, onSuccess }: EditClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateClientFormValues>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      companyName: client.companyName ?? "",
      notes: client.notes ?? "",
    },
  });

  const { mutate, isError, error } = useUpdateClient(
    String(client.relationshipId),
  );

  const onSubmit = (values: UpdateClientFormValues) => {
    mutate(values, { onSuccess });
  };

  return (
    <form
      id="client-edit-form"
      onSubmit={handleSubmit(onSubmit)}
      className="gap-x-6 gap-y-4 grid grid-cols-1 sm:grid-cols-3"
    >
      <div>
        <Input label="Company Name" {...register("companyName")} />
        <InputError message={errors.companyName?.message} />
      </div>

      <div className="sm:col-span-2">
        <Textarea label="Notes" rows={3} {...register("notes")} />
        <InputError message={errors.notes?.message} />
      </div>

      {isError && (
        <div className="sm:col-span-3">
          <InputError
            message={
              error instanceof Error
                ? error.message
                : "Failed to update client."
            }
          />
        </div>
      )}
    </form>
  );
}
