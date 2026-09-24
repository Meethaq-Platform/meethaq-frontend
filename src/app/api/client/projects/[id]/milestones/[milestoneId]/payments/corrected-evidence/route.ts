import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestonePaymentResponse } from "@/src/features/payments/types/payment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;
  const formData = await request.formData();

  try {
    const data = await serverApi<MilestonePaymentResponse>(
      `/client/projects/${id}/milestones/${milestoneId}/payments/corrected-evidence`,
      { method: "POST", body: formData },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/client/projects/[id]/milestones/[milestoneId]/payments/corrected-evidence",
    );
  }
}
