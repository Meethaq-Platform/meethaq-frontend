import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { ChangeRequestResponse } from "@/src/features/change-requests/types/change-request";

// Restricted server-side to the requesting party.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; changeRequestId: string }> },
) {
  const { id, changeRequestId } = await params;

  try {
    const data = await serverApi<ChangeRequestResponse>(
      `/projects/${id}/change-requests/${changeRequestId}/withdraw`,
      { method: "POST" },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/change-requests/[changeRequestId]/withdraw",
    );
  }
}
