"use client";

import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { getProjects } from "@/src/features/projects/lib/service";
import { getClientProjects } from "@/src/features/client-projects/lib/service";
import { getClients } from "@/src/features/clients/lib/service";

export interface SearchResultItem {
  id: number;
  title: string;
  subtitle?: string;
  href: string;
}

export interface GlobalSearchResults {
  projects: SearchResultItem[];
  clients: SearchResultItem[];
  isLoading: boolean;
  isError: boolean;
}

const RESULT_LIMIT = 6;
const PROJECT_FETCH_SIZE = 50;

export function useGlobalSearch(query: string): GlobalSearchResults {
  const { data: user } = useCurrentUser();
  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";
  const trimmed = query.trim();
  const enabled = trimmed.length > 0;

  const projectsQuery = useQuery({
    queryKey: ["global-search-projects", isFreelancer, trimmed],
    queryFn: async () => {
      const response = isFreelancer
        ? await getProjects({ pageNumber: 1, pageSize: PROJECT_FETCH_SIZE })
        : await getClientProjects({
            pageNumber: 1,
            pageSize: PROJECT_FETCH_SIZE,
          });
      return response.data?.items ?? [];
    },
    enabled,
  });

  const clientsQuery = useQuery({
    queryKey: ["global-search-clients", trimmed],
    queryFn: async () => {
      const response = await getClients({
        pageNumber: 1,
        pageSize: RESULT_LIMIT,
        search: trimmed,
      });
      return response.data?.items ?? [];
    },
    enabled: enabled && isFreelancer,
  });

  const needle = trimmed.toLowerCase();

  const projects: SearchResultItem[] = enabled
    ? (projectsQuery.data ?? [])
        .filter((project) => project.title.toLowerCase().includes(needle))
        .slice(0, RESULT_LIMIT)
        .map((project) => ({
          id: project.id,
          title: project.title,
          subtitle: project.clientName ?? undefined,
          href: `/projects/${project.id}`,
        }))
    : [];

  const clients: SearchResultItem[] =
    enabled && isFreelancer
      ? (clientsQuery.data ?? []).map((client) => ({
          id: client.relationshipId,
          title: client.clientFullName,
          subtitle: client.companyName ?? undefined,
          href: `/clients/${client.relationshipId}`,
        }))
      : [];

  return {
    projects,
    clients,
    isLoading: enabled && (projectsQuery.isLoading || clientsQuery.isLoading),
    isError: projectsQuery.isError || clientsQuery.isError,
  };
}
