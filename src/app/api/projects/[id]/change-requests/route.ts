import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type {
  ChangeRequestListResponse,
  ChangeRequestResponse,
} from "@/src/features/change-requests/types/change-request";

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
