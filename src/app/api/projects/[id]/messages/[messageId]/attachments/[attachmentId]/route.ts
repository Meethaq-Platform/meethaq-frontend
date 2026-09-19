import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

// Streaming auth proxy for chat attachments. See
// files/submissions/.../evidence/[fileId] for the same pattern and rationale.
export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ id: string; messageId: string; attachmentId: string }> },
) {
  const { id, messageId, attachmentId } = await params;

  if (!API_URL) {
    return NextResponse.json(
      { success: false, message: "Server misconfiguration.", data: null, errors: null },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Not authenticated.", data: null, errors: null },
      { status: 401 },
    );
  }

  try {
    const upstream = await fetch(
      `${API_URL}/projects/${id}/messages/${messageId}/attachments/${attachmentId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          message: upstream.status === 404 ? "File not found." : "Failed to load file.",
          data: null,
          errors: null,
        },
        { status: upstream.status },
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/octet-stream",
        "Content-Disposition": upstream.headers.get("Content-Disposition") ?? "inline",
        ...(upstream.headers.get("Content-Length")
          ? { "Content-Length": upstream.headers.get("Content-Length")! }
          : {}),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/projects/[id]/messages/[messageId]/attachments/[attachmentId] error:",
      error,
    );

    return NextResponse.json(
      { success: false, message: "Unable to connect to the server.", data: null, errors: null },
      { status: 500 },
    );
  }
}
