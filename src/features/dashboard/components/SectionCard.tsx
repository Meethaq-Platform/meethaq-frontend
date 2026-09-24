"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import ErrorState from "@/src/shared/components/ErrorState";
import type { DashboardSection } from "../types/dashboard";

interface SectionCardProps<T> {
  title: string;
  description?: string;
  section: DashboardSection<T> | undefined;
  viewAllHref?: string | null;
  viewAllLabel?: string;
  isLoading?: boolean;
  onRetry?: () => void;
  children: (data: T) => ReactNode;
}

// Every aggregate-dashboard section arrives wrapped as { hasError, data, ... }
// — this renders that contract consistently so a single failed section shows
// an inline retry instead of hiding (or breaking) the rest of the page.
export default function SectionCard<T>({
  title,
  description,
  section,
  viewAllHref,
  viewAllLabel,
  isLoading = false,
  onRetry,
  children,
}: SectionCardProps<T>) {
  const t = useTranslations("dashboard");
  return (
    <section className="flex flex-col bg-surface p-4 sm:p-5 border border-border rounded-2xl h-full">
      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-text-primary text-base sm:text-lg">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-text-secondary text-xs">{description}</p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 shrink-0 font-medium text-primary text-sm hover:underline"
          >
            {viewAllLabel ?? t("viewAll")}
            <ArrowRight size={14} className="rtl-flip" />
          </Link>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-center">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="border-2 border-primary/30 border-t-primary rounded-full w-6 h-6 animate-spin" />
          </div>
        ) : !section || section.hasError || !section.data ? (
          <ErrorState
            message={section?.errorMessage ?? t("sectionFailed")}
            onRetry={onRetry}
          />
        ) : (
          children(section.data)
        )}
      </div>
    </section>
  );
}
