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
