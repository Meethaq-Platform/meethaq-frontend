import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestonePaymentResponse } from "@/src/features/payments/types/payment";

// Body is FormData (payment method/date/amount/currency/reference/notes +
// receipt files) passed straight through — serverApi auto-skips
// Content-Type so the browser sets the multipart boundary itself.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;
  const formData = await request.formData();

  try {
    const data = await serverApi<MilestonePaymentResponse>(
      `/client/projects/${id}/milestones/${milestoneId}/payments`,
      { method: "POST", body: formData },
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/client/projects/[id]/milestones/[milestoneId]/payments",
    );
  }
}
