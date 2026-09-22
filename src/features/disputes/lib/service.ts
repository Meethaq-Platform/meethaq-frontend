import type {
  AddEvidencePayload,
  DecideResolutionPayload,
  DisputeDetailResponse,
  DisputeEvidenceItemResponse,
  DisputeListResponse,
  DisputeResolutionDecisionResponse,
  DisputeResolutionProposalResponse,
  OpenDisputePayload,
  ProposeResolutionPayload,
} from "../types/dispute";

export async function getDisputes(
  projectId: string,
  cursor?: string,
  pageSize = 20,
): Promise<DisputeListResponse> {
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  if (cursor) params.set("cursor", cursor);

  const response = await fetch(`/api/projects/${projectId}/disputes?${params}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load disputes.");
  }

  return result;
}

export async function getDispute(
  projectId: string,
  milestoneId: string,
  disputeId: string,
): Promise<DisputeDetailResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/disputes/${disputeId}`,
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load dispute.");
  }

  return result;
}

// Field names match the backend's multipart binding: Category, Description,
// RequestedResolution, EvidenceFiles.
export async function openDispute(
  projectId: string,
  milestoneId: string,
  payload: OpenDisputePayload,
): Promise<DisputeDetailResponse> {
  const formData = new FormData();
  formData.set("Category", String(payload.category));
  formData.set("Description", payload.description);
  formData.set("RequestedResolution", payload.requestedResolution);
  for (const file of payload.evidenceFiles) {
    formData.append("EvidenceFiles", file);
  }

  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/disputes`,
    { method: "POST", body: formData },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to open dispute.");
  }

  return result;
}

export async function addEvidence(
  projectId: string,
  milestoneId: string,
  disputeId: string,
  payload: AddEvidencePayload,
): Promise<DisputeEvidenceItemResponse> {
  const formData = new FormData();
  if (payload.description) formData.set("Description", payload.description);
  if (payload.externalUrl) formData.set("ExternalUrl", payload.externalUrl);
  if (payload.evidenceFile) formData.set("EvidenceFile", payload.evidenceFile);

  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/disputes/${disputeId}/evidence`,
    { method: "POST", body: formData },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add evidence.");
  }

  return result;
}

export async function proposeResolution(
  projectId: string,
  milestoneId: string,
  disputeId: string,
  payload: ProposeResolutionPayload,
): Promise<DisputeResolutionProposalResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/disputes/${disputeId}/proposals`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to propose resolution.");
  }

  return result;
}

export async function decideResolution(
  projectId: string,
  milestoneId: string,
  disputeId: string,
  payload: DecideResolutionPayload,
): Promise<DisputeResolutionDecisionResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/disputes/${disputeId}/decide-resolution`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to decide on resolution.");
  }

  return result;
}

export async function withdrawDispute(
  projectId: string,
  milestoneId: string,
  disputeId: string,
): Promise<DisputeResolutionDecisionResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/disputes/${disputeId}/withdraw`,
    { method: "POST" },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to withdraw dispute.");
  }

  return result;
}

// Same-origin authenticated GET — a plain <a href download> works directly,
// no fetch-and-blob dance needed.
export function getExportUrl(projectId: string, milestoneId: string, disputeId: string) {
  return `/api/projects/${projectId}/milestones/${milestoneId}/disputes/${disputeId}/export`;
}
