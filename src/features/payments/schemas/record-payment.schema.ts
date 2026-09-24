import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

type ValidationT = Translator<"payments.validation">;

const MAX_FILES = 10;

// Mirrors the sprint requirement: "Transaction Reference and/or Payment
// Evidence" — at least one of the two must be present, enforced via refine
// since it spans two fields. File type/size validated imperatively in
// FileAttachmentInput, not here. A factory, so validation messages follow
// the active language.
export function createRecordPaymentFormSchema(t: ValidationT) {
  return z
    .object({
      paymentMethod: z.coerce.number().int().min(0).max(4) as z.ZodType<0 | 1 | 2 | 3 | 4>,
      paymentDate: z.string().min(1, t("dateRequired")),
      amount: z.coerce.number().positive(t("amountPositive")),
      transactionReference: z.string().max(200, t("referenceTooLong")).optional(),
      paymentNotes: z.string().max(2000, t("notesTooLong")).optional(),
      receiptFiles: z.array(z.instanceof(File)).max(MAX_FILES, t("tooManyFiles", { max: MAX_FILES })),
    })
    .refine(
      (data) => Boolean(data.transactionReference?.trim()) || data.receiptFiles.length > 0,
      {
        message: t("evidenceRequired"),
        path: ["transactionReference"],
      },
    );
}

type RecordPaymentFormSchema = ReturnType<typeof createRecordPaymentFormSchema>;
export type RecordPaymentFormInput = z.input<RecordPaymentFormSchema>;
export type RecordPaymentFormValues = z.output<RecordPaymentFormSchema>;
