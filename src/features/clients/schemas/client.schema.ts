import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

type ValidationT = Translator<"clients.validation">;

// Factories, so validation messages follow the active language.
export function createAddClientSchema(t: ValidationT) {
  return z.object({
    email: z.string().email(t("emailInvalid")),
    companyName: z.string().max(100, t("companyTooLong")).optional(),
    notes: z.string().max(500, t("notesTooLong")).optional(),
  });
}

export type AddClientFormValues = z.infer<ReturnType<typeof createAddClientSchema>>;

// PUT /clients/{id} is a full-replacement update, so both fields are always
// sent (an empty string clears the field rather than leaving it unset).
export function createUpdateClientSchema(t: ValidationT) {
  return z.object({
    companyName: z.string().max(100, t("companyTooLong")),
    notes: z.string().max(500, t("notesTooLong")),
  });
}

export type UpdateClientFormValues = z.infer<ReturnType<typeof createUpdateClientSchema>>;
