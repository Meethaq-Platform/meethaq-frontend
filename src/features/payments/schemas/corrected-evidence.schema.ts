import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

type ValidationT = Translator<"payments.validation">;

const MAX_FILES = 10;

// A factory, so validation messages follow the active language.
export function createCorrectedEvidenceFormSchema(t: ValidationT) {
  return z
    .object({
      updatedNotes: z.string().max(2000, t("notesTooLong")).optional(),
      updatedTransactionReference: z.string().max(200, t("referenceTooLong")).optional(),
      correctedReceiptFiles: z
        .array(z.instanceof(File))
        .max(MAX_FILES, t("tooManyFiles", { max: MAX_FILES })),
    })
    .refine(
      (data) =>
        Boolean(data.updatedTransactionReference?.trim()) ||
        data.correctedReceiptFiles.length > 0,
      {
        message: t("correctedRequired"),
        path: ["updatedTransactionReference"],
      },
    );
}

type CorrectedEvidenceFormSchema = ReturnType<typeof createCorrectedEvidenceFormSchema>;
export type CorrectedEvidenceFormInput = z.input<CorrectedEvidenceFormSchema>;
export type CorrectedEvidenceFormValues = z.output<CorrectedEvidenceFormSchema>;
