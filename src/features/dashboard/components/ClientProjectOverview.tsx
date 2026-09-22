import ProjectStatusDonut from "./ProjectStatusDonut";
import type { ClientProjectOverviewSummary } from "../types/dashboard";
import type { DonutSegment } from "./ProjectStatusDonut";

interface ClientProjectOverviewProps {
  overview: ClientProjectOverviewSummary;
}

// Feature 14 — compact status breakdown only. See FreelancerProjectOverview
// for why the individual project list and the extra indicator counts moved
// out: they're still reachable via the Agreements, Deliverables Awaiting
// Review, and Disputes sections, plus "View All" here.
// ClientProjectOverviewSummaryDto has no draft/cancelled breakdown (a Client
// only ever sees assigned, non-draft agreements), so the remainder beyond
// Active/Completed is grouped as "Other" (e.g. awaiting contract approval).
export default function ClientProjectOverview({
  overview,
}: ClientProjectOverviewProps) {
  const other = Math.max(
    0,
    overview.totalAssignedProjects -
      overview.activeProjects -
      overview.completedProjects,
  );

  const segments: DonutSegment[] = [
    {
      key: "active",
      label: "Active",
      value: overview.activeProjects,
      color: "var(--color-teal-400)",
      href: "/projects?status=Active",
    },
    {
      key: "completed",
      label: "Completed",
      value: overview.completedProjects,
      color: "var(--color-info)",
      href: "/projects?status=Completed",
    },
    {
      key: "other",
      label: "Other",
      value: other,
      color: "var(--color-neutral-400)",
      href: "/projects",
    },
  ];

  return (
    <ProjectStatusDonut
      segments={segments}
      total={overview.totalAssignedProjects}
      totalLabel="Projects"
      totalHref="/projects"
    />
  );
}
