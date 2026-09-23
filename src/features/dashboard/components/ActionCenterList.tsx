import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RelativeTime from "@/src/shared/components/RelativeTime";
import EmptyState from "@/src/shared/components/EmptyState";
import { CheckCircle2 } from "lucide-react";
import StatusPill from "./StatusPill";
import type { ActionCenterItem } from "../types/dashboard";

const urgencyTone: Record<number, "neutral" | "info" | "warning" | "danger"> = {
  1: "neutral",
  2: "info",
  3: "warning",
  4: "danger",
};

interface ActionCenterListProps {
  items: ActionCenterItem[];
  emptyMessage: string;
}

// Feature 3 / 4: "Needs Your Attention" for both roles — the same DTO shape
// drives both since ownership/urgency/action metadata is fully backend-
// computed. Ownership is split by which timestamp is populated
// (deadlineUtc = the current user owes an action; waitingSinceUtc = the
// counterparty does) rather than the raw, undocumented ownershipType ordinal
// — see types/dashboard.ts for why. This also directly satisfies the sprint
// rule that an overdue *client* review must never be presented as the
// freelancer's own submission task: that item arrives with waitingSinceUtc
// set (someone else is late), not deadlineUtc, so it always lands in
// "Waiting" regardless of raw enum plumbing.
export default function ActionCenterList({ items, emptyMessage }: ActionCenterListProps) {
  if (items.length === 0) {
    return (
      <EmptyState icon={CheckCircle2} title={emptyMessage} description="Nothing needs your attention right now." />
    );
  }

  const yourAction = items.filter((item) => item.deadlineUtc || !item.waitingSinceUtc);
  const waiting = items.filter((item) => item.waitingSinceUtc && !item.deadlineUtc);

  return (
    <div className="flex flex-col gap-5">
      {yourAction.length > 0 && (
        <ActionGroup title="Your Action Required" items={yourAction} />
      )}
      {waiting.length > 0 && (
        <ActionGroup title="Waiting for the Other Party" items={waiting} muted />
      )}
    </div>
  );
}

function ActionGroup({
  title,
  items,
  muted = false,
}: {
  title: string;
  items: ActionCenterItem[];
  muted?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-2 font-medium text-text-secondary text-xs uppercase tracking-wide">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.actionId ?? `${item.relatedEntityType}-${item.relatedEntityId}`}
            className={`flex flex-wrap items-center gap-3 p-3 border border-border rounded-xl ${muted ? "opacity-80" : ""}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {item.priorityBadge && (
                  <StatusPill text={item.priorityBadge} tone={urgencyTone[item.urgencyLevel] ?? "neutral"} />
                )}
                <span className="font-medium text-text-primary text-sm truncate">
                  {item.relatedRecordTitle ?? item.actionType}
                </span>
              </div>

              <p className="text-text-secondary text-xs">
                {item.projectName}
                {item.counterpartyName ? ` · ${item.counterpartyName}` : ""}
                {item.amount != null && item.currency ? ` · ${item.currency} ${item.amount.toLocaleString()}` : ""}
              </p>

              {(item.deadlineUtc || item.waitingSinceUtc) && (
                <p className="mt-1 text-text-secondary text-xs">
                  {item.deadlineUtc ? (
                    <>
                      Due <RelativeTime value={item.deadlineUtc} />
                    </>
                  ) : (
                    <>
                      Waiting since <RelativeTime value={item.waitingSinceUtc!} />
                    </>
                  )}
                </p>
              )}
            </div>

            {item.actionButtonText && (
              // The backend's actionNavigationUrl points at pages this app
              // doesn't have (e.g. /action-center/{id}) — projectId always
              // resolves to a real page, so every action opens there instead.
              <Link
                href={`/projects/${item.projectId}`}
                className="flex items-center gap-1 bg-primary hover:opacity-90 px-3 rounded-lg h-9 font-semibold text-white text-xs whitespace-nowrap transition shrink-0"
              >
                {item.actionButtonText}
                <ArrowRight size={13} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
