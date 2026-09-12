"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMilestone } from "../lib/service";
import type { CreateMilestoneRequest } from "../types/contract";

// Milestone mutations return only the affected milestone, not the contract's
// recalculated summary (allocatedValue, remainingValue, isAllocationComplete),
// so refetch the contract rather than patching its cache by hand.
export function useCreateMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-milestone"],
    mutationFn: (data: CreateMilestoneRequest) => createMilestone(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", projectId] });
    },
  });
}
