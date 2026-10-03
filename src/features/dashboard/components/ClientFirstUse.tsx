import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ClientFirstUse as ClientFirstUseDto } from "../types/dashboard";
import FirstUseShell from "./FirstUseShell";

interface ClientFirstUseProps {
  firstUse: ClientFirstUseDto;
  userName: string | null;
}

const CLIENT_STEPS = ["invited", "review", "track"] as const;

// Feature 25. Never grants access on its own — it only surfaces the existing
// pending-invitation acceptance flow (Invitations tab on /projects) when one
// exists, per the sprint rule that the Dashboard must not link/name-match
// its way into a Project. The steps below are explanatory only, not links.
export default function ClientFirstUse({ firstUse, userName }: ClientFirstUseProps) {
  const t = useTranslations("dashboard.firstUse");
  const locale = useLocale();
  const hasInvitations = firstUse.pendingInvitationsCount > 0;

  return (
    <FirstUseShell
      eyebrow={t("eyebrow")}
      title={userName ? t("clientTitle", { name: userName }) : t("clientTitleNoName")}
      subtitle={
        <p dir="auto">{(locale === "en" && firstUse.guidanceMessage) || t("clientGuidance")}</p>
      }
      illustration="/illustrations/idea.svg"
    >
      {hasInvitations && (
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 bg-accent-value hover:opacity-90 mb-8 px-5 py-2.5 rounded-full font-semibold text-on-accent-value text-sm transition motion-safe:hover:-translate-y-px motion-reduce:transition-none"
        >
          <Mail size={15} />
          {t("reviewInvitations", { count: firstUse.pendingInvitationsCount })}
          <ArrowRight size={15} className="rtl-flip" />
        </Link>
      )}

      <h2 className="mb-4 font-semibold text-text-secondary text-xs uppercase tracking-wide">
        {t("clientStepsTitle")}
      </h2>
      <ol className="flex flex-col">
        {CLIENT_STEPS.map((key, index) => (
          <li
            key={key}
            className="before:top-12 before:bottom-1 before:absolute relative flex gap-4 pb-6 last:pb-0 last:before:hidden before:bg-border before:w-px before:inset-s-5"
          >
            <span className="z-10 flex justify-center items-center bg-primary-muted rounded-full size-10 font-numbers font-bold text-[15px] text-primary shrink-0">
              {index + 1}
            </span>
            <div className="pt-1.5 min-w-0">
              <h3 className="font-bold text-[15px] text-text-primary">
                {t(`clientSteps.${key}.title`)}
              </h3>
              <p className="mt-0.5 max-w-[46ch] text-text-secondary text-sm">
                {t(`clientSteps.${key}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </FirstUseShell>
  );
}
