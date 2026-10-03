import UpdateDot from "./UpdateDot";

export interface TabOption<T extends string> {
  value: T;
  label: string;
  // Item count pill after the label (already formatted, e.g. "4" or "20+").
  count?: string;
  // Red "new updates" dot on the tab's top corner.
  dot?: boolean;
}

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: TabOption<T>[];
}

// Extracted from the pill-switcher originally hand-rolled in
// ClientProjectsPage.tsx — same styling, now shared.
export default function Tabs<T extends string>({
  value,
  onChange,
  options,
}: TabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1 bg-surface p-1 rounded-xl">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative inline-flex items-center gap-1.5 px-3 sm:px-4 h-8 sm:h-9 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
              isActive
                ? "bg-primary text-on-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {option.label}
            {option.count && (
              <span className="bg-accent-value px-1.5 rounded-full min-w-5 font-numbers font-bold text-[11px] text-on-accent-value text-center leading-5">
                {option.count}
              </span>
            )}
            {/* Top-right corner in both directions, tucked inside the tab. */}
            {option.dot && <UpdateDot className="top-1 right-1 absolute" />}
          </button>
        );
      })}
    </div>
  );
}
