import { ProfileResponse } from "../types/profile";

export async function getProfile(): Promise<ProfileResponse> {
  const response = await fetch("/api/profile");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get current user profile.");
  }

  return data;
}
