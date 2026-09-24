"use client";

import { useMutation } from "@tanstack/react-query";
import { remindClient } from "../lib/service";

// Freelancer-triggered nudge for an overdue review — rate-limited on the
// backend (429), surfaced via the mutation's own error message.
export function useRemindClient(projectId: string, milestoneId: string) {
  return useMutation({
    mutationKey: ["remind-client"],
    mutationFn: (submissionId: number) => remindClient(projectId, milestoneId, submissionId),
  });
}
