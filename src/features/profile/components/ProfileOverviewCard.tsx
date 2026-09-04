import { Camera } from "lucide-react";

import type { Profile } from "../types/profile";

interface ProfileOverviewCardProps {
  profile: Profile;
}

export function ProfileOverviewCard({ profile }: ProfileOverviewCardProps) {
  const initial = profile.fullName.charAt(0).toUpperCase();

  return (
    <section className="flex items-center gap-4 bg-surface p-6 border border-border rounded-2xl">
      <div className="relative shrink-0">
        <div className="flex justify-center items-center bg-primary-muted rounded-full w-20 h-20 font-semibold text-primary text-2xl overflow-hidden">
          {initial}
        </div>

        <button
          type="button"
          aria-label="Change profile photo"
          className="right-0 bottom-0 absolute flex justify-center items-center bg-primary hover:opacity-90 border-2 border-surface rounded-full w-7 h-7 text-white transition"
        >
          <Camera size={14} />
        </button>
      </div>

      <div>
        <h1 className="font-semibold text-primary text-lg">
          {profile.fullName}
        </h1>
        <p className="text-text-secondary text-sm">{profile.userRole}</p>
        <p className="text-text-secondary text-sm">{profile.country}</p>
      </div>
    </section>
  );
}
