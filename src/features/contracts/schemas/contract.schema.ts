import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

// Mirrors CreateContractDto/UpdateContractDto — the API uses the same shape
// for both create and update (full replacement), so one schema covers both.
// A factory, so validation messages follow the active language.
export function createContractFormSchema(t: Translator<"contracts.validation">) {
  return z
    .object({
      title: z.string().min(1, t("titleRequired")).max(150, t("titleTooLong")),
      scopeOfWork: z
        .string()
        .min(1, t("scopeRequired"))
        .max(5000, t("scopeTooLong")),
      startDate: z.string().min(1, t("startRequired")),
      expectedEndDate: z.string().min(1, t("endRequired")),
      generalTerms: z.string().max(5000, t("termsTooLong")).optional(),
      allocationMode: z.union([z.literal(0), z.literal(1)]),
    })
    .refine((data) => new Date(data.expectedEndDate) >= new Date(data.startDate), {
      message: t("endBeforeStart"),
      path: ["expectedEndDate"],
    });
}

export type ContractFormValues = z.infer<ReturnType<typeof createContractFormSchema>>;
