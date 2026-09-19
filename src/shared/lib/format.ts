export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const RELATIVE_UNITS: { limit: number; divisor: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { limit: 60, divisor: 1, unit: "second" },
  { limit: 3600, divisor: 60, unit: "minute" },
  { limit: 86400, divisor: 3600, unit: "hour" },
  { limit: 604800, divisor: 86400, unit: "day" },
  { limit: 2629800, divisor: 604800, unit: "week" },
  { limit: 31557600, divisor: 2629800, unit: "month" },
  { limit: Infinity, divisor: 31557600, unit: "year" },
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

// Hand-rolled since no date library is installed — "2 days ago" / "in 3 hours".
export function getRelativeTime(value: string, now: Date = new Date()): string {
  const diffSeconds = (new Date(value).getTime() - now.getTime()) / 1000;
  const absSeconds = Math.abs(diffSeconds);

  const { divisor, unit } = RELATIVE_UNITS.find((entry) => absSeconds < entry.limit)!;

  return relativeTimeFormatter.format(Math.round(diffSeconds / divisor), unit);
}

export interface TimeRemaining {
  isOverdue: boolean;
  label: string;
}

// Used for review/milestone deadlines: "3 days left" vs "Overdue by 2 hours".
export function getTimeRemaining(deadline: string, now: Date = new Date()): TimeRemaining {
  const diffMs = new Date(deadline).getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  const relative = getRelativeTime(deadline, now);

  return {
    isOverdue,
    label: isOverdue ? `Overdue — was due ${relative}` : `Due ${relative}`,
  };
}
