import Link from "next/link";
import {
  Activity,
  Bell,
  CheckCircle2,
  CreditCard,
  FileEdit,
  MessageSquareWarning,
  PartyPopper,
  PlayCircle,
  ShieldAlert,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import EmptyState from "@/src/shared/components/EmptyState";
import RelativeTime from "@/src/shared/components/RelativeTime";
import { eventToneClasses, getEventTone } from "@/src/shared/lib/eventTone";
import type { RecentActivityItem } from "../types/dashboard";
import { useEventText } from "@/src/shared/hooks/useEventText";

// eventType is a plain backend string (no enum values in swagger) — same
// best-effort casing convention already used by the notifications feature's
// eventIcons map. Unrecognized values fall back to a generic activity icon.
const eventIcons: Record<string, LucideIcon> = {
  ContractSent: FileEdit,
  ContractApproved: CheckCircle2,
  MilestoneStarted: PlayCircle,
  DeliverableSubmitted: Upload,
  RevisionRequested: MessageSquareWarning,
  DeliverableAccepted: CheckCircle2,
  PaymentRecorded: CreditCard,
  PaymentConfirmed: CreditCard,
  ChangeRequestApproved: FileEdit,
  DisputeOpened: ShieldAlert,
  DisputeResolved: ShieldAlert,
  ProjectCompleted: PartyPopper,
};

interface RecentActivityFeedProps {
  items: RecentActivityItem[];
}

// Feature 21 — reads the existing activity history, never synthesizes events.
export default function RecentActivityFeed({ items }: RecentActivityFeedProps) {
  const t = useTranslations("dashboard.recentActivity");
  const eventText = useEventText();

  if (items.length === 0) {
    return <EmptyState icon={Activity} title={t("empty")} />;
  }

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = (item.eventType && eventIcons[item.eventType]) || Bell;
        const tone = getEventTone(item.eventType);

        const row = (
          <div className="flex items-start gap-3 py-2.5">
            <div
              className={`flex justify-center items-center mt-0.5 rounded-full w-8 h-8 shrink-0 ${eventToneClasses[tone]}`}
            >
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p dir="auto" className="text-text-primary text-sm">
                {eventText.sentence(item.eventType, item.description)}
              </p>
              <p className="text-text-secondary text-xs">
                <bdi>{item.projectName}</bdi>
                {item.performedByName ? (
                  <>
                    {" · "}
                    <bdi>{item.performedByName}</bdi>
                  </>
                ) : null}
                {" · "}
                <RelativeTime value={item.timestampUtc} />
              </p>
            </div>
          </div>
        );

        // The backend's navigationUrl doesn't reliably resolve to a page in
        // this app, but every event carries the project it happened on —
        // that always opens.
        return (
          <li key={item.eventId}>
            <Link
              href={`/projects/${item.projectId}`}
              className="block hover:bg-surface-muted -mx-1 px-1 rounded-lg transition"
            >
              {row}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
