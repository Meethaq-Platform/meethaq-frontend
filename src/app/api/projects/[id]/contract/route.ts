import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type { ContractResponse } from "@/src/features/contracts/types/contract";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await serverApi<ContractResponse>(`/projects/${id}/contract`);

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/projects/[id]/contract");
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<ContractResponse>(`/projects/${id}/contract`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, "POST /api/projects/[id]/contract");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const data = await serverApi<ContractResponse>(`/projects/${id}/contract`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "PUT /api/projects/[id]/contract");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await serverApi(`/projects/${id}/contract`, {
      method: "DELETE",
    });

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "DELETE /api/projects/[id]/contract");
  }
}
