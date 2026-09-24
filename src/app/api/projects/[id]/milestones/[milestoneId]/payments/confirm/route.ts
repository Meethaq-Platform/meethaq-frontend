import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestonePaymentResponse } from "@/src/features/payments/types/payment";

// Restricted server-side to the owning Freelancer.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;

  try {
    const data = await serverApi<MilestonePaymentResponse>(
      `/projects/${id}/milestones/${milestoneId}/payments/confirm`,
      { method: "POST" },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/milestones/[milestoneId]/payments/confirm",
    );
  }
}
