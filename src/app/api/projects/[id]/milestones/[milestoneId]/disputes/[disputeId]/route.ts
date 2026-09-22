import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { DisputeDetailResponse } from "@/src/features/disputes/types/dispute";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string; disputeId: string }> },
) {
  const { id, milestoneId, disputeId } = await params;

  try {
    const data = await serverApi<DisputeDetailResponse>(
      `/projects/${id}/milestones/${milestoneId}/disputes/${disputeId}`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "GET /api/projects/[id]/milestones/[milestoneId]/disputes/[disputeId]",
    );
  }
}
