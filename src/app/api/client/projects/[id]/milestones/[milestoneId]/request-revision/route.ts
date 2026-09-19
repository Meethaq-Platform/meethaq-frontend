import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestoneExecutionResponse } from "@/src/features/milestones/types/milestone";

// Body is FormData (SubmissionId, Reason, RequiredChanges, optional Files).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;
  const formData = await request.formData();

  try {
    const data = await serverApi<MilestoneExecutionResponse>(
      `/client/projects/${id}/milestones/${milestoneId}/request-revision`,
      { method: "POST", body: formData },
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
      "POST /api/client/projects/[id]/milestones/[milestoneId]/request-revision error:",
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
