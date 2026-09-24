import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface ShowMoreToggleProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function ShowMoreToggle({ expanded, onToggle }: ShowMoreToggleProps) {
  const t = useTranslations("dashboard");
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className="flex justify-center items-center gap-1.5 mx-auto hover:bg-surface-muted px-3 rounded-lg h-8 font-medium text-text-secondary hover:text-text-primary text-xs transition"
    >
      {expanded ? t("showLess") : t("showMore")}
      <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
    </button>
  );
}
