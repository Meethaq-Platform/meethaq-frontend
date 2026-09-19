import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";

interface BooleanResponse {
  success: boolean;
  message: string;
  data: boolean;
  errors: string[] | null;
}

// Rate-limited on the backend (429) — not documented in the sprint spec but
// present in the live API; fits Module 5's overdue-review handling, so it's
// wired up as a manual "Send Reminder" action rather than left unused.
export async function POST(
  _request: Request,
  {
    params,
  }: { params: Promise<{ id: string; milestoneId: string; submissionId: string }> },
) {
  const { id, milestoneId, submissionId } = await params;

  try {
    const data = await serverApi<BooleanResponse>(
      `/projects/${id}/milestones/${milestoneId}/submissions/${submissionId}/remind`,
      { method: "POST" },
    );

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.status === 401
              ? "Not authenticated."
              : error.status === 429
                ? "A reminder was already sent recently."
                : error.message,
          data: null,
          errors: error.errors,
        },
        { status: error.status },
      );
    }

    console.error(
      "POST /api/projects/[id]/milestones/[milestoneId]/submissions/[submissionId]/remind error:",
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
