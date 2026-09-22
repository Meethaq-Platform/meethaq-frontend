import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { DisputeEvidenceItemResponse } from "@/src/features/disputes/types/dispute";

// Body is FormData (Description, ExternalUrl, EvidenceFile) passed through.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string; disputeId: string }> },
) {
  const { id, milestoneId, disputeId } = await params;
  const formData = await request.formData();

  try {
    const data = await serverApi<DisputeEvidenceItemResponse>(
      `/projects/${id}/milestones/${milestoneId}/disputes/${disputeId}/evidence`,
      { method: "POST", body: formData },
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return errorResponse(
      error,
      "POST /api/projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/evidence",
    );
  }
}
