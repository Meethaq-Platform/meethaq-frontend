import type {
  BooleanResponse,
  ContractResponse,
  ContractValidationResponse,
  CreateContractRequest,
  CreateMilestoneRequest,
  MilestoneResponse,
  MilestonesReorderResponse,
  ReorderMilestonesRequest,
  UpdateContractRequest,
  UpdateMilestoneRequest,
} from "../types/contract";

export async function getContract(projectId: string): Promise<ContractResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract`);

  const data = await response.json();

  // No contract yet is a normal state for a project, not a failure.
  if (response.status === 404) return data;

  if (!response.ok) {
    throw new Error(data.message || "Failed to load contract.");
  }

  return data;
}

export async function createContract(
  projectId: string,
  data: CreateContractRequest,
): Promise<ContractResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create contract.");
  }

  return result;
}

export async function updateContract(
  projectId: string,
  data: UpdateContractRequest,
): Promise<ContractResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update contract.");
  }

  return result;
}

export async function deleteContract(projectId: string): Promise<BooleanResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete contract.");
  }

  return result;
}

export async function validateContract(
  projectId: string,
): Promise<ContractValidationResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract/validate`, {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to validate contract.");
  }

  return result;
}

export async function submitContract(projectId: string): Promise<ContractResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract/submit`, {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit contract.");
  }

  return result;
}

export async function withdrawContract(projectId: string): Promise<ContractResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract/withdraw`, {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to withdraw contract.");
  }

  return result;
}

export async function createMilestone(
  projectId: string,
  data: CreateMilestoneRequest,
): Promise<MilestoneResponse> {
  const response = await fetch(`/api/projects/${projectId}/contract/milestones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add milestone.");
  }

  return result;
}

export async function updateMilestone(
  projectId: string,
  milestoneId: number,
  data: UpdateMilestoneRequest,
): Promise<MilestoneResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/contract/milestones/${milestoneId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update milestone.");
  }

  return result;
}

export async function deleteMilestone(
  projectId: string,
  milestoneId: number,
): Promise<BooleanResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/contract/milestones/${milestoneId}`,
    { method: "DELETE" },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete milestone.");
  }

  return result;
}

export async function reorderMilestones(
  projectId: string,
  data: ReorderMilestonesRequest,
): Promise<MilestonesReorderResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/contract/milestones/reorder`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to reorder milestones.");
  }

  return result;
}
