import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

type ValidationT = Translator<"changeRequests.validation">;

const SCOPE_MIN = 10;
const MAX_FILES = 10;

// Milestone deltas are managed as plain component state in
// CreateChangeRequestModal (each row's fields are pre-filled from the
// selected milestone's current terms, closer to an "edit milestone" form
// than a flat field list) — validated there directly rather than through
// this schema, since react-hook-form's array registration doesn't fit a
// per-row editable-copy UI well. This schema only covers the flat fields.
// Factories, so validation messages follow the active language.
export function createCreateChangeRequestSchema(t: ValidationT) {
  return z.object({
    title: z.string().min(1, t("titleRequired")).max(200, t("titleTooLong")),
    reason: z.string().min(1, t("reasonRequired")).max(2000, t("reasonTooLong")),
    // CONFIRMED required by the live backend (a 400 response named this field
    // required with a 10-4000 char range) despite reading as optional in the
    // sprint doc and having no `required` marker in swagger.
    proposedScopeChange: z
      .string()
      .min(SCOPE_MIN, t("scopeMin", { min: SCOPE_MIN }))
      .max(4000, t("scopeTooLong")),
    resultingProjectValue: z.coerce.number().positive(t("valuePositive")),
    attachments: z.array(z.instanceof(File)).max(MAX_FILES, t("tooManyFiles", { max: MAX_FILES })),
  });
}

type CreateChangeRequestSchema = ReturnType<typeof createCreateChangeRequestSchema>;
export type CreateChangeRequestFormInput = z.input<CreateChangeRequestSchema>;
export type CreateChangeRequestFormValues = z.output<CreateChangeRequestSchema>;

export function createDecideChangeRequestSchema(t: ValidationT) {
  return z.object({
    rejectionReason: z.string().max(2000, t("reasonTooLong")).optional(),
  });
}

export type DecideChangeRequestFormValues = z.infer<
  ReturnType<typeof createDecideChangeRequestSchema>
>;
