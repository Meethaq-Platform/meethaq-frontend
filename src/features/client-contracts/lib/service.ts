import type { ContractResponse } from "@/src/features/contracts/types/contract";
import type {
  ClientApprovalRequest,
  ContractChangeFeedbackListResponse,
  ContractChangeRequest,
} from "../types/client-contract";

// The backend returns this literal code as the error message on a concurrency
// conflict (someone else changed the contract since it was last fetched).
function friendlyMessage(message: string | undefined, fallback: string): string {
  if (message === "STALE_CONTRACT_VERSION") {
    return "This contract changed since you last loaded it. Refresh and try again.";
  }
  return message || fallback;
}

export async function getClientContract(projectId: string): Promise<ContractResponse> {
  const response = await fetch(`/api/client/projects/${projectId}/contract`);

  const data = await response.json();

  // No contract submitted yet is a normal state for a project, not a failure.
  if (response.status === 404) return data;

  if (!response.ok) {
    throw new Error(friendlyMessage(data.message, "Failed to load contract."));
  }

  return data;
}

export async function approveContract(
  projectId: string,
  data: ClientApprovalRequest,
): Promise<ContractResponse> {
  const response = await fetch(`/api/client/projects/${projectId}/contract/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(friendlyMessage(result.message, "Failed to approve contract."));
  }

  return result;
}

export async function requestContractChanges(
  projectId: string,
  data: ContractChangeRequest,
): Promise<ContractResponse> {
  const response = await fetch(
    `/api/client/projects/${projectId}/contract/request-changes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(friendlyMessage(result.message, "Failed to request changes."));
  }

  return result;
}

export async function getContractFeedback(
  projectId: string,
): Promise<ContractChangeFeedbackListResponse> {
  const response = await fetch(
    `/api/client/projects/${projectId}/contract/feedback?PageNumber=1&PageSize=20`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load feedback history.");
  }

  return data;
}
