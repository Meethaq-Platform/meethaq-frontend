// Generic pill for the dashboard DTOs' loosely-typed status strings
// (disputeStatus, executionStatus, category, ...) that don't line up with an
// existing strongly-typed badge component's union. Falls back to a neutral
// tone plus the raw string rather than guessing a mapping.
const toneStyles: Record<string, string> = {
  neutral: "bg-surface-muted text-text-secondary",
  info: "bg-info-muted text-info",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
  success: "bg-success-muted text-success",
};

interface StatusPillProps {
  text: string;
  tone?: keyof typeof toneStyles;
}

export default function StatusPill({ text, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneStyles[tone] ?? toneStyles.neutral}`}
    >
      {text}
    </span>
  );
}
