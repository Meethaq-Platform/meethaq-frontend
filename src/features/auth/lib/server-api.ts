import "server-only";

import { cookies } from "next/headers";

import { refreshAccessToken } from "./refreshAccessToken";

const API_URL = process.env.API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function serverApi<T>(
  endpoint: string,
  options?: RequestInit,
  isRetry = false,
): Promise<T> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new ApiError("Unauthorized", 401);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
  });

  let data = null;

  const text = await response.text();

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Keep data as null if response isn't JSON
    }
  }

  // Access token expired/invalid → try refresh once
  if (response.status === 401 && !isRetry) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return serverApi<T>(endpoint, options, true);
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || "Something went wrong",
      response.status,
    );
  }

  return data;
}
