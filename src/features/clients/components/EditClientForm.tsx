"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUpdateClientSchema,
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
  onDirtyChange?: (isDirty: boolean) => void;
}

export function EditClientForm({
  client,
  onSuccess,
  onDirtyChange,
}: EditClientFormProps) {
  const t = useTranslations("clients.form");
  const tValidation = useTranslations("clients.validation");
  const updateClientSchema = useMemo(() => createUpdateClientSchema(tValidation), [tValidation]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateClientFormValues>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      companyName: client.companyName ?? "",
      notes: client.notes ?? "",
    },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const { mutate, isError, error } = useUpdateClient(
    String(client.relationshipId),
  );

  const onSubmit = (values: UpdateClientFormValues) => {
    if (!isDirty) return;
    mutate(values, { onSuccess });
  };

  return (
    <form
      id="client-edit-form"
      onSubmit={handleSubmit(onSubmit)}
      className="gap-x-6 gap-y-4 grid grid-cols-1 sm:grid-cols-3"
    >
      <div>
        <Input label={t("company")} {...register("companyName")} />
        <InputError message={errors.companyName?.message} />
      </div>

      <div className="sm:col-span-2">
        <Textarea label={t("notes")} rows={3} {...register("notes")} />
        <InputError message={errors.notes?.message} />
      </div>

      {isError && (
        <div className="sm:col-span-3">
          <InputError
            message={
              error instanceof Error
                ? error.message
                : t("updateFailed")
            }
          />
        </div>
      )}
    </form>
  );
}
