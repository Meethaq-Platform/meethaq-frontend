"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderMilestones } from "../lib/service";

export function useReorderMilestones(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reorder-milestones"],
    mutationFn: (milestoneIds: number[]) =>
      reorderMilestones(projectId, { milestoneIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", projectId] });
    },
  });
}
