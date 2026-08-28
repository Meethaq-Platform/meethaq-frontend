"use client";

import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { logoutUser } from "../lib/service";

export default function UserMenu() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
        <div className="flex justify-center items-center bg-primary-muted rounded-full w-9 h-9 font-semibold text-primary">
          {user.firstName.charAt(0).toUpperCase()}
        </div>

        <div className="hidden sm:block text-left">
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
        <div className="right-0 z-50 absolute bg-surface shadow-lg mt-2 border border-border rounded-xl w-52 overflow-hidden">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 hover:bg-danger-muted px-4 w-full h-11 text-danger text-sm transition"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
