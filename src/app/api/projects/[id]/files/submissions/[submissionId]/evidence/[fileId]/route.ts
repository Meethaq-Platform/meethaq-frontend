import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

// Streaming auth proxy for submission evidence files. serverApi() isn't
// reused here since it parses the response body as JSON; this route needs
// the raw bytes/headers instead. SubmissionEvidenceFile.downloadUrl from the
// backend is never used directly by the client — every consumer builds this
// same BFF-relative path from (projectId, submissionId, fileId) instead, so
// a leaked link can't bypass auth.
export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ id: string; submissionId: string; fileId: string }> },
) {
  const { id, submissionId, fileId } = await params;

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
      `${API_URL}/projects/${id}/files/submissions/${submissionId}/evidence/${fileId}`,
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
      "GET /api/projects/[id]/files/submissions/[submissionId]/evidence/[fileId] error:",
      error,
    );

    return NextResponse.json(
      { success: false, message: "Unable to connect to the server.", data: null, errors: null },
      { status: 500 },
    );
  }
}
