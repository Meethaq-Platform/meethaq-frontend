import { Camera } from "lucide-react";

type ProfileOverviewCardProps = {
  fullName: string;
  userRole: string;
  country: string;
};

export function ProfileOverviewCard({
  profile,
}: {
  profile: ProfileOverviewCardProps;
}) {
  const { fullName, userRole, country } = profile;
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <section className="flex items-center gap-4 bg-surface p-6 border border-border rounded-2xl">
      <div className="relative shrink-0">
        <div className="flex justify-center items-center bg-primary-muted rounded-full w-20 h-20 overflow-hidden font-semibold text-primary text-2xl">
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
        <h1 className="font-semibold text-primary text-lg">{fullName}</h1>
        <p className="text-text-secondary text-sm">{userRole}</p>
        <p className="text-text-secondary text-sm">{country}</p>
      </div>
    </section>
  );
}
