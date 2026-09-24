import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { DisputeResolutionDecisionResponse } from "@/src/features/disputes/types/dispute";

// Restricted server-side to the user who opened the dispute.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string; disputeId: string }> },
) {
  const { id, milestoneId, disputeId } = await params;

  try {
    const data = await serverApi<DisputeResolutionDecisionResponse>(
      `/projects/${id}/milestones/${milestoneId}/disputes/${disputeId}/withdraw`,
      { method: "POST" },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/withdraw",
    );
  }
}
