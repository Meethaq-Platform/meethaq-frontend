"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMilestone } from "../lib/service";
import type { UpdateMilestoneRequest } from "../types/contract";

export function useUpdateMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-milestone"],
    mutationFn: ({
      milestoneId,
      data,
    }: {
      milestoneId: number;
      data: UpdateMilestoneRequest;
    }) => updateMilestone(projectId, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", projectId] });
    },
  });
}
