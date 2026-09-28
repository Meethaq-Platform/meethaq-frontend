import { ProjectDetailSkeleton } from "@/src/features/projects/components/ProjectDetailSkeleton";

// In the (overview) group so it covers only the project page, not the
// contract and milestone pages below it.
export default function Loading() {
  return <ProjectDetailSkeleton />;
}
