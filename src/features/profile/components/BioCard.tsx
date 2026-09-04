import { ProfileSectionCard } from "./ProfileSectionCard";

interface BioCardProps {
  bio: string;
}

export function BioCard({ bio }: BioCardProps) {
  return (
    <ProfileSectionCard title="Bio">
      <p className="text-text-primary text-sm leading-relaxed">{bio}</p>
    </ProfileSectionCard>
  );
}
