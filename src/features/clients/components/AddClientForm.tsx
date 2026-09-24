"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAddClientSchema,
  type AddClientFormValues,
} from "../schemas/client.schema";
import { useCreateClient } from "../hooks/useCreateClient";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import Textarea from "@/src/shared/components/Textarea";
import Button from "@/src/shared/components/Button";

interface AddClientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddClientForm({ onSuccess, onCancel }: AddClientFormProps) {
  const t = useTranslations("clients.form");
  const tActions = useTranslations("common.actions");
  const tValidation = useTranslations("clients.validation");
  const addClientSchema = useMemo(() => createAddClientSchema(tValidation), [tValidation]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddClientFormValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: { email: "", companyName: "", notes: "" },
  });

  const { mutate, isPending, isError, error } = useCreateClient();

  const onSubmit = (values: AddClientFormValues) => {
    mutate(
      {
        email: values.email,
        companyName: values.companyName,
        notes: values.notes,
      },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-text-secondary text-sm">
        {t("lookupHint")}
      </p>

      <div>
        <Input label={t("email")} type="email" {...register("email")} />
        <InputError message={errors.email?.message} />
      </div>

      <div>
        <Input label={t("company")} {...register("companyName")} />
        <InputError message={errors.companyName?.message} />
      </div>

      <div>
        <Textarea label={t("notes")} rows={3} {...register("notes")} />
        <InputError message={errors.notes?.message} />
      </div>

      {isError && (
        <InputError
          message={
            error instanceof Error ? error.message : t("addFailed")
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

        <Button type="submit" loading={isPending} loadingText={t("adding")}>
          {t("add")}
        </Button>
      </div>
    </form>
  );
}
