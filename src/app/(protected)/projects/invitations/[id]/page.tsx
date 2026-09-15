import InvitationDetailPage from "@/src/features/client-projects/components/InvitationDetailPage";

export default async function InvitationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <InvitationDetailPage invitationId={id} />;
}
