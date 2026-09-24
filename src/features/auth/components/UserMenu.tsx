"use client";

import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLogout } from "../hooks/useLogout";
import { useProfile } from "@/src/features/profile/hooks/useProfile";

export default function UserMenu() {
  const { data: user, isLoading } = useCurrentUser();
  const { data: profile } = useProfile();
  const handleLogout = useLogout();

  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 hover:bg-surface-muted px-3 py-2 rounded-xl transition"
      >
        <div className="flex justify-center items-center bg-primary-muted rounded-full w-9 h-9 overflow-hidden font-semibold text-primary">
          {profile?.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profileImage}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            user.firstName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="hidden sm:block text-start">
          <p className="font-semibold text-text-primary text-sm">
            {user.fullName}
          </p>

          <p className="text-text-secondary text-xs">{user.roles[0]}</p>
        </div>

        <ChevronDown
          size={16}
          className={`text-text-secondary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="inset-e-0 z-50 absolute bg-surface shadow-lg mt-2 border border-border rounded-xl w-52 overflow-hidden">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 hover:bg-danger-muted px-4 w-full h-11 text-danger text-sm transition"
          >
            <LogOut size={16} className="rtl-flip" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
