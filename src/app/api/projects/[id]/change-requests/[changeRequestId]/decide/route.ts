import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { ChangeRequestDecisionResponse } from "@/src/features/change-requests/types/change-request";

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

// Restricted server-side to the counterparty (a requester cannot approve
// their own request).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; changeRequestId: string }> },
) {
  const { id, changeRequestId } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<ChangeRequestDecisionResponse>(
      `/projects/${id}/change-requests/${changeRequestId}/decide`,
      { method: "POST", body: JSON.stringify(body) },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/change-requests/[changeRequestId]/decide",
    );
  }
}
