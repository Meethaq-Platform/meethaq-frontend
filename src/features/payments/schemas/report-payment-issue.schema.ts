import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

// A factory, so validation messages follow the active language.
export function createReportPaymentIssueSchema(t: Translator<"payments.validation">) {
  return z.object({
    reason: z.string().min(1, t("reasonRequired")).max(2000, t("reasonTooLong")),
  });
}

export type ReportPaymentIssueFormValues = z.infer<
  ReturnType<typeof createReportPaymentIssueSchema>
>;
