import type {
  AcceptDeliverableRequest,
  WorkSubmissionListResponse,
} from "@/src/features/submissions/types/submission";
import type { MilestoneExecutionResponse } from "@/src/features/milestones/types/milestone";

export async function getClientMilestone(
  projectId: string,
  milestoneId: string,
): Promise<MilestoneExecutionResponse> {
  const response = await fetch(`/api/client/projects/${projectId}/milestones/${milestoneId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load milestone.");
  }

  return result;
}

export async function getClientSubmissions(
  projectId: string,
  milestoneId: string,
): Promise<WorkSubmissionListResponse> {
  const response = await fetch(
    `/api/client/projects/${projectId}/milestones/${milestoneId}/submissions`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load submission history.");
  }

  return result;
}

// Accept/RequestRevision are milestone-scoped on the backend, not
// submission-scoped — the submissionId travels in the request body
// (AcceptDeliverableDto.submissionId), not the URL.
export async function acceptDeliverable(
  projectId: string,
  milestoneId: string,
  data: AcceptDeliverableRequest,
): Promise<MilestoneExecutionResponse> {
  const response = await fetch(
    `/api/client/projects/${projectId}/milestones/${milestoneId}/accept`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to accept deliverable.");
  }

  return result;
}

export interface RequestRevisionPayload {
  submissionId: number;
  reason: string;
  requiredChanges: string;
  files: File[];
}

export async function requestRevision(
  projectId: string,
  milestoneId: string,
  data: RequestRevisionPayload,
): Promise<MilestoneExecutionResponse> {
  const formData = new FormData();
  formData.set("SubmissionId", String(data.submissionId));
  formData.set("Reason", data.reason);
  formData.set("RequiredChanges", data.requiredChanges);
  for (const file of data.files) {
    formData.append("Files", file);
  }

  const response = await fetch(
    `/api/client/projects/${projectId}/milestones/${milestoneId}/request-revision`,
    { method: "POST", body: formData },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to request revision.");
  }

  return result;
}
