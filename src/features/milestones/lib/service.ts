import type {
  MilestoneExecutionResponse,
  ProjectExecutionOverviewResponse,
} from "../types/milestone";

// Note: there is no "list milestones" endpoint on the backend — only
// single-milestone GET. The Milestones tab composes its list from the
// Contract's own milestones[] (title/dueDate/value/order) plus a per-id
// fetch of this endpoint for execution status — see
// useFreelancerMilestonesList / useClientMilestonesList.
export async function getMilestone(
  projectId: string,
  milestoneId: string,
): Promise<MilestoneExecutionResponse> {
  const response = await fetch(`/api/projects/${projectId}/milestones/${milestoneId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load milestone.");
  }

  return result;
}

export async function startMilestone(
  projectId: string,
  milestoneId: number,
): Promise<MilestoneExecutionResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/start`,
    { method: "POST" },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to start milestone.");
  }

  return result;
}

export async function getExecutionOverview(
  projectId: string,
): Promise<ProjectExecutionOverviewResponse> {
  const response = await fetch(`/api/projects/${projectId}/overview`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load execution overview.");
  }

  return result;
}
