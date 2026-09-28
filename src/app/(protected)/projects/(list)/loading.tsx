import { ProjectsTableSkeleton } from "@/src/features/projects/components/ProjectsTable";
import ListPageSkeleton from "@/src/shared/components/ListPageSkeleton";

// In the (list) group so it covers only /projects, not the project and
// invitation pages below it.
export default function Loading() {
  return (
    <div className="space-y-6 mx-auto h-full">
      <ListPageSkeleton filters={5}>
        <ProjectsTableSkeleton />
      </ListPageSkeleton>
    </div>
  );
}
