import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

const MAX_FILES = 10;

// Mirrors RequestRevisionDto. Supporting files are optional per spec. A
// factory, so validation messages follow the active language.
export function createRequestRevisionFormSchema(t: Translator<"clientSubmissions.validation">) {
  return z.object({
    reason: z
      .string()
      .min(1, t("reasonRequired"))
      .max(2000, t("reasonTooLong")),
    requiredChanges: z
      .string()
      .min(1, t("changesRequired"))
      .max(2000, t("changesTooLong")),
    files: z.array(z.instanceof(File)).max(MAX_FILES, t("tooManyFiles", { max: MAX_FILES })),
  });
}

type RequestRevisionFormSchema = ReturnType<typeof createRequestRevisionFormSchema>;
export type RequestRevisionFormInput = z.input<RequestRevisionFormSchema>;
export type RequestRevisionFormValues = z.output<RequestRevisionFormSchema>;
