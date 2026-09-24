import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

// Mirrors AcceptDeliverableDto — note is optional per spec. A factory, so
// validation messages follow the active language.
export function createAcceptDeliverableFormSchema(t: Translator<"clientSubmissions.validation">) {
  return z.object({
    note: z.string().max(2000, t("noteTooLong")).optional(),
  });
}

export type AcceptDeliverableFormValues = z.infer<
  ReturnType<typeof createAcceptDeliverableFormSchema>
>;
