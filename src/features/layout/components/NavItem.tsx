"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "../context/SidebarContext";
import type { NavLinkItem } from "../lib/nav-items";

export function NavItem({ item }: { item: NavLinkItem }) {
  const pathname = usePathname();
  const { closeMobile } = useSidebar();
  const Icon = item.icon;

  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={closeMobile}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition md:justify-center lg:justify-start ${
        isActive
          ? "bg-primary-muted text-primary"
          : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
      }`}
    >
      <Icon size={20} className="shrink-0" />

      <span className="md:hidden lg:inline">{item.label}</span>

      <span className="left-full z-50 absolute bg-text-primary opacity-0 group-hover:opacity-100 shadow-lg ml-2 px-2 py-1 rounded-lg text-background text-xs whitespace-nowrap transition-opacity pointer-events-none hidden md:group-hover:block lg:hidden">
        {item.label}
      </span>
    </Link>
  );
}
