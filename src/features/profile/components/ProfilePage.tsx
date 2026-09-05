"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";

import { useProfile } from "../hooks/useProfile";
import ProfileData from "./ProfileData";
import Button from "@/src/shared/components/Button";

export default function ProfilePage() {
  const { data } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const isSaving = useIsMutating({ mutationKey: ["update-profile"] }) > 0;

  return (
    <div className="space-y-6 mx-auto h-full">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-text-primary text-2xl">My Profile</h1>

        {data &&
          (isEditing ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="hover:opacity-90 px-4 rounded-xl h-11 font-semibold text-white text-sm transition bg-accent-value"
              >
                Cancel
              </button>

              <Button
                type="submit"
                form="profile-edit-form"
                loading={isSaving}
                loadingText="Saving..."
                className="h-9"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 hover:opacity-90 px-4 rounded-xl h-11 font-semibold text-white text-sm transition bg-accent-value"
            >
              Edit
              <Pencil size={14} />
            </button>
          ))}
      </div>

      <ProfileData isEditing={isEditing} onDone={() => setIsEditing(false)} />
    </div>
  );
}
