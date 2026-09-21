import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { DisputeResolutionDecisionResponse } from "@/src/features/disputes/types/dispute";

function errorResponse(error: unknown, action: string) {
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
