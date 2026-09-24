import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { MilestoneExecutionResponse } from "@/src/features/milestones/types/milestone";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;

  try {
    const data = await serverApi<MilestoneExecutionResponse>(
      `/client/projects/${id}/milestones/${milestoneId}`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/client/projects/[id]/milestones/[milestoneId]");
  }
}
