import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { ContractAmendmentListResponse } from "@/src/features/change-requests/types/change-request";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await serverApi<ContractAmendmentListResponse>(
      `/projects/${id}/contract/amendments`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/projects/[id]/contract/amendments");
  }
}
