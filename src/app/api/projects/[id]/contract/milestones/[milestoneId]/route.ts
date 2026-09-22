import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestoneResponse } from "@/src/features/contracts/types/contract";

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
