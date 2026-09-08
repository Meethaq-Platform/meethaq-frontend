import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";
import type { ProjectResponse } from "@/src/features/projects/types/project";

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
