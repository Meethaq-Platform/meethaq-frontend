import { ProfileField } from "./ProfileField";
import { ProfileSectionCard } from "./ProfileSectionCard";

type PersonalInformationCardProps = {
  fullName: string;
  email: string;
  phoneNumber: string;
  userRole: string;
  country: string;
  professionalTitle: string;
};

export function PersonalInformationCard({
  profile,
}: {
  profile: PersonalInformationCardProps;
}) {
  const { fullName, email, phoneNumber, userRole, country, professionalTitle } =
    profile;

  return (
    <ProfileSectionCard title="Personal Information">
      <div className="gap-x-6 gap-y-6 grid grid-cols-1 sm:grid-cols-3">
        <ProfileField label="Full Name" value={fullName} />
        <ProfileField label="Email Address" value={email} />
        <ProfileField label="Phone Number" value={phoneNumber} />

        <ProfileField label="User Role" value={userRole} />
        <ProfileField label="Country" value={country} />
        <ProfileField label="Professional Title" value={professionalTitle} />
      </div>
    </ProfileSectionCard>
  );
}
