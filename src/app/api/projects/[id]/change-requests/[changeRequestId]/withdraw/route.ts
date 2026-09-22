import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { ChangeRequestResponse } from "@/src/features/change-requests/types/change-request";

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

// Restricted server-side to the requesting party.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; changeRequestId: string }> },
) {
  const { id, changeRequestId } = await params;

  try {
    const data = await serverApi<ChangeRequestResponse>(
      `/projects/${id}/change-requests/${changeRequestId}/withdraw`,
      { method: "POST" },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/change-requests/[changeRequestId]/withdraw",
    );
  }
}
