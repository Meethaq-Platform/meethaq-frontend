"use client";

import { LogOut } from "lucide-react";

import { useLogout } from "@/src/features/auth/hooks/useLogout";

export function NavLogoutButton() {
  const logout = useLogout();

  return (
    <button
      type="button"
      onClick={logout}
      className="group relative flex items-center gap-3 hover:bg-danger-muted px-3 py-2.5 rounded-xl w-full font-medium text-danger text-sm transition md:justify-center lg:justify-start"
    >
      <LogOut size={20} className="shrink-0" />

      <span className="md:hidden lg:inline">Logout</span>

      <span className="left-full z-50 absolute bg-text-primary opacity-0 group-hover:opacity-100 shadow-lg ml-2 px-2 py-1 rounded-lg text-background text-xs whitespace-nowrap transition-opacity pointer-events-none hidden md:group-hover:block lg:hidden">
        Logout
      </span>
    </button>
  );
}
