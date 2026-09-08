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

  return (
    <div className="space-y-6 mx-auto h-full">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-text-primary text-2xl">My Profile</h1>

        {data &&
          (isEditing ? (
            <div key="editing-actions" className="flex items-center gap-3">
              <Button
                type="button"
                variant="amber"
                onClick={() => setIsEditing(false)}
                className="h-9"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                form="profile-edit-form"
                disabled={!isFormDirty}
                loading={isSaving}
                loadingText="Saving..."
                className="h-9"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div key="viewing-actions">
              <Button
                type="button"
                onClick={() => {
                  setIsFormDirty(false);
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 h-9"
              >
                <Pencil size={14} />
                Edit
              </Button>
            </div>
          ))}
      </div>

      <ProfileData
        isEditing={isEditing}
        onDone={() => setIsEditing(false)}
        onDirtyChange={setIsFormDirty}
      />
    </div>
  );
}
