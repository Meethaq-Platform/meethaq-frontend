export interface TabOption<T extends string> {
  value: T;
  label: string;
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
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-3 sm:px-4 h-8 sm:h-9 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
            value === option.value
              ? "bg-primary text-on-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
