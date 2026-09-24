import { proxyAuthenticatedFile } from "@/src/features/auth/lib/server-api";

export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ id: string; submissionId: string; fileId: string }> },
) {
  const { id, submissionId, fileId } = await params;

  return proxyAuthenticatedFile(
    `/projects/${id}/files/submissions/${submissionId}/evidence/${fileId}`,
    "GET /api/projects/[id]/files/submissions/[submissionId]/evidence/[fileId]",
  );
}
