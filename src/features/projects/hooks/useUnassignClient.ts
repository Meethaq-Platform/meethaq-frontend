"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unassignClient } from "../lib/service";
import { patchProjectCaches } from "../lib/cache";

export function useUnassignClient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unassign-client"],
    mutationFn: () => unassignClient(id),
    onSuccess: (response) => {
      if (response.data) patchProjectCaches(queryClient, response.data);
    },
  });
}
