"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../lib/service";
import { patchProjectCaches } from "../lib/cache";
import type { UpdateProjectRequest } from "../types/project";

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-project"],
    mutationFn: (data: UpdateProjectRequest) => updateProject(id, data),
    onSuccess: (response) => {
      if (response.data) patchProjectCaches(queryClient, response.data);
    },
  });
}
