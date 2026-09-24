import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

type ValidationT = Translator<"projects.validation">;

function totalValueField(t: ValidationT) {
  return z
    .union([
      z.literal(""),
      z.coerce
        .number({ message: t("amountInvalid") })
        .min(0.01, t("amountPositive"))
        .max(1000000000, t("amountTooLarge")),
    ])
    .optional();
}

function titleField(t: ValidationT) {
  return z.string().min(1, t("titleRequired")).max(150, t("titleTooLong"));
}

// Factories, so validation messages follow the active language.
export function createCreateProjectSchema(t: ValidationT) {
  return z.object({
    title: titleField(t),
    description: z.string().max(2000, t("descriptionTooLong")).optional(),
    totalValue: totalValueField(t),
  });
}

// PUT /projects/{id} is a full-replacement update, so both fields are always
// sent (an empty string clears the description rather than leaving it unset).
export function createUpdateProjectSchema(t: ValidationT) {
  return z.object({
    title: titleField(t),
    description: z.string().max(2000, t("descriptionTooLong")),
    totalValue: totalValueField(t),
  });
}

// react-hook-form's field values are pre-coercion (raw input strings), while
// the resolver hands the submit callback the coerced output — z.coerce.number()
// means those two shapes differ, so both must be exported.
type CreateProjectSchema = ReturnType<typeof createCreateProjectSchema>;
export type CreateProjectFormInput = z.input<CreateProjectSchema>;
export type CreateProjectFormValues = z.output<CreateProjectSchema>;

type UpdateProjectSchema = ReturnType<typeof createUpdateProjectSchema>;
export type UpdateProjectFormInput = z.input<UpdateProjectSchema>;
export type UpdateProjectFormValues = z.output<UpdateProjectSchema>;
