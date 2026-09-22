import ProjectStatusDonut from "./ProjectStatusDonut";
import type { ProjectOverviewSummary } from "../types/dashboard";
import type { DonutSegment } from "./ProjectStatusDonut";

interface FreelancerProjectOverviewProps {
  overview: ProjectOverviewSummary;
}

// Feature 8 — compact status breakdown only (chart + counts), meant to sit
// beside the Welcome card. Individual project cards and the "additional
// indicator" counts (Awaiting Approval / Overdue Milestones / Open Disputes)
// live in their own dedicated sections elsewhere on this page (Agreements,
// Upcoming Milestones, Disputes) and via "View All", so nothing is lost —
// this card just stops repeating them.
export default function FreelancerProjectOverview({
  overview,
}: FreelancerProjectOverviewProps) {
  const segments: DonutSegment[] = [
    {
      key: "draft",
      label: "Draft",
      value: overview.draftProjects,
      color: "var(--color-neutral-400)",
      href: "/projects?status=Draft",
    },
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
      key: "cancelled",
      label: "Cancelled",
      value: overview.cancelledProjects,
      color: "var(--color-danger)",
      href: "/projects?status=Cancelled",
    },
  ];

  return (
    <ProjectStatusDonut
      segments={segments}
      total={overview.totalProjects}
      totalLabel="Projects"
      totalHref="/projects"
    />
  );
}
