import { Pencil } from "lucide-react";
import ProfileData from "./ProfileData";

export default function ProfilePage() {
  return (
    <div className="space-y-6 mx-auto h-full">
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

      <ProfileData />
    </div>
  );
}
