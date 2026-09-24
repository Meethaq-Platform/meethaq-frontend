import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

type ValidationT = Translator<"profile.validation">;

const FULL_NAME_MIN = 2;
const BIO_MAX = 1000;

function sharedProfileShape(t: ValidationT) {
  return {
    fullName: z
      .string()
      .min(FULL_NAME_MIN, t("fullNameMin", { min: FULL_NAME_MIN }))
      .max(100, t("fullNameTooLong")),
    phoneNumber: z.string().min(1, t("phoneRequired")),
    country: z.string(),
  };
}

// Factories, so validation messages follow the active language.
export function createClientProfileSchema(t: ValidationT) {
  return z.object(sharedProfileShape(t));
}

export type ClientProfileFormValues = z.infer<ReturnType<typeof createClientProfileSchema>>;

export function createFreelancerProfileSchema(t: ValidationT) {
  return z.object({
    ...sharedProfileShape(t),
    professionalTitle: z.string().min(1, t("titleRequired")),
    bio: z.string().max(BIO_MAX, t("bioTooLong", { max: BIO_MAX })),
  });
}

export type FreelancerProfileFormValues = z.infer<ReturnType<typeof createFreelancerProfileSchema>>;
