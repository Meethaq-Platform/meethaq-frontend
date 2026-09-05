import type { ReactNode } from "react";

interface ProfileSectionCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ProfileSectionCard({
  title,
  action,
  children,
}: ProfileSectionCardProps) {
  return (
    <section className="bg-surface p-6 border border-border rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-text-primary text-lg">{title}</h2>
        {action}
      </div>

      {children}
    </section>
  );
}
