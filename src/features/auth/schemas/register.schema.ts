import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

const NAME_MIN = 2;
const PASSWORD_MIN = 8;

// A factory, so validation messages follow the active language.
export function createSignupSchema(t: Translator<"auth.validation">) {
  return z.object({
    firstName: z
      .string()
      .min(NAME_MIN, t("firstNameMin", { min: NAME_MIN }))
      .max(50, t("firstNameMax")),

    lastName: z
      .string()
      .min(NAME_MIN, t("lastNameMin", { min: NAME_MIN }))
      .max(50, t("lastNameMax")),

    email: z.string().email(t("emailInvalid")),

    password: z.string().min(PASSWORD_MIN, t("passwordMin", { min: PASSWORD_MIN })),

    role: z.enum(["freelancer", "client"]),
  });
}

export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;
