import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  // Noun counted in the summary ("3 projects"); pluralized per language.
  itemLabel?: "item" | "project" | "invitation" | "client";
}

export default function Pagination({
  pageNumber,
  totalPages,
  totalCount,
  onPageChange,
  itemLabel = "item",
}: PaginationProps) {
  const t = useTranslations("common.pagination");

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-6 py-3.5 border-border border-t">
      <p className="text-text-secondary text-sm">
        {t("summary", {
          page: pageNumber,
          total: totalPages,
          items: t(`items.${itemLabel}`, { count: totalCount }),
        })}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
          aria-label={t("previous")}
          className="inline-flex justify-center items-center bg-primary hover:bg-primary-muted hover:bg-teal-400 disabled:opacity-40 p-2 rounded-lg text-on-primary transition disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="rtl-flip" />
        </button>

        <button
          type="button"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
          aria-label={t("next")}
          className="inline-flex justify-center items-center bg-primary hover:bg-teal-400 disabled:opacity-40 p-2 rounded-lg text-on-primary transition disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} className="rtl-flip" />
        </button>
      </div>
    </div>
  );
}
