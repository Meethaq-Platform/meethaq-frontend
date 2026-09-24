import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { ContractAmendmentResponse } from "@/src/features/change-requests/types/change-request";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; amendmentId: string }> },
) {
  const { id, amendmentId } = await params;

  try {
    const data = await serverApi<ContractAmendmentResponse>(
      `/projects/${id}/contract/amendments/${amendmentId}`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/projects/[id]/contract/amendments/[amendmentId]");
  }
}
