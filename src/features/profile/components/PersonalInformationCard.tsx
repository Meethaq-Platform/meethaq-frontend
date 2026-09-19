import { Mail, Phone, User } from "lucide-react";

import { ProfileField } from "./ProfileField";
import { ProfileSectionCard } from "./ProfileSectionCard";

type PersonalInformationCardProps = {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  userRole: string;
  country: string | null;
  // undefined = this role doesn't have a professional title at all
  professionalTitle?: string | null;
};

export function PersonalInformationCard({
  profile,
}: {
  profile: PersonalInformationCardProps;
}) {
  const { fullName, email, phoneNumber, userRole, country, professionalTitle } =
    profile;

  return (
    <ProfileSectionCard title="Personal Information" icon={User}>
      <div className="gap-x-6 gap-y-8 grid grid-cols-1 sm:grid-cols-3">
        <ProfileField label="Full Name" value={fullName} />
        <ProfileField
          label="Email Address"
          value={email}
          icon={Mail}
          copyable
        />
        <ProfileField
          label="Phone Number"
          value={phoneNumber}
          icon={Phone}
          copyable
        />

        <ProfileField label="User Role" value={userRole} />
        <ProfileField label="Country" value={country} />

        {professionalTitle !== undefined && (
          <ProfileField label="Professional Title" value={professionalTitle} />
        )}
      </div>
    </ProfileSectionCard>
  );
}
