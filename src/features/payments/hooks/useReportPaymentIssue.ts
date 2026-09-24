"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportPaymentIssue } from "../lib/service";
import { patchPaymentCaches } from "../lib/cache";
import type { ReportPaymentIssuePayload } from "../types/payment";

export function useReportPaymentIssue(projectId: string, milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["report-payment-issue"],
    mutationFn: (payload: ReportPaymentIssuePayload) =>
      reportPaymentIssue(projectId, milestoneId, payload),
    onSuccess: (response) => {
      patchPaymentCaches(queryClient, projectId, milestoneId, response.data);
    },
  });
}
