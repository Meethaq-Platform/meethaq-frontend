import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type {
  ChangeRequestListResponse,
  ChangeRequestResponse,
} from "@/src/features/change-requests/types/change-request";

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { search } = new URL(request.url);

  try {
    const data = await serverApi<ChangeRequestListResponse>(
      `/projects/${id}/change-requests${search}`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/projects/[id]/change-requests");
  }
}

// Body is FormData (Title, Reason, ProposedScopeChange, ResultingProjectValue,
// MilestonesJson, Attachments) passed straight through.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();

  try {
    const data = await serverApi<ChangeRequestResponse>(
      `/projects/${id}/change-requests`,
      { method: "POST", body: formData },
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, "POST /api/projects/[id]/change-requests");
  }
}
