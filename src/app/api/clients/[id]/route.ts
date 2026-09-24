import { NextResponse } from "next/server";
import {
  errorResponse,
  serverApi,
  toAbsoluteUrl,
} from "@/src/features/auth/lib/server-api";
import type { ClientResponse } from "@/src/features/clients/types/client";

function mapClientResponse(data: ClientResponse): ClientResponse {
  return {
    ...data,
    data: data.data
      ? {
          ...data.data,
          clientProfileImage: toAbsoluteUrl(data.data.clientProfileImage),
        }
      : data.data,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await serverApi<ClientResponse>(`/clients/${id}`);

    return NextResponse.json(mapClientResponse(data));
  } catch (error) {
    return errorResponse(error, "GET /api/clients/[id]");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<ClientResponse>(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return NextResponse.json(mapClientResponse(data));
  } catch (error) {
    return errorResponse(error, "PUT /api/clients/[id]");
  }
}
