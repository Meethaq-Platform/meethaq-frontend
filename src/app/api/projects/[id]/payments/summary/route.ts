import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { ProjectPaymentSummaryResponse } from "@/src/features/payments/types/payment";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await serverApi<ProjectPaymentSummaryResponse>(
      `/projects/${id}/payments/summary`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/projects/[id]/payments/summary");
  }
}
