"use client";

import { useTranslations } from "next-intl";

interface UpdateDotProps {
  className?: string;
}

// "Something new here" marker for projects, project tabs and records with
// unread updates. Same red as the notification bell's badge, a size up so it
// still reads next to text.
export default function UpdateDot({ className = "" }: UpdateDotProps) {
  const t = useTranslations("common.updates");

  return (
    <span className={`inline-block bg-danger rounded-full size-2.5 shrink-0 ${className}`}>
      <span className="sr-only">{t("new")}</span>
    </span>
  );
}
