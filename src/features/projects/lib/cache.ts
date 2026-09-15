import type { QueryClient } from "@tanstack/react-query";
import type { Project, ProjectsListData } from "../types/project";

export function toProjectSummary(project: Project) {
  return {
    id: project.id,
    title: project.title,
    status: project.status,
    clientId: project.clientId,
    clientName: project.clientName,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export function patchProjectCaches(queryClient: QueryClient, project: Project) {
  queryClient.setQueryData(["project", String(project.id)], project);

  queryClient.setQueriesData<ProjectsListData>(
    { queryKey: ["projects"] },
    (current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              item.id === project.id ? toProjectSummary(project) : item,
            ),
          }
        : current,
  );
}
