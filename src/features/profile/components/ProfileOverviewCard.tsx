"use client";

import { useState } from "react";
import { Camera, Pencil } from "lucide-react";

import { EditProfilePictureModal } from "./EditProfilePictureModal";
import { formatDate } from "@/src/shared/lib/format";

interface ProfileOverviewCardProps {
  fullName: string;
  userRole: string;
  country: string | null;
  // undefined = this role doesn't have a professional title at all
  professionalTitle?: string | null;
  profileImage: string | null;
  memberSince: string;
  onStartEditing?: () => void;
}

export function ProfileOverviewCard({
  profile,
}: {
  profile: ProfileOverviewCardProps;
}) {
  const {
    fullName,
    userRole,
    country,
    professionalTitle,
    profileImage,
    memberSince,
    onStartEditing,
  } = profile;
  const initial = fullName.charAt(0).toUpperCase();
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);

  return (
    <section className="flex sm:flex-row flex-col justify-between items-start gap-6 bg-(--card-bg) p-6 border border-border rounded-2xl">
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative shrink-0">
          <div className="flex justify-center items-center bg-primary-muted rounded-full w-20 h-20 overflow-hidden font-semibold text-primary text-2xl">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              initial
            )}
          </div>

          <button
            type="button"
            aria-label="Change profile photo"
            onClick={() => setIsPictureModalOpen(true)}
            className="inset-e-0 bottom-0 absolute flex justify-center items-center bg-primary hover:opacity-90 border-2 border-surface dark:border-(--card-bg) rounded-full w-7 h-7 text-on-primary transition"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="min-w-0">
          <h1 className="font-semibold text-primary text-lg truncate">
            {fullName}
          </h1>
          <p className="text-text-secondary text-sm">{userRole}</p>

          {professionalTitle !== undefined &&
            (professionalTitle ? (
              <p className="mt-1 text-text-primary text-sm">
                {professionalTitle}
              </p>
            ) : (
              <button
                type="button"
                onClick={onStartEditing}
                className="flex items-center gap-1 mt-1 text-text-secondary hover:text-primary text-sm italic transition"
              >
                <Pencil size={12} />
                Add a tagline
              </button>
            ))}

          <p className="mt-1 text-text-secondary text-sm">
            {country ?? <span className="italic"></span>}
          </p>
        </div>
      </div>

      <div className="bg-surface-muted px-3 py-1.5 rounded-lg text-center shrink-0">
        <p className="text-[11px] text-text-secondary uppercase tracking-wide">
          Member Since
        </p>
        <p className="font-semibold text-text-primary text-sm">
          {formatDate(memberSince)}
        </p>
      </div>

      <EditProfilePictureModal
        open={isPictureModalOpen}
        onClose={() => setIsPictureModalOpen(false)}
        fullName={fullName}
        profileImage={profileImage}
      />
    </section>
  );
}
