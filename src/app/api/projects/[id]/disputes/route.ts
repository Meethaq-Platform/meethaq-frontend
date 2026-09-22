import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { DisputeListResponse } from "@/src/features/disputes/types/dispute";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { search } = new URL(request.url);

  try {
    const data = await serverApi<DisputeListResponse>(`/projects/${id}/disputes${search}`);

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/projects/[id]/disputes");
  }
}
