"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "@/src/shared/lib/format";

import { useInvitation } from "../hooks/useInvitation";
import { usePageTitle } from "@/src/shared/hooks/usePageTitle";
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
  const t = useTranslations("clientProjects.invitation");
  const tProjects = useTranslations("projects.detail");
  const locale = useLocale();
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useInvitation(invitationId);
  const tPageTitles = useTranslations("pageTitles");
  usePageTitle(data ? tPageTitles("project", { title: data.title }) : undefined);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const acceptInvitation = useAcceptInvitation(invitationId);

  return (
    <div className="space-y-6 mx-auto h-full">
      <div className="flex justify-between items-center">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition"
        >
          <ArrowLeft size={16} className="rtl-flip" />
          {tProjects("back")}
        </Link>

        {data && (
          <Button
            type="button"
            onClick={() => setIsAcceptOpen(true)}
            className="flex items-center gap-1.5 h-9"
          >
            <Check size={14} />
            {t("accept")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message={t("loadFailed")}
          onRetry={() => refetch()}
        />
      ) : (
        <section className="space-y-6">
          <div className="flex sm:flex-row flex-col justify-between items-start gap-4 bg-surface p-6 border border-border rounded-2xl">
            <div className="flex-1">
              <h1 dir="auto" className="font-semibold text-text-primary text-lg">
                {data.title}
              </h1>
              <p dir={data.description ? "auto" : undefined} className="mt-2 text-text-primary text-sm whitespace-pre-wrap">
                {data.description ?? "—"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 w-fit shrink-0">
              <ProjectStatusBadge status={data.status} />
              <p className="text-text-secondary text-sm text-end">
                {t("invited", {
                  // English keeps the browser-default date format it always had.
                  date:
                    locale === "ar"
                      ? formatDate(data.createdAt, locale)
                      : new Date(data.createdAt).toLocaleDateString(),
                })}
              </p>
            </div>
          </div>

          <div className="bg-surface p-6 border border-border rounded-2xl">
            <p className="mb-2 text-text-secondary text-xs uppercase tracking-wide">
              {t("freelancer")}
            </p>
            <p dir="auto" className="text-text-primary text-sm">{data.freelancerName}</p>
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
          title={t("confirmTitle")}
          description={t.rich("confirmDescription", {
            title: data.title,
            name: data.freelancerName,
            bdi: (chunks) => <bdi>{chunks}</bdi>,
          })}
          confirmLabel={t("confirm")}
          confirmingLabel={t("confirming")}
          variant="primary"
          isConfirming={acceptInvitation.isPending}
          errorMessage={
            acceptInvitation.isError
              ? acceptInvitation.error instanceof Error
                ? acceptInvitation.error.message
                : t("failed")
              : undefined
          }
        />
      )}
    </div>
  );
}
