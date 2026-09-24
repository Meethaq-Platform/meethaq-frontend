"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createFreelancerProfileSchema,
  type FreelancerProfileFormValues,
} from "../schemas/profile.schema";
import { useUpdateFreelancerProfile } from "../hooks/useUpdateFreelancerProfile";
import { withOptionalFields } from "../lib/build-update-payload";
import type { Profile } from "../types/profile";
import { ProfileSectionCard } from "./ProfileSectionCard";
import { SharedProfileFields } from "./SharedProfileFields";
import Input from "@/src/shared/components/Input";
import InputError from "@/src/shared/components/InputError";
import Textarea from "@/src/shared/components/Textarea";

interface EditFreelancerProfileFormProps {
  profile: Profile;
  onSuccess: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function EditFreelancerProfileForm({
  profile,
  onSuccess,
  onDirtyChange,
}: EditFreelancerProfileFormProps) {
  const t = useTranslations("profile");
  const tValidation = useTranslations("profile.validation");
  const freelancerProfileSchema = useMemo(() => createFreelancerProfileSchema(tValidation), [tValidation]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FreelancerProfileFormValues>({
    resolver: zodResolver(freelancerProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber ?? "",
      country: profile.country ?? "",
      professionalTitle: profile.professionalTitle ?? "",
      bio: profile.bio ?? "",
    },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const { mutate, isError, error } = useUpdateFreelancerProfile();

  const onSubmit = (values: FreelancerProfileFormValues) => {
    if (!isDirty) return;
    mutate(
      withOptionalFields(
        {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          professionalTitle: values.professionalTitle,
        },
        {
          country: values.country,
          bio: values.bio,
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
      <ProfileSectionCard title={t("fields.personalInformation")}>
        <div className="space-y-4">
          <SharedProfileFields register={register} errors={errors} />

          <div>
            <Input
              label={t("fields.professionalTitle")}
              {...register("professionalTitle")}
            />
            <InputError message={errors.professionalTitle?.message} />
          </div>
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard title={t("fields.bio")}>
        <div>
          <Textarea rows={4} {...register("bio")} />
          <InputError message={errors.bio?.message} />
        </div>
      </ProfileSectionCard>

      {isError && (
        <InputError
          message={
            error instanceof Error ? error.message : t("updateFailed")
          }
        />
      )}
    </form>
  );
}
