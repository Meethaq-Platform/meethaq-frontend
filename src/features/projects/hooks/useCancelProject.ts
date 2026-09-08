"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelProject } from "../lib/service";
import { patchProjectCaches } from "../lib/cache";

export function useCancelProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cancel-project"],
    mutationFn: () => cancelProject(id),
    onSuccess: (response) => {
      if (response.data) patchProjectCaches(queryClient, response.data);
    },
  });
}
