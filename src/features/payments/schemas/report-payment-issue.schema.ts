import { z } from "zod";

export const reportPaymentIssueSchema = z.object({
  reason: z.string().min(1, "A reason is required").max(2000, "Reason is too long"),
});

export type ReportPaymentIssueFormValues = z.infer<typeof reportPaymentIssueSchema>;
