import { Briefcase, LucideUser, type LucideIcon } from "lucide-react";

import type { UserRole } from "../types/register";

interface RoleOption {
  value: UserRole;
  label: string;
  icon: LucideIcon;
}

const roleOptions: RoleOption[] = [
  { value: "freelancer", label: "Freelancer", icon: Briefcase },
  { value: "client", label: "Client", icon: LucideUser },
];

interface RoleSelectionProps {
  value: UserRole;
  onChange: (value: UserRole) => void;
  error?: string;
}

export default function RoleSelection({
  value,
  onChange,
  error,
}: RoleSelectionProps) {
  return (
    <div className="space-y-3">
      <p className="font-medium text-text-primary text-sm">Role</p>

      <div className="flex gap-3">
        {roleOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={`flex w-32 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? "border-primary bg-primary-muted text-primary"
                  : "border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`}
            >
              <Icon size={20} className="w-5 h-5" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
    </div>
  );
}
