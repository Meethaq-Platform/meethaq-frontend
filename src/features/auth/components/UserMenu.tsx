"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLogout } from "../hooks/useLogout";
import { useRoleLabel } from "../hooks/useRoleLabel";
import { useProfile } from "@/src/features/profile/hooks/useProfile";

export default function UserMenu() {
  const { data: user, isLoading } = useCurrentUser();
  const { data: profile } = useProfile();
  const { logout, isPending: isLoggingOut } = useLogout();
  const t = useTranslations("auth");

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const roleLabel = useRoleLabel();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
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

          <p className="text-text-secondary text-xs">{roleLabel(user.roles[0])}</p>
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
            onClick={logout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 hover:bg-danger-muted disabled:opacity-60 px-4 w-full h-11 text-danger text-sm transition disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="animate-spin" aria-hidden />
            ) : (
              <LogOut size={16} className="rtl-flip" />
            )}
            <span>{t("userMenu.signOut")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
