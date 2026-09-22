import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestonePaymentResponse } from "@/src/features/payments/types/payment";

// Shared to either project participant. 404 is a normal "not yet eligible"
// state for a milestone that hasn't been accepted — callers treat it as such.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;

  try {
    const data = await serverApi<MilestonePaymentResponse>(
      `/projects/${id}/milestones/${milestoneId}/payments`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "GET /api/projects/[id]/milestones/[milestoneId]/payments",
    );
  }
}
