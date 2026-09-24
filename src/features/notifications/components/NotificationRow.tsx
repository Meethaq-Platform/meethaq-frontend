import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  FileEdit,
  MessageSquare,
  MessageSquareWarning,
  PartyPopper,
  ShieldAlert,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Notification } from "../types/notification";
import RelativeTime from "@/src/shared/components/RelativeTime";
import { useEventText } from "@/src/shared/hooks/useEventText";
import { eventToneClasses, getEventTone } from "@/src/shared/lib/eventTone";

// eventType is a plain string on the backend (no enum values listed in
// swagger) — this map is a best-effort guess at casing; any unrecognized
// value falls back to a generic bell icon rather than breaking the row.
const eventIcons: Record<string, LucideIcon> = {
  NewProjectMessage: MessageSquare,
  MilestoneSubmitted: Upload,
  RevisionRequested: MessageSquareWarning,
  DeliverableAccepted: CheckCircle2,
  MilestoneDeadlineApproaching: CalendarClock,
  ReviewDeadlineApproaching: Clock,
  ReviewOverdue: AlertTriangle,
  PaymentEligible: CreditCard,
  PaymentEvidenceSubmitted: CreditCard,
  PaymentEvidenceUpdated: CreditCard,
  ContractAmendmentCreated: FileEdit,
  PaymentReceiptConfirmed: CheckCircle2,
  PaymentIssueReported: AlertTriangle,
  ChangeRequestSubmitted: FileEdit,
  ChangeRequestApproved: FileEdit,
  ChangeRequestRejected: FileEdit,
  ChangeRequestWithdrawn: FileEdit,
  ChangeRequestDecided: FileEdit,
  DisputeOpened: ShieldAlert,
  DisputeEvidenceAdded: ShieldAlert,
  DisputeResolutionProposed: ShieldAlert,
  DisputeResolved: ShieldAlert,
  ProjectCompleted: PartyPopper,
};

interface NotificationRowProps {
  notification: Notification;
  onOpen: (id: number) => void;
}

export function NotificationRow({ notification, onOpen }: NotificationRowProps) {
  const Icon = eventIcons[notification.eventType] ?? Bell;
  const eventText = useEventText();
  const translated = eventText.isTranslated(notification.eventType);
  const tone = getEventTone(notification.eventType);

  return (
    <Link
      href={notification.actionUrl}
      onClick={() => onOpen(notification.notificationId)}
      className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-muted transition ${
        notification.isRead ? "" : "bg-primary-muted/40"
      }`}
    >
      <div
        className={`flex justify-center items-center mt-0.5 rounded-full w-8 h-8 shrink-0 ${eventToneClasses[tone]}`}
      >
        <Icon size={14} />
      </div>

      <div className="flex-1 min-w-0">
        {/* Title and message come from the API in English; other languages
            build them from eventType and keep the English message (which
            carries the names) as a small detail line. */}
        <p dir="auto" className="font-medium text-text-primary text-sm">
          {eventText.notificationTitle(notification.eventType, notification.title)}
        </p>
        <p dir="auto" className="text-text-secondary text-sm">
          {eventText.sentence(notification.eventType, notification.message, {
            nameSource: notification.title,
          })}
        </p>
        {translated && (
          <p className="mt-0.5 text-text-secondary/80 text-xs">
            <bdi>{notification.message}</bdi>
          </p>
        )}
        <p className="mt-0.5 text-text-secondary text-xs">
          <RelativeTime value={notification.createdAt} />
        </p>
      </div>

      {!notification.isRead && (
        <span className="bg-primary mt-2 rounded-full w-2 h-2 shrink-0" />
      )}
    </Link>
  );
}
