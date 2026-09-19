"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubmission, type CreateSubmissionPayload } from "../lib/service";

export function useCreateSubmission(projectId: string, milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-submission"],
    mutationFn: (data: CreateSubmissionPayload) =>
      createSubmission(projectId, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["submissions", projectId, milestoneId],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestone", projectId, milestoneId],
      });
      queryClient.invalidateQueries({ queryKey: ["execution-overview", projectId] });
    },
  });
}
