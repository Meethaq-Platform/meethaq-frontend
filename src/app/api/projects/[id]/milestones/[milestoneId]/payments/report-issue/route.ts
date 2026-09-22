import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestonePaymentResponse } from "@/src/features/payments/types/payment";

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

// Restricted server-side to the owning Freelancer.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<MilestonePaymentResponse>(
      `/projects/${id}/milestones/${milestoneId}/payments/report-issue`,
      { method: "POST", body: JSON.stringify(body) },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/milestones/[milestoneId]/payments/report-issue",
    );
  }
}
