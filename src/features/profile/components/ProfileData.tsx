"use client";

import { ProfileOverviewCard } from "./ProfileOverviewCard";
import { PersonalInformationCard } from "./PersonalInformationCard";
import { BioCard } from "./BioCard";
import { EditClientProfileForm } from "./EditClientProfileForm";
import { EditFreelancerProfileForm } from "./EditFreelancerProfileForm";
import { useProfile } from "../hooks/useProfile";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

function withFallback(value?: string | null) {
  return value ? value : "__";
}

interface ProfileDataProps {
  isEditing: boolean;
  onDone: () => void;
}

export default function ProfileData({ isEditing, onDone }: ProfileDataProps) {
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
        message="Failed to load your profile."
        onRetry={() => refetch()}
      />
    );
  }

  if (isEditing) {
    return data.userRole?.toLowerCase() === "freelancer" ? (
      <EditFreelancerProfileForm profile={data} onSuccess={onDone} />
    ) : (
      <EditClientProfileForm profile={data} onSuccess={onDone} />
    );
  }

  const fullName = withFallback(data.fullName);
  const email = withFallback(data.email);
  const phoneNumber = withFallback(data.phoneNumber);
  const userRole = withFallback(data.userRole);
  const country = withFallback(data.country);
  const professionalTitle = withFallback(data.professionalTitle);
  const bio = withFallback(data.bio);

  return (
    <>
      <ProfileOverviewCard profile={{ fullName, userRole, country }} />
      <PersonalInformationCard
        profile={{
          fullName,
          email,
          phoneNumber,
          userRole,
          country,
          professionalTitle,
        }}
      />
      <BioCard bio={bio} />
    </>
  );
}
