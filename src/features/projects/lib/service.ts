import type {
  CreateProjectRequest,
  GetProjectsParams,
  LinkClientRequest,
  ProjectResponse,
  ProjectsListResponse,
  UpdateProjectRequest,
} from "../types/project";

export async function getProjects(
  params: GetProjectsParams,
): Promise<ProjectsListResponse> {
  const query = new URLSearchParams();
  query.set("PageNumber", String(params.pageNumber));
  query.set("PageSize", String(params.pageSize));
  if (params.status) query.set("Status", params.status);

  const response = await fetch(`/api/projects?${query.toString()}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load projects.");
  }

  return data;
}

export async function getProjectById(id: string): Promise<ProjectResponse> {
  const response = await fetch(`/api/projects/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load project.");
  }

  return data;
}

export async function createProject(
  data: CreateProjectRequest,
): Promise<ProjectResponse> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create project.");
  }

  return result;
}

export async function updateProject(
  id: string,
  data: UpdateProjectRequest,
): Promise<ProjectResponse> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update project.");
  }

  return result;
}

export async function assignClient(
  id: string,
  data: LinkClientRequest,
): Promise<ProjectResponse> {
  const response = await fetch(`/api/projects/${id}/client`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to assign client.");
  }

  return result;
}

export async function unassignClient(id: string): Promise<ProjectResponse> {
  const response = await fetch(`/api/projects/${id}/client`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to unassign client.");
  }

  return result;
}

export async function cancelProject(id: string): Promise<ProjectResponse> {
  const response = await fetch(`/api/projects/${id}/cancel`, {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to cancel project.");
  }

  return result;
}
