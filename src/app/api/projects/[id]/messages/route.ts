import { NextResponse } from "next/server";
import { errorResponse, serverApi } from "@/src/features/auth/lib/server-api";
import type {
  ChatMessageListResponse,
  ChatMessageResponse,
} from "@/src/features/project-chat/types/message";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { search } = new URL(request.url);

  try {
    const data = await serverApi<ChatMessageListResponse>(
      `/projects/${id}/messages${search}`,
    );

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "GET /api/projects/[id]/messages");
  }
}

// Body is FormData (content, files).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();

  try {
    const data = await serverApi<ChatMessageResponse>(`/projects/${id}/messages`, {
      method: "POST",
      body: formData,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, "POST /api/projects/[id]/messages");
  }
}
