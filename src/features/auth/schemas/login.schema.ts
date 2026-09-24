import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

// A factory, so validation messages follow the active language.
export function createLoginSchema(t: Translator<"auth.validation">) {
  return z.object({
    emailOrFullName: z.string().min(1, t("identifierRequired")),

    password: z.string().min(1, t("passwordRequired")),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
