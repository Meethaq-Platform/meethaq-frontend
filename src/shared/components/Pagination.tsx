import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function Pagination({
  pageNumber,
  totalPages,
  totalCount,
  onPageChange,
  itemLabel = "item",
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-6 py-3.5 border-border border-t">
      <p className="text-text-secondary text-sm">
        Page {pageNumber} of {totalPages} · {totalCount} {itemLabel}
        {totalCount === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
          aria-label="Previous page"
          className="inline-flex justify-center items-center hover:bg-surface-muted disabled:opacity-40 p-2 rounded-lg text-text-secondary hover:text-text-primary transition disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
          aria-label="Next page"
          className="inline-flex justify-center items-center hover:bg-surface-muted disabled:opacity-40 p-2 rounded-lg text-text-secondary hover:text-text-primary transition disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
