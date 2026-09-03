"use client";

import { X } from "lucide-react";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import Brand from "@/src/shared/components/Brand";

import { useSidebar } from "../context/SidebarContext";
import { getNavItems } from "../lib/nav-items";
import { NavItem } from "./NavItem";
import { NavLogoutButton } from "./NavLogoutButton";

export function Sidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();
  const { data: user } = useCurrentUser();
  const navItems = getNavItems(user?.roles[0]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 ease-in-out md:static md:z-auto md:w-20 md:translate-x-0 lg:w-64 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between md:justify-center lg:justify-between items-center gap-2 px-4 md:px-2 lg:px-4 py-5">
        <Brand
          size={48}
          className=""
          nameClassName="md:hidden lg:inline text-lg md:text-xl lg:text-2xl"
        />

        <button
          type="button"
          onClick={closeMobile}
          aria-label="Close menu"
          className="md:hidden hover:bg-surface-muted p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col flex-1 gap-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        <div className="mt-auto pt-3 border-border border-t">
          <NavLogoutButton />
        </div>
      </nav>
    </aside>
  );
}
