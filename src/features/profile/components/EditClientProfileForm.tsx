"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  clientProfileSchema,
  type ClientProfileFormValues,
} from "../schemas/profile.schema";
import { useUpdateClientProfile } from "../hooks/useUpdateClientProfile";
import { withOptionalFields } from "../lib/build-update-payload";
import type { Profile } from "../types/profile";
import { ProfileSectionCard } from "./ProfileSectionCard";
import { SharedProfileFields } from "./SharedProfileFields";
import InputError from "@/src/shared/components/InputError";

interface EditClientProfileFormProps {
  profile: Profile;
  onSuccess: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function EditClientProfileForm({
  profile,
  onSuccess,
  onDirtyChange,
}: EditClientProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber ?? "",
      country: profile.country ?? "",
    },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const { mutate, isError, error } = useUpdateClientProfile();

  const onSubmit = (values: ClientProfileFormValues) => {
    if (!isDirty) return;
    mutate(
      withOptionalFields(
        { fullName: values.fullName, phoneNumber: values.phoneNumber },
        {
          country: values.country,
          profileImage: profile.profileImage,
        },
      ),
      { onSuccess },
    );
  };

  return (
    <form
      id="profile-edit-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <ProfileSectionCard title="Personal Information">
        <SharedProfileFields register={register} errors={errors} />
      </ProfileSectionCard>

      {isError && (
        <InputError
          message={
            error instanceof Error ? error.message : "Failed to update profile."
          }
        />
      )}
    </form>
  );
}
