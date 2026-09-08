import type { ProjectResponse, ProjectsListResponse } from "@/src/features/projects/types/project";
import type {
  GetClientProjectsParams,
  GetInvitationsParams,
  ProjectInvitationAcceptanceResponse,
  ProjectInvitationResponse,
  ProjectInvitationsListResponse,
} from "../types/client-project";

export async function getInvitations(
  params: GetInvitationsParams,
): Promise<ProjectInvitationsListResponse> {
  const query = new URLSearchParams();
  query.set("PageNumber", String(params.pageNumber));
  query.set("PageSize", String(params.pageSize));
  if (params.status) query.set("Status", params.status);

  const response = await fetch(`/api/client/invitations?${query.toString()}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load invitations.");
  }

  return data;
}

export async function getInvitationById(
  id: string,
): Promise<ProjectInvitationResponse> {
  const response = await fetch(`/api/client/invitations/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load invitation.");
  }

  return data;
}

export async function acceptInvitation(
  id: string,
): Promise<ProjectInvitationAcceptanceResponse> {
  const response = await fetch(`/api/client/invitations/${id}/accept`, {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to accept invitation.");
  }

  return data;
}

export async function getClientProjects(
  params: GetClientProjectsParams,
): Promise<ProjectsListResponse> {
  const query = new URLSearchParams();
  query.set("PageNumber", String(params.pageNumber));
  query.set("PageSize", String(params.pageSize));
  if (params.status) query.set("Status", params.status);

  const response = await fetch(`/api/client/projects?${query.toString()}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load projects.");
  }

  return data;
}

export async function getClientProjectById(
  id: string,
): Promise<ProjectResponse> {
  const response = await fetch(`/api/client/projects/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load project.");
  }

  return data;
}
