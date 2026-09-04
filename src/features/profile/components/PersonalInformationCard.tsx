import type { ReactNode } from "react";

import type { Profile } from "../types/profile";
import { ProfileField } from "./ProfileField";
import { ProfileSectionCard } from "./ProfileSectionCard";

interface PersonalInformationCardProps {
  profile: Profile;
  action?: ReactNode;
}

export function PersonalInformationCard({
  profile,
  action,
}: PersonalInformationCardProps) {
  return (
    <ProfileSectionCard title="Personal Information" action={action}>
      <div className="gap-x-6 gap-y-6 grid grid-cols-1 sm:grid-cols-3">
        <ProfileField label="Full Name" value={profile.fullName} />
        <ProfileField label="Email Address" value={profile.email} />
        <ProfileField label="Phone Number" value={profile.phoneNumber} />

        <ProfileField label="User Role" value={profile.userRole} />
        <ProfileField label="Country" value={profile.country} />
        <ProfileField
          label="Professional Title"
          value={profile.professionalTitle}
        />
      </div>
    </ProfileSectionCard>
  );
}
