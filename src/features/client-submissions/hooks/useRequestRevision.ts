"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestRevision, type RequestRevisionPayload } from "../lib/service";

// Request-revision is milestone-scoped on the backend — submissionId
// travels in the mutate payload, not the hook's own arguments.
export function useRequestRevision(projectId: string, milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["request-revision"],
    mutationFn: (data: RequestRevisionPayload) =>
      requestRevision(projectId, milestoneId, data),
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
