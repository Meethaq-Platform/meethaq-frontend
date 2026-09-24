import type {
  ChangeRequestDecisionResponse,
  ChangeRequestListResponse,
  ChangeRequestResponse,
  ContractAmendmentListResponse,
  ContractAmendmentResponse,
  CreateChangeRequestPayload,
  DecideChangeRequestPayload,
} from "../types/change-request";

export async function getChangeRequests(
  projectId: string,
  cursor?: string,
  pageSize = 20,
): Promise<ChangeRequestListResponse> {
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  if (cursor) params.set("cursor", cursor);

  const response = await fetch(`/api/projects/${projectId}/change-requests?${params}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load change requests.");
  }

  return result;
}

export async function getChangeRequest(
  projectId: string,
  changeRequestId: string,
): Promise<ChangeRequestResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/change-requests/${changeRequestId}`,
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load change request.");
  }

  return result;
}

// Field names match the backend's multipart binding: Title, Reason,
// ProposedScopeChange, ResultingProjectValue, MilestonesJson (a JSON-encoded
// array of deltas), Attachments.
export async function createChangeRequest(
  projectId: string,
  payload: CreateChangeRequestPayload,
): Promise<ChangeRequestResponse> {
  const formData = new FormData();
  formData.set("Title", payload.title);
  formData.set("Reason", payload.reason);
  formData.set("ProposedScopeChange", payload.proposedScopeChange);
  formData.set("ResultingProjectValue", String(payload.resultingProjectValue));
  formData.set("MilestonesJson", JSON.stringify(payload.milestoneDeltas));
  for (const file of payload.attachments) {
    formData.append("Attachments", file);
  }

  const response = await fetch(`/api/projects/${projectId}/change-requests`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit change request.");
  }

  return result;
}

export async function decideChangeRequest(
  projectId: string,
  changeRequestId: string,
  payload: DecideChangeRequestPayload,
): Promise<ChangeRequestDecisionResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/change-requests/${changeRequestId}/decide`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to decide on change request.");
  }

  return result;
}

export async function withdrawChangeRequest(
  projectId: string,
  changeRequestId: string,
): Promise<ChangeRequestResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/change-requests/${changeRequestId}/withdraw`,
    { method: "POST" },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to withdraw change request.");
  }

  return result;
}

export async function getAmendments(projectId: string): Promise<ContractAmendmentListResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract/amendments`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load amendment history.");
  }

  return result;
}

export async function getAmendment(
  projectId: string,
  amendmentId: string,
): Promise<ContractAmendmentResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/contract/amendments/${amendmentId}`,
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load amendment details.");
  }

  return result;
}
