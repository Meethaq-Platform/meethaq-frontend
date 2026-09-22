import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  href?: string | null;
  icon?: LucideIcon;
  tone?: "neutral" | "warning" | "danger" | "success";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  neutral: "text-text-primary",
  warning: "text-warning",
  danger: "text-danger",
  success: "text-success",
};

// A count that links back to the filtered records behind it — satisfies the
// shared dashboard rule that every summary card opens the records it summarizes.
export default function StatCard({
  label,
  value,
  href,
  icon: Icon,
  tone = "neutral",
}: StatCardProps) {
  const content = (
    <>
      <div className="flex justify-between items-center gap-2">
        <span className="text-text-secondary text-xs">{label}</span>
        {Icon && <Icon size={14} className="text-text-secondary shrink-0" />}
      </div>
      <span className={`font-semibold text-xl sm:text-2xl ${toneStyles[tone]}`}>
        {value}
      </span>
    </>
  );

  const className =
    "flex flex-col gap-1 bg-surface-muted p-3 rounded-xl transition min-w-0";

  if (href) {
    return (
      <Link href={href} className={`${className} hover:bg-border/60`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
