import type { ActivityLogListResponse } from "../types/activity";

// Cursor-paginated — no cursor passed fetches the first page.
export async function getActivity(projectId: string): Promise<ActivityLogListResponse> {
  const response = await fetch(`/api/projects/${projectId}/activity?pageSize=50`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load activity history.");
  }

  return result;
}
