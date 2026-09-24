import Link from "next/link";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ClientFirstUse as ClientFirstUseDto } from "../types/dashboard";

interface ClientFirstUseProps {
  firstUse: ClientFirstUseDto;
  userName: string | null;
}

// Feature 25. Never grants access on its own — it only surfaces the existing
// pending-invitation acceptance flow (Invitations tab on /projects) when one
// exists, per the sprint rule that the Dashboard must not link/name-match
// its way into a Project.
export default function ClientFirstUse({ firstUse, userName }: ClientFirstUseProps) {
  const t = useTranslations("dashboard.firstUse");

  return (
    <section className="bg-surface p-6 sm:p-8 border border-border rounded-2xl text-center">
      <h1 className="font-bold text-text-primary text-xl sm:text-2xl">
        {userName ? t("clientTitle", { name: userName }) : t("clientTitleNoName")}
      </h1>
      <p dir="auto" className="mx-auto mt-2 max-w-md text-text-secondary text-sm">
        {firstUse.guidanceMessage ?? t("clientGuidance")}
      </p>

      {firstUse.pendingInvitationsCount > 0 && (
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 bg-primary hover:opacity-90 mt-5 px-4 rounded-xl h-10 font-semibold text-on-primary text-sm transition"
        >
          <Mail size={15} />
          {t("reviewInvitations", { count: firstUse.pendingInvitationsCount })}
        </Link>
      )}
    </section>
  );
}
