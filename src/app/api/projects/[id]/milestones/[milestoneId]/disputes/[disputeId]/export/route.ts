import { proxyAuthenticatedFile } from "@/src/features/auth/lib/server-api";

// Forwards an attachment Content-Disposition for direct browser download via
// <a href={url} download>, falling back to a generated filename if the
// backend doesn't set one.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string; disputeId: string }> },
) {
  const { id, milestoneId, disputeId } = await params;

  return proxyAuthenticatedFile(
    `/projects/${id}/milestones/${milestoneId}/disputes/${disputeId}/export`,
    "GET /api/projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/export",
    {
      notFoundMessage: "Dispute not found.",
      defaultContentType: "application/zip",
      defaultContentDisposition: `attachment; filename="dispute-${disputeId}-evidence.zip"`,
    },
  );
}
