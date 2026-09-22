import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { DisputeResolutionProposalResponse } from "@/src/features/disputes/types/dispute";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string; disputeId: string }> },
) {
  const { id, milestoneId, disputeId } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<DisputeResolutionProposalResponse>(
      `/projects/${id}/milestones/${milestoneId}/disputes/${disputeId}/proposals`,
      { method: "POST", body: JSON.stringify(body) },
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/proposals",
    );
  }
}
