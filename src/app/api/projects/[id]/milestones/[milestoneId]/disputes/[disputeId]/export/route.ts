import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

// Streaming auth proxy for the on-demand dispute evidence ZIP export — same
// pattern as the file-proxy routes (serverApi() isn't reusable since it
// JSON-parses the body), just forwarding an attachment Content-Disposition
// for direct browser download via <a href={url} download>.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string; disputeId: string }> },
) {
  const { id, milestoneId, disputeId } = await params;

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
      `${API_URL}/projects/${id}/milestones/${milestoneId}/disputes/${disputeId}/export`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          message: upstream.status === 404 ? "Dispute not found." : "Failed to export evidence.",
          data: null,
          errors: null,
        },
        { status: upstream.status },
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/zip",
        "Content-Disposition":
          upstream.headers.get("Content-Disposition") ??
          `attachment; filename="dispute-${disputeId}-evidence.zip"`,
        ...(upstream.headers.get("Content-Length")
          ? { "Content-Length": upstream.headers.get("Content-Length")! }
          : {}),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/export error:",
      error,
    );

    return NextResponse.json(
      { success: false, message: "Unable to connect to the server.", data: null, errors: null },
      { status: 500 },
    );
  }
}
