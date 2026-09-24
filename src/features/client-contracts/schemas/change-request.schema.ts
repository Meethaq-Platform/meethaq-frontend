import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

// Mirrors ContractChangeRequestDto's feedback field. A factory, so
// validation messages follow the active language.
export function createChangeRequestSchema(t: Translator<"clientContracts.validation">) {
  return z.object({
    feedback: z
      .string()
      .min(1, t("feedbackRequired"))
      .max(2000, t("feedbackTooLong")),
  });
}

export type ChangeRequestFormValues = z.infer<ReturnType<typeof createChangeRequestSchema>>;
