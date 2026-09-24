import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

// Mirrors CreateMilestoneDto/UpdateMilestoneDto. A factory, so validation
// messages follow the active language.
export function createMilestoneFormSchema(t: Translator<"contracts.milestoneValidation">) {
  return z.object({
    title: z.string().min(1, t("titleRequired")).max(150, t("titleTooLong")),
    description: z.string().max(2000, t("descriptionTooLong")).optional(),
    deliverable: z
      .string()
      .min(1, t("deliverableRequired"))
      .max(1000, t("deliverableTooLong")),
    acceptanceCriteria: z
      .string()
      .min(1, t("criteriaRequired"))
      .max(2000, t("criteriaTooLong")),
    dueDate: z.string().min(1, t("dueRequired")),
    allocationValue: z.coerce
      .number({ message: t("amountInvalid") })
      .min(0.01, t("amountPositive"))
      .max(1000000000, t("amountTooLarge")),
  });
}

// react-hook-form's field values are pre-coercion (raw input strings), while
// the resolver hands the submit callback the coerced output — z.coerce.number()
// means those two shapes differ, so both must be exported.
type MilestoneFormSchema = ReturnType<typeof createMilestoneFormSchema>;
export type MilestoneFormInput = z.input<MilestoneFormSchema>;
export type MilestoneFormValues = z.output<MilestoneFormSchema>;
