import {
  ProfileResponse,
  UpdateClientProfileRequest,
  UpdateFreelancerProfileRequest,
} from "../types/profile";

function extractErrorMessage(result: ProfileResponse, fallback: string): string {
  if (Array.isArray(result.errors) && result.errors.length > 0) {
    return result.errors.join(" ");
  }
  return result.message || fallback;
}

export async function getProfile(): Promise<ProfileResponse> {
  const response = await fetch("/api/profile");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get current user profile.");
  }

  return data;
}

export async function updateFreelancerProfile(
  data: UpdateFreelancerProfileRequest,
): Promise<ProfileResponse> {
  const response = await fetch("/api/profile/freelancer", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(extractErrorMessage(result, "Failed to update profile."));
  }

  return result;
}

export async function updateClientProfile(
  data: UpdateClientProfileRequest,
): Promise<ProfileResponse> {
  const response = await fetch("/api/profile/client", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(extractErrorMessage(result, "Failed to update profile."));
  }

  return result;
}
