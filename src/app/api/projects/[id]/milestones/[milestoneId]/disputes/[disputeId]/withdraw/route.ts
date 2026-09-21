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
