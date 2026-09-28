import { ClientsTableSkeleton } from "@/src/features/clients/components/ClientsTable";
import ListPageSkeleton from "@/src/shared/components/ListPageSkeleton";

// In the (list) group so it covers only /clients, not client detail pages.
export default function Loading() {
  return (
    <div className="space-y-6 mx-auto h-full">
      <ListPageSkeleton>
        <ClientsTableSkeleton />
      </ListPageSkeleton>
    </div>
  );
}
