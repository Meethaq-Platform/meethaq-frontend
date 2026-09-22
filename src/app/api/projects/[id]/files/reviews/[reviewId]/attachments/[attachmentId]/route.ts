import { proxyAuthenticatedFile } from "@/src/features/auth/lib/server-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; reviewId: string; attachmentId: string }> },
) {
  const { id, reviewId, attachmentId } = await params;

  return proxyAuthenticatedFile(
    `/projects/${id}/files/reviews/${reviewId}/attachments/${attachmentId}`,
    "GET /api/projects/[id]/files/reviews/[reviewId]/attachments/[attachmentId]",
  );
}
