import { z } from "zod";

export const correctedEvidenceFormSchema = z
  .object({
    updatedNotes: z.string().max(2000, "Notes are too long").optional(),
    updatedTransactionReference: z.string().max(200, "Reference is too long").optional(),
    correctedReceiptFiles: z.array(z.instanceof(File)).max(10, "You can attach up to 10 files"),
  })
  .refine(
    (data) =>
      Boolean(data.updatedTransactionReference?.trim()) ||
      data.correctedReceiptFiles.length > 0,
    {
      message: "Add an updated reference or attach corrected evidence",
      path: ["updatedTransactionReference"],
    },
  );

export type CorrectedEvidenceFormInput = z.input<typeof correctedEvidenceFormSchema>;
export type CorrectedEvidenceFormValues = z.output<typeof correctedEvidenceFormSchema>;
