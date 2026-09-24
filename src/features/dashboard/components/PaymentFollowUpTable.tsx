import Link from "next/link";
import { ShieldAlert, Wallet } from "lucide-react";
import EmptyState from "@/src/shared/components/EmptyState";
import RelativeTime from "@/src/shared/components/RelativeTime";
import { formatCurrency, getTimeRemaining } from "@/src/shared/lib/format";
import type { PaymentFollowUpItem } from "../types/dashboard";

interface PaymentFollowUpTableProps {
  items: PaymentFollowUpItem[];
  counterpartyLabel: string;
}

// Feature 7 (Freelancer "Payment Follow-Up") / Feature 12 (Client "Payment
// Action List") share this exact DTO shape and rendering — only the section
// heading and the counterparty column label differ per role, both handled by
// the parent. Overdue is only shown when paymentDueDateUtc actually exists,
// per the sprint rule that a missing due date must show elapsed time without
// being labeled overdue.
export default function PaymentFollowUpTable({ items, counterpartyLabel }: PaymentFollowUpTableProps) {
  if (items.length === 0) {
    return <EmptyState icon={Wallet} title="No payments need follow-up." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border border-b text-text-secondary text-xs">
            <th className="py-2 pe-3 font-medium text-start">Milestone</th>
            <th className="py-2 pe-3 font-medium text-start">{counterpartyLabel}</th>
            <th className="py-2 pe-3 font-medium text-end">Amount</th>
            <th className="py-2 pe-3 font-medium text-start">Status</th>
            <th className="py-2 pe-3 font-medium text-start">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isOverdue = !!item.paymentDueDateUtc && getTimeRemaining(item.paymentDueDateUtc).isOverdue;

            return (
              <tr key={item.milestoneId} className="border-border/60 border-b last:border-0 align-top">
                <td className="py-2.5 pe-3">
                  <p className="font-medium text-text-primary">{item.milestoneTitle}</p>
                  <p className="text-text-secondary text-xs">{item.projectName}</p>
                </td>
                <td className="py-2.5 pe-3 text-text-secondary">{item.counterpartyName}</td>
                <td className="py-2.5 pe-3 font-medium text-text-primary text-end tabular-nums">
                  {formatCurrency(item.amount, item.currency ?? "USD")}
                </td>
                <td className="py-2.5 pe-3">
                  <div className="flex flex-col gap-1">
                    {item.isDisputed && (
                      <span className="inline-flex items-center gap-1 text-danger text-xs">
                        <ShieldAlert size={12} /> On dispute hold
                      </span>
                    )}
                    <span className={`text-xs ${isOverdue ? "font-medium text-danger" : "text-text-secondary"}`}>
                      {item.paymentDueDateUtc ? (
                        <>
                          {isOverdue ? "Overdue — due " : "Due "}
                          <RelativeTime value={item.paymentDueDateUtc} />
                        </>
                      ) : (
                        <>
                          Accepted <RelativeTime value={item.acceptanceDateUtc} />
                        </>
                      )}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pe-3">
                  {/* actionNavigationUrl points at a flat /payments page
                      that doesn't exist — payments live on the milestone
                      page, so the link is built from ids instead. */}
                  <Link
                    href={`/projects/${item.projectId}/milestones/${item.milestoneId}`}
                    className="inline-flex items-center bg-surface-muted hover:bg-border/60 px-3 rounded-lg h-8 font-semibold text-text-primary text-xs whitespace-nowrap transition"
                  >
                    {item.actionLabel ?? "Open"}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
