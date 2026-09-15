"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { useInvitation } from "../hooks/useInvitation";
import { useAcceptInvitation } from "../hooks/useAcceptInvitation";
import { ProjectStatusBadge } from "@/src/features/projects/components/ProjectStatusBadge";
import Button from "@/src/shared/components/Button";
import ConfirmModal from "@/src/shared/components/ConfirmModal";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

interface InvitationDetailPageProps {
  invitationId: string;
}

export default function InvitationDetailPage({
  invitationId,
}: InvitationDetailPageProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useInvitation(invitationId);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const acceptInvitation = useAcceptInvitation(invitationId);

  return (
    <div className="space-y-6 mx-auto h-full">
      <div className="flex justify-between items-center">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {data && (
          <Button
            type="button"
            onClick={() => setIsAcceptOpen(true)}
            className="flex items-center gap-1.5 h-9"
          >
            <Check size={14} />
            Accept Invitation
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message="Failed to load this invitation."
          onRetry={() => refetch()}
        />
      ) : (
        <section className="space-y-6">
          <div className="flex sm:flex-row flex-col justify-between items-start gap-4 bg-surface p-6 border border-border rounded-2xl">
            <div className="flex-1">
              <h1 className="font-semibold text-text-primary text-lg">
                {data.title}
              </h1>
              <p className="mt-2 text-text-primary text-sm whitespace-pre-wrap">
                {data.description ?? "—"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 w-fit shrink-0">
              <ProjectStatusBadge status={data.status} />
              <p className="text-text-secondary text-sm text-right">
                Invited {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="bg-surface p-6 border border-border rounded-2xl">
            <p className="mb-2 text-text-secondary text-xs uppercase tracking-wide">
              Freelancer
            </p>
            <p className="text-text-primary text-sm">{data.freelancerName}</p>
          </div>
        </section>
      )}

      {data && (
        <ConfirmModal
          open={isAcceptOpen}
          onClose={() => setIsAcceptOpen(false)}
          onConfirm={() =>
            acceptInvitation.mutate(undefined, {
              onSuccess: () => router.push(`/projects/${data.id}`),
            })
          }
          title="Accept this invitation?"
          description={`This will start "${data.title}" with ${data.freelancerName}.`}
          confirmLabel="Yes, accept"
          confirmingLabel="Accepting..."
          variant="primary"
          isConfirming={acceptInvitation.isPending}
          errorMessage={
            acceptInvitation.isError
              ? acceptInvitation.error instanceof Error
                ? acceptInvitation.error.message
                : "Failed to accept invitation."
              : undefined
          }
        />
      )}
    </div>
  );
}
