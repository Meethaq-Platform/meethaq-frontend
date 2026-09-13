import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestoneResponse } from "@/src/features/contracts/types/contract";

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<MilestoneResponse>(
      `/projects/${id}/contract/milestones/${milestoneId}`,
      { method: "PUT", body: JSON.stringify(body) },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "PUT /api/projects/[id]/contract/milestones/[milestoneId]",
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;

  try {
    const data = await serverApi(
      `/projects/${id}/contract/milestones/${milestoneId}`,
      { method: "DELETE" },
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(
      error,
      "DELETE /api/projects/[id]/contract/milestones/[milestoneId]",
    );
  }
}
