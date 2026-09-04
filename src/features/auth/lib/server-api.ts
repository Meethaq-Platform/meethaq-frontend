import "server-only";

import { cookies } from "next/headers";

import { refreshAccessToken } from "./refreshAccessToken";

const API_URL = process.env.API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: string[] | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function extractErrorMessage(data: Record<string, unknown> | null): string {
  if (!data) return "Something went wrong";
  if (typeof data.message === "string") return data.message;
  if (typeof data.title === "string") return data.title;
  return "Something went wrong";
}

// ASP.NET's ProblemDetails validation shape is { errors: { Field: ["msg", ...] } }.
function extractErrorList(data: Record<string, unknown> | null): string[] | null {
  if (!data || !data.errors) return null;
  if (Array.isArray(data.errors)) return data.errors;
  if (typeof data.errors === "object") {
    return Object.values(data.errors as Record<string, string[]>).flat();
  }
  return null;
}

export async function serverApi<T>(
  endpoint: string,
  options?: RequestInit,
  isRetry = false,
): Promise<T> {
  if (!API_URL) {
    throw new Error("API_URL environment variable is not set");
  }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new ApiError("Unauthorized", 401);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
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
      extractErrorMessage(data),
      response.status,
      extractErrorList(data),
    );
  }

  return data;
}
