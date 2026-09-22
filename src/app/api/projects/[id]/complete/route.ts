import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { ProjectCompletionResponse } from "@/src/features/projects/types/project";

// Restricted server-side to the owning Freelancer.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<ProjectCompletionResponse>(`/projects/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "POST /api/projects/[id]/complete");
  }
}
