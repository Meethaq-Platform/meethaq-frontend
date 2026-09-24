"use client";

import { Menu } from "lucide-react";

import UserMenu from "@/src/features/auth/components/UserMenu";
import LanguageSwitcher from "@/src/shared/components/LanguageSwitcher";
import ThemeToggle from "@/src/shared/components/ThemeToggle";

import { useSidebar } from "../context/SidebarContext";
import { NotificationButton } from "./NotificationButton";
import { GlobalSearch } from "./GlobalSearch";

export function Header() {
  const { openMobile } = useSidebar();

  return (
    <header className="flex items-center gap-3 bg-surface px-4 sm:px-6 py-3 border-border border-b">
      <button
        type="button"
        onClick={openMobile}
        aria-label="Open menu"
        className="md:hidden hover:bg-surface-muted p-2 rounded-lg text-text-secondary hover:text-text-primary transition"
      >
        <Menu size={22} />
      </button>

      <GlobalSearch className="flex-1 max-w-md" />

      <div className="flex items-center gap-2 ml-auto">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationButton />
        <UserMenu />
      </div>
    </header>
  );
}
