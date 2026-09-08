import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { ProjectInvitationAcceptanceResponse } from "@/src/features/client-projects/types/client-project";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await serverApi<ProjectInvitationAcceptanceResponse>(
      `/client/invitations/${id}/accept`,
      { method: "POST" },
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

    console.error("POST /api/client/invitations/[id]/accept error:", error);

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
