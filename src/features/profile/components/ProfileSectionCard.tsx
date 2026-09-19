import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ProfileSectionCardProps {
  title: string;
  icon?: LucideIcon;
  titleClassName?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function ProfileSectionCard({
  title,
  icon: Icon,
  titleClassName,
  action,
  children,
}: ProfileSectionCardProps) {
  return (
    <section className="bg-surface p-6 border border-border rounded-2xl">
      <div
        className={`flex justify-between items-center ${children ? "mb-6" : ""}`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={17} className="text-text-secondary" />}
          <h2
            className={
              titleClassName ?? "font-semibold text-text-primary text-lg"
            }
          >
            {title}
          </h2>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}
