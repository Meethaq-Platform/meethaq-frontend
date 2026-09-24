"use client";

import { LogOut } from "lucide-react";

import { useLogout } from "@/src/features/auth/hooks/useLogout";

export function NavLogoutButton() {
  const logout = useLogout();

  return (
    <button
      type="button"
      onClick={logout}
      className="group relative flex md:justify-center lg:justify-start items-center gap-3 hover:bg-danger-muted px-3 py-2.5 rounded-xl w-full font-medium text-danger text-sm transition"
    >
      <LogOut size={20} className="rtl-flip shrink-0" />

      <span className="md:hidden lg:inline">Logout</span>

      <span className="hidden lg:hidden md:group-hover:block inset-s-full z-50 absolute opacity-0 group-hover:opacity-100 shadow-lg ms-2 px-2 py-1 rounded-lg bg-text-primary text-background text-xs whitespace-nowrap transition-opacity pointer-events-none">
        Logout
      </span>
    </button>
  );
}
