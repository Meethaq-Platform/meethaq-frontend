import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CreditCard,
  FileCheck2,
  FileText,
  FolderPlus,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WelcomeSummary } from "../types/dashboard";

// Shared with FreelancerDashboard/ClientDashboard, which set this id on the
// "Needs Your Attention" section so the summary line below can jump to it.
export const NEEDS_ATTENTION_ANCHOR_ID = "needs-your-attention";

interface WelcomeHeaderProps {
  welcome: WelcomeSummary;
  pendingActionsCount?: number;
}

// The backend's QuickActionShortcutDto.icon string doesn't line up with any
// lucide-react export name (it always fell back to a generic icon in
// practice), so each button's icon is picked from its exact label instead —
// these are the fixed label set from the sprint doc's Quick Actions examples
// (Freelancer: Create Project/Add Client/Open Projects/Open Clients; Client:
// Review Deliverables/Review Contracts/Open Projects/View Payments).
const iconsByLabel: Record<string, LucideIcon> = {
  "create project": FolderPlus,
  "add client": UserPlus,
  "open projects": Briefcase,
  "open clients": Users,
  "review deliverables": FileCheck2,
  "review contracts": FileText,
  "view payments": CreditCard,
};

// Only these shortcuts show here — "Open Projects" for both roles and "Open
// Clients" for freelancers (clients have no Clients page). Filtering by
// label rather than array position means each role naturally gets the right
// count (2 for freelancer, 1 for client) without branching on role here.
const VISIBLE_QUICK_ACTION_LABELS = new Set(["open projects", "open clients"]);

function resolveIcon(
  label: string | null,
  iconHint: string | null,
): LucideIcon {
  const byLabel = label && iconsByLabel[label.trim().toLowerCase()];
  if (byLabel) return byLabel;

  if (iconHint) {
    const icon = Icons[iconHint as keyof typeof Icons];
    if (typeof icon === "function") return icon as LucideIcon;
  }

  return Sparkles;
}

// Feature 2: personalized welcome + primary quick actions. Icon/label/url for
// each shortcut come straight from the backend's QuickActionShortcutDto, so
// role-specific action sets (Create Project vs Review Deliverables) need no
// branching here.
export default function WelcomeHeader({
  welcome,
  pendingActionsCount = 0,
}: WelcomeHeaderProps) {
  const today = new Date(welcome.currentDateUtc).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative flex flex-col justify-between bg-surface p-5 sm:p-6 border border-border rounded-2xl h-full">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <p className="text-text-secondary text-sm">{today}</p>
          <h1 className="mt-1 font-bold text-text-primary text-xl sm:text-2xl">
            Welcome back, {welcome.userName?.split(" ")[0] ?? "there"}{" "}
            <span className="md:hidden">👋</span>
          </h1>
          {welcome.summaryText && (
            <p className="mt-2 max-w-2xl text-sm text-accent-value">
              {welcome.summaryText}
            </p>
          )}

          {pendingActionsCount > 0 && (
            <Link
              href={`#${NEEDS_ATTENTION_ANCHOR_ID}`}
              className="inline-flex items-center gap-1 mt-2 font-semibold text-primary text-sm hover:underline"
            >
              Review what needs your attention
              <ArrowRight size={13} className="rtl-flip" />
            </Link>
          )}
        </div>

        <Image
          src="/illustrations/Hello.svg"
          alt=""
          width={200}
          height={200}
          className="hidden lg:hidden md:block xl:block top-5 inset-e-5 absolute shrink-0"
        />
      </div>

      {welcome.quickActions && welcome.quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {welcome.quickActions
            .filter((action) =>
              VISIBLE_QUICK_ACTION_LABELS.has(
                (action.label ?? "").trim().toLowerCase(),
              ),
            )
            .map((action) => {
              if (!action.navigationUrl) return null;
              const Icon = resolveIcon(action.label, action.icon);

              return (
                <Link
                  key={action.key ?? action.label}
                  href={action.navigationUrl}
                  className="flex items-center gap-2 hover:opacity-90 px-4 rounded-xl h-10 font-semibold text-on-accent-value text-sm transition bg-accent-value"
                >
                  <Icon size={15} />
                  {action.label}
                </Link>
              );
            })}
        </div>
      )}
    </section>
  );
}
