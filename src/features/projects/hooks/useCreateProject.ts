"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../lib/service";
import { toProjectSummary } from "../lib/cache";
import type { ProjectsListData } from "../types/project";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-project"],
    mutationFn: createProject,
    onSuccess: (response) => {
      const project = response.data;
      if (!project) return;

      queryClient.setQueryData(["project", String(project.id)], project);

      queryClient.setQueriesData<ProjectsListData>(
        { queryKey: ["projects"] },
        (current) =>
          current
            ? {
                ...current,
                items: [toProjectSummary(project), ...current.items],
                totalCount: current.totalCount + 1,
              }
            : current,
      );
    },
  });
}
