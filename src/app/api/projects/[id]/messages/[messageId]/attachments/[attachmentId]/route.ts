import { proxyAuthenticatedFile } from "@/src/features/auth/lib/server-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; messageId: string; attachmentId: string }> },
) {
  const { id, messageId, attachmentId } = await params;

  return proxyAuthenticatedFile(
    `/projects/${id}/messages/${messageId}/attachments/${attachmentId}`,
    "GET /api/projects/[id]/messages/[messageId]/attachments/[attachmentId]",
  );
}
