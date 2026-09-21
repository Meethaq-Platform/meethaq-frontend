"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeProject } from "../lib/service";
import type { CompleteProjectPayload } from "../types/project";

// The response returns ProjectCompletionResult (reconciliation summary),
// not a full Project — so there's nothing to patch into the ["project", id]
// cache directly; invalidate it instead and let ProjectStatusBadge reflect
// the new status from a fresh fetch (see the comment on
// ProjectCompletionResult in types/project.ts for why).
export function useCompleteProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["complete-project"],
    mutationFn: (payload: CompleteProjectPayload) => completeProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
