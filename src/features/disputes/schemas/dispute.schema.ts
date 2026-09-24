import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

type ValidationT = Translator<"disputes.validation">;

const TEXT_MIN = 10;
const MAX_FILES = 10;

// Factories, so validation messages follow the active language.
export function createOpenDisputeSchema(t: ValidationT) {
  return z.object({
    category: z.coerce.number().int().min(0).max(5) as z.ZodType<0 | 1 | 2 | 3 | 4 | 5>,
    // min(10) is a preemptive match to this backend's confirmed convention for
    // free-text "explain in detail" fields (ProposedScopeChange came back from
    // the live API requiring a 10-4000 char range) — not yet verified live for
    // these two specifically, but the same DTO-shape pattern strongly suggests
    // the same rule. Update the message if a real 400 ever proves otherwise.
    description: z
      .string()
      .min(TEXT_MIN, t("descriptionMin", { min: TEXT_MIN }))
      .max(4000, t("descriptionTooLong")),
    requestedResolution: z
      .string()
      .min(TEXT_MIN, t("resolutionMin", { min: TEXT_MIN }))
      .max(2000, t("resolutionTooLong")),
    evidenceFiles: z.array(z.instanceof(File)).max(MAX_FILES, t("tooManyFiles", { max: MAX_FILES })),
  });
}

type OpenDisputeSchema = ReturnType<typeof createOpenDisputeSchema>;
export type OpenDisputeFormInput = z.input<OpenDisputeSchema>;
export type OpenDisputeFormValues = z.output<OpenDisputeSchema>;

export function createAddEvidenceSchema(t: ValidationT) {
  return z
    .object({
      description: z.string().max(2000, t("descriptionTooLong")).optional(),
      externalUrl: z
        .string()
        .regex(/^https?:\/\/.+/i, t("linkInvalid"))
        .optional()
        .or(z.literal("")),
      evidenceFile: z.instanceof(File).optional(),
    })
    .refine((data) => Boolean(data.externalUrl) || Boolean(data.evidenceFile), {
      message: t("evidenceRequired"),
      path: ["externalUrl"],
    });
}

export type AddEvidenceFormValues = z.infer<ReturnType<typeof createAddEvidenceSchema>>;

export function createProposeResolutionSchema(t: ValidationT) {
  return z.object({
    proposedResolution: z
      .string()
      .min(TEXT_MIN, t("proposalMin", { min: TEXT_MIN }))
      .max(2000, t("proposalTooLong")),
  });
}

export type ProposeResolutionFormValues = z.infer<ReturnType<typeof createProposeResolutionSchema>>;

export function createRejectResolutionSchema(t: ValidationT) {
  return z.object({
    rejectionReason: z.string().max(2000, t("reasonTooLong")).optional(),
  });
}

export type RejectResolutionFormValues = z.infer<ReturnType<typeof createRejectResolutionSchema>>;
