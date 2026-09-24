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
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isSaving = useIsMutating({ mutationKey: ["update-profile"] }) > 0;

  const handleStartEditing = () => {
    setIsFormDirty(false);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6 mx-auto h-full">
      <div className="flex justify-between items-center gap-3">
        <h1 className="font-bold text-text-primary text-xl sm:text-2xl">
          My Profile
        </h1>

        {data &&
          (isEditing ? (
            <div key="editing-actions" className="flex items-center gap-2 sm:gap-3">
              <Button
                type="button"
                variant="amber"
                onClick={() => setIsEditing(false)}
                className="px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                form="profile-edit-form"
                disabled={!isFormDirty}
                loading={isSaving}
                loadingText="Saving..."
                className="px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div key="viewing-actions">
              <Button
                type="button"
                onClick={handleStartEditing}
                className="flex items-center gap-1.5 px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
              >
                <Pencil size={14} className="sm:size-4 size-3.5" />
                Edit
              </Button>
            </div>
          ))}
      </div>

      <ProfileData
        isEditing={isEditing}
        onDone={() => setIsEditing(false)}
        onDirtyChange={setIsFormDirty}
        onStartEditing={handleStartEditing}
      />
    </div>
  );
}
