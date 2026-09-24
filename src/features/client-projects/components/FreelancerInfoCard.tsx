import { useTranslations } from "next-intl";

interface FreelancerInfoCardProps {
  freelancerName: string;
}

// Client-side mirror of the freelancer's own ClientCard — same card chrome
// for visual parity between the two roles' Overview tabs, but read-only:
// a client can't reassign who they're working with, so there's no edit
// affordance here (unlike ClientCard's AssignClientControl).
export function FreelancerInfoCard({ freelancerName }: FreelancerInfoCardProps) {
  const t = useTranslations("clientProjects.freelancerCard");

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <p className="mb-4 font-semibold text-text-secondary text-xs uppercase tracking-wide">
        {t("title")}
      </p>
      <p dir="auto" className="text-text-primary text-sm">{freelancerName}</p>
    </div>
  );
}
