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
