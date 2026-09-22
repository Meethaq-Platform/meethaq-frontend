import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

// The backend returns file paths (e.g. profile images) relative to its own
// origin, not the "/api" base — resolve them to absolute URLs the browser can load.
export function toAbsoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_URL) return path;

  const origin = new URL(API_URL).origin;
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
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

  // Let fetch set the multipart boundary itself for FormData bodies.
  const isFormData = options?.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

// Standard catch-block handler for every BFF route: an ApiError carries the
// upstream status/message through as-is, anything else (network failure,
// bad JSON, etc.) becomes a generic 500.
export function errorResponse(error: unknown, action: string) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.status === 401 ? "Not authenticated." : error.message,
        data: null,
        errors: error.errors,
      },
      { status: error.status },
    );
  }

  console.error(`${action} error:`, error);

  return NextResponse.json(
    {
      success: false,
      message: "Unable to connect to the server.",
      data: null,
      errors: null,
    },
    { status: 500 },
  );
}

// Streaming auth proxy for a file behind the backend (evidence, receipts,
// attachments, etc.). serverApi() isn't reused here since it parses the
// response body as JSON; this needs the raw bytes/headers instead. Callers
// build this BFF-relative path from IDs rather than exposing the backend's
// own file URL, so a leaked link can't bypass auth.
export async function proxyAuthenticatedFile(
  upstreamPath: string,
  logLabel: string,
  options?: {
    notFoundMessage?: string;
    defaultContentType?: string;
    defaultContentDisposition?: string;
  },
): Promise<Response> {
  if (!API_URL) {
    return NextResponse.json(
      { success: false, message: "Server misconfiguration.", data: null, errors: null },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Not authenticated.", data: null, errors: null },
      { status: 401 },
    );
  }

  try {
    const upstream = await fetch(`${API_URL}${upstreamPath}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            upstream.status === 404
              ? (options?.notFoundMessage ?? "File not found.")
              : "Failed to load file.",
          data: null,
          errors: null,
        },
        { status: upstream.status },
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ??
          options?.defaultContentType ??
          "application/octet-stream",
        "Content-Disposition":
          upstream.headers.get("Content-Disposition") ??
          options?.defaultContentDisposition ??
          "inline",
        ...(upstream.headers.get("Content-Length")
          ? { "Content-Length": upstream.headers.get("Content-Length")! }
          : {}),
      },
    });
  } catch (error) {
    console.error(`${logLabel} error:`, error);

    return NextResponse.json(
      { success: false, message: "Unable to connect to the server.", data: null, errors: null },
      { status: 500 },
    );
  }
}
