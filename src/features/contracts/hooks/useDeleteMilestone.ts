"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMilestone } from "../lib/service";

export function useDeleteMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-milestone"],
    mutationFn: (milestoneId: number) => deleteMilestone(projectId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", projectId] });
    },
  });
}
