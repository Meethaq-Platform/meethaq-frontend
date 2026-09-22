import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { DisputeResolutionDecisionResponse } from "@/src/features/disputes/types/dispute";

// Restricted server-side to the counterparty (a proposer cannot accept on
// their own behalf).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string; disputeId: string }> },
) {
  const { id, milestoneId, disputeId } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<DisputeResolutionDecisionResponse>(
      `/projects/${id}/milestones/${milestoneId}/disputes/${disputeId}/decide-resolution`,
      { method: "POST", body: JSON.stringify(body) },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/decide-resolution",
    );
  }
}
