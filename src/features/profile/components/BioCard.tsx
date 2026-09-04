import type { ReactNode } from "react";

import type { Profile } from "../types/profile";
import { ProfileSectionCard } from "./ProfileSectionCard";

interface BioCardProps {
  profile: Profile;
  action?: ReactNode;
}

export function BioCard({ profile, action }: BioCardProps) {
  return (
    <ProfileSectionCard title="Bio" action={action}>
      <p className="text-text-primary text-sm leading-relaxed">
        {profile.bio}
      </p>
    </ProfileSectionCard>
  );
}
