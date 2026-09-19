"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptDeliverable } from "../lib/service";
import type { AcceptDeliverableRequest } from "@/src/features/submissions/types/submission";

// Accept is milestone-scoped on the backend — submissionId travels in the
// mutate payload (AcceptDeliverableRequest), not the hook's own arguments.
export function useAcceptDeliverable(projectId: string, milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["accept-deliverable"],
    mutationFn: (data: AcceptDeliverableRequest) =>
      acceptDeliverable(projectId, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-submissions", projectId, milestoneId],
      });
      queryClient.invalidateQueries({
        queryKey: ["client-milestone", projectId, milestoneId],
      });
      queryClient.invalidateQueries({ queryKey: ["execution-overview", projectId] });
    },
  });
}
