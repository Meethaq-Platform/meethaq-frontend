"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startMilestone } from "../lib/service";

export function useStartMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["start-milestone"],
    mutationFn: (milestoneId: number) => startMilestone(projectId, milestoneId),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.invalidateQueries({
          queryKey: ["milestone", projectId, String(response.data.milestoneId)],
        });
      }
      // Refreshes the Overview tab's stats (totalMilestones etc. don't
      // change on start, but keeps this in sync with any other counters).
      queryClient.invalidateQueries({ queryKey: ["execution-overview", projectId] });
    },
  });
}
