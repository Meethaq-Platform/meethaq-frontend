import { Mail, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRoleLabel } from "@/src/features/auth/hooks/useRoleLabel";

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
  const t = useTranslations("profile.fields");
  const roleLabel = useRoleLabel();
  const { fullName, email, phoneNumber, userRole, country, professionalTitle } =
    profile;

  return (
    <ProfileSectionCard title={t("personalInformation")} icon={User}>
      <div className="gap-x-6 gap-y-8 grid grid-cols-1 sm:grid-cols-3">
        <ProfileField label={t("fullName")} value={fullName} />
        <ProfileField
          label={t("email")}
          value={email}
          dir="ltr"
          icon={Mail}
          copyable
        />
        <ProfileField
          label={t("phone")}
          value={phoneNumber}
          dir="ltr"
          icon={Phone}
          copyable
        />

        <ProfileField label={t("role")} value={roleLabel(userRole) ?? null} />
        <ProfileField label={t("country")} value={country} />

        {professionalTitle !== undefined && (
          <ProfileField label={t("professionalTitle")} value={professionalTitle} />
        )}
      </div>
    </ProfileSectionCard>
  );
}
