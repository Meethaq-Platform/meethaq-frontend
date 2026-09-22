import { z } from "zod";

// Mirrors the sprint requirement: "Transaction Reference and/or Payment
// Evidence" — at least one of the two must be present, enforced via refine
// since it spans two fields. File type/size validated imperatively in
// FileAttachmentInput, not here.
export const recordPaymentFormSchema = z
  .object({
    paymentMethod: z.coerce.number().int().min(0).max(4) as z.ZodType<0 | 1 | 2 | 3 | 4>,
    paymentDate: z.string().min(1, "Payment date is required"),
    amount: z.coerce.number().positive("Amount must be greater than zero"),
    transactionReference: z.string().max(200, "Reference is too long").optional(),
    paymentNotes: z.string().max(2000, "Notes are too long").optional(),
    receiptFiles: z.array(z.instanceof(File)).max(10, "You can attach up to 10 files"),
  })
  .refine(
    (data) => Boolean(data.transactionReference?.trim()) || data.receiptFiles.length > 0,
    {
      message: "Add a transaction reference or attach payment evidence",
      path: ["transactionReference"],
    },
  );

export type RecordPaymentFormInput = z.input<typeof recordPaymentFormSchema>;
export type RecordPaymentFormValues = z.output<typeof recordPaymentFormSchema>;
