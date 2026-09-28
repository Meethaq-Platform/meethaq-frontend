import Skeleton, { SkeletonRegion } from "./Skeleton";

export interface TableSkeletonColumn {
  /** Real header text, so the header doesn't change when data arrives. */
  label: string;
  /** Screen-reader-only header, like the tables' actions column. */
  srOnlyLabel?: boolean;
  /** What the cell holds: a line of text, a status badge, an avatar with a
   * name, or the row's arrow link. */
  shape?: "text" | "badge" | "avatar" | "action";
  /** Width of the text placeholder (a Tailwind w-* class). */
  width?: string;
  align?: "start" | "end";
  /** Matches columns the real table shows from lg up. */
  lgOnly?: boolean;
}

interface TableSkeletonProps {
  columns: TableSkeletonColumn[];
  rows?: number;
  /** "plain" matches tables whose header has no tinted background. */
  header?: "tinted" | "plain";
}

// Loading state for the list tables: same card, header and cell padding as
// ProjectsTable & co., with placeholder rows in place of the body.
export default function TableSkeleton({
  columns,
  rows = 5,
  header = "tinted",
}: TableSkeletonProps) {
  const visibility = (column: TableSkeletonColumn) =>
    column.lgOnly ? "hidden lg:table-cell" : "";
  const alignment = (column: TableSkeletonColumn) =>
    column.align === "end" ? "text-end" : "text-start";

  return (
    <SkeletonRegion className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className={header === "tinted" ? "bg-primary-muted" : undefined}>
            <tr className="border-border border-b">
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`px-6 py-3.5 font-medium text-xs uppercase tracking-wide ${
                    header === "tinted" ? "text-primary" : "text-text-secondary"
                  } ${alignment(column)} ${visibility(column)}`}
                >
                  {column.srOnlyLabel ? (
                    <span className="sr-only">{column.label}</span>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }, (_, row) => (
              <tr key={row}>
                {columns.map((column) => (
                  <td
                    key={column.label}
                    className={`px-6 py-4 ${visibility(column)}`}
                  >
                    <SkeletonCell column={column} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SkeletonRegion>
  );
}

function SkeletonCell({ column }: { column: TableSkeletonColumn }) {
  const endAligned = column.align === "end" ? "ms-auto" : "";

  switch (column.shape) {
    case "badge":
      return <Skeleton className="rounded-full w-20 h-6" />;
    case "avatar":
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="rounded-full w-10 h-10 shrink-0" />
          <Skeleton className={`h-4 ${column.width ?? "w-32"}`} />
        </div>
      );
    case "action":
      return <Skeleton className="ms-auto rounded-lg w-8 h-8" />;
    default:
      return <Skeleton className={`h-4 ${column.width ?? "w-24"} ${endAligned}`} />;
  }
}
