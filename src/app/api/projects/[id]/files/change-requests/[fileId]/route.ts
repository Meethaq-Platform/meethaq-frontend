import { proxyAuthenticatedFile } from "@/src/features/auth/lib/server-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  const { id, fileId } = await params;

  return proxyAuthenticatedFile(
    `/projects/${id}/files/change-requests/${fileId}`,
    "GET /api/projects/[id]/files/change-requests/[fileId]",
  );
}
