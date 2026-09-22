import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { DisputeDetailResponse } from "@/src/features/disputes/types/dispute";

// Body is FormData (Category, Description, RequestedResolution,
// EvidenceFiles) passed straight through.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const { id, milestoneId } = await params;
  const formData = await request.formData();

  try {
    const data = await serverApi<DisputeDetailResponse>(
      `/projects/${id}/milestones/${milestoneId}/disputes`,
      { method: "POST", body: formData },
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, "POST /api/projects/[id]/milestones/[milestoneId]/disputes");
  }
}
