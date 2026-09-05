"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

import { EditProfilePictureModal } from "./EditProfilePictureModal";

interface ProfileOverviewCardProps {
  fullName: string;
  userRole: string;
  country: string;
  profileImage: string | null;
}

export function ProfileOverviewCard({
  profile,
}: {
  profile: ProfileOverviewCardProps;
}) {
  const { fullName, userRole, country, profileImage } = profile;
  const initial = fullName.charAt(0).toUpperCase();
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);

  return (
    <section className="flex items-center gap-4 bg-surface p-6 border border-border rounded-2xl">
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
          className="right-0 bottom-0 absolute flex justify-center items-center bg-primary hover:opacity-90 border-2 border-surface rounded-full w-7 h-7 text-white transition"
        >
          <Camera size={14} />
        </button>
      </div>

      <div>
        <h1 className="font-semibold text-primary text-lg">{fullName}</h1>
        <p className="text-text-secondary text-sm">{userRole}</p>
        <p className="text-text-secondary text-sm">{country}</p>
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
