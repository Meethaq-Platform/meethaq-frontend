import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { ProjectResponse } from "@/src/features/projects/types/project";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<ProjectResponse>(`/projects/${id}/client`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "PUT /api/projects/[id]/client");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await serverApi<ProjectResponse>(`/projects/${id}/client`, {
      method: "DELETE",
    });

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "DELETE /api/projects/[id]/client");
  }
}
