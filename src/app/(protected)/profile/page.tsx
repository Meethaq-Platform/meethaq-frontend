import { BioCard } from "@/src/features/profile/components/BioCard";
import { PersonalInformationCard } from "@/src/features/profile/components/PersonalInformationCard";
import { ProfileOverviewCard } from "@/src/features/profile/components/ProfileOverviewCard";
import { mockProfile } from "@/src/features/profile/lib/mock-profile";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-text-primary text-2xl">My Profile</h1>

        <button
          type="button"
          className="flex items-center gap-1.5 hover:opacity-90 px-4 rounded-lg h-9 font-semibold text-white text-sm transition bg-accent-value"
        >
          Edit
          <Pencil size={14} />
        </button>
      </div>
      <ProfileOverviewCard profile={mockProfile} />
      <PersonalInformationCard profile={mockProfile} />
      <BioCard profile={mockProfile} />
    </div>
  );
}
