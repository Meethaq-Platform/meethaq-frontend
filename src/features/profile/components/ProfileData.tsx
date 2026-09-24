"use client";

import { useTranslations } from "next-intl";
import { ProfileOverviewCard } from "./ProfileOverviewCard";
import { PersonalInformationCard } from "./PersonalInformationCard";
import { BioCard } from "./BioCard";
import { EditClientProfileForm } from "./EditClientProfileForm";
import { EditFreelancerProfileForm } from "./EditFreelancerProfileForm";
import { useProfile } from "../hooks/useProfile";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

interface ProfileDataProps {
  isEditing: boolean;
  onDone: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
  onStartEditing?: () => void;
}

export default function ProfileData({
  isEditing,
  onDone,
  onDirtyChange,
  onStartEditing,
}: ProfileDataProps) {
  const t = useTranslations("profile");
  const { data, isLoading, isError, refetch } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16 h-full">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        message={t("loadFailed")}
        onRetry={() => refetch()}
      />
    );
  }

  const isFreelancer = data.userRole?.toLowerCase() === "freelancer";

  if (isEditing) {
    return isFreelancer ? (
      <EditFreelancerProfileForm
        profile={data}
        onSuccess={onDone}
        onDirtyChange={onDirtyChange}
      />
    ) : (
      <EditClientProfileForm
        profile={data}
        onSuccess={onDone}
        onDirtyChange={onDirtyChange}
      />
    );
  }

  // Professional title / bio don't exist for clients yet — pass `undefined`
  // so the display components omit the field instead of showing it empty.
  const professionalTitle = isFreelancer
    ? (data.professionalTitle ?? null)
    : undefined;

  return (
    <>
      <ProfileOverviewCard
        profile={{
          fullName: data.fullName,
          userRole: data.userRole,
          country: data.country,
          professionalTitle,
          profileImage: data.profileImage,
          memberSince: data.createdAt,
          onStartEditing,
        }}
      />
      <PersonalInformationCard
        profile={{
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          userRole: data.userRole,
          country: data.country,
          professionalTitle,
        }}
      />
      {isFreelancer && (
        <BioCard bio={data.bio ?? null} onStartEditing={onStartEditing} />
      )}
    </>
  );
}
