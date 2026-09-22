import { DISPUTE_CATEGORY_LABEL, type DisputeCategory } from "../types/dispute";

export function DisputeCategoryBadge({ category }: { category: DisputeCategory }) {
  return (
    <span className="inline-flex items-center bg-surface-muted px-2.5 py-1 rounded-full font-medium text-text-secondary text-xs">
      {DISPUTE_CATEGORY_LABEL[category] ?? `Category ${category}`}
    </span>
  );
}
