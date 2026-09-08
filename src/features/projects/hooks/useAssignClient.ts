"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignClient } from "../lib/service";
import { patchProjectCaches } from "../lib/cache";
import type { LinkClientRequest } from "../types/project";

export function useAssignClient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["assign-client"],
    mutationFn: (data: LinkClientRequest) => assignClient(id, data),
    onSuccess: (response) => {
      if (response.data) patchProjectCaches(queryClient, response.data);
    },
  });
}
