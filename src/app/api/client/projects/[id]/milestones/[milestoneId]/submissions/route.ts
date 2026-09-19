import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { WorkSubmissionListResponse } from "@/src/features/submissions/types/submission";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;

  try {
    const data = await serverApi<WorkSubmissionListResponse>(
      `/client/projects/${id}/milestones/${milestoneId}/submissions`,
    );

    return NextResponse.json(data);
  } catch (error) {
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

    console.error(
      "GET /api/client/projects/[id]/milestones/[milestoneId]/submissions error:",
      error,
    );

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
}
