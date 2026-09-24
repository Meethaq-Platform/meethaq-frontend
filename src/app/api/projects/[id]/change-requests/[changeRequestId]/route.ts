import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { ChangeRequestResponse } from "@/src/features/change-requests/types/change-request";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; changeRequestId: string }> },
) {
  const { id, changeRequestId } = await params;

  try {
    const data = await serverApi<ChangeRequestResponse>(
      `/projects/${id}/change-requests/${changeRequestId}`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/projects/[id]/change-requests/[changeRequestId]");
  }
}
