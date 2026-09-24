"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import Brand from "@/src/shared/components/Brand";

import { useSidebar } from "../context/SidebarContext";
import { getNavItems } from "../lib/nav-items";
import { NavItem } from "./NavItem";
import { NavLogoutButton } from "./NavLogoutButton";
import Image from "next/image";

export function Sidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();
  const t = useTranslations("layout");
  const { data: user } = useCurrentUser();
  const navItems = getNavItems(user?.roles[0]);

  return (
    <aside
      className={`fixed inset-y-0 inset-s-0 z-50 flex w-64 flex-col border-e border-border bg-surface transition-transform duration-300 ease-in-out md:static md:z-auto md:w-20 md:translate-x-0 md:rtl:translate-x-0 lg:w-64 ${
        // Off-canvas on the start edge: off the right side in RTL.
        isMobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
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
          aria-label={t("closeMenu")}
          className="md:hidden hover:bg-surface-muted p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col flex-1 gap-1 px-3 py-4">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        <Image
          src="/illustrations/Agreement-bro.svg"
          alt={t("illustrationAlt")}
          width={250}
          height={250}
          className="hidden lg:block mt-auto"
        />

        <div className="mt-auto pt-3 border-border border-t">
          <NavLogoutButton />
        </div>
      </nav>
    </aside>
  );
}
