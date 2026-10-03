"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useSidebar } from "../context/SidebarContext";
import type { NavLinkItem } from "../lib/nav-items";

export function NavItem({ item }: { item: NavLinkItem }) {
  const pathname = usePathname();
  const { closeMobile } = useSidebar();
  const t = useTranslations("layout.nav");

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
      <NavItemIcon icon={item.icon} />

      <span className="md:hidden lg:inline">{t(item.labelKey)}</span>
    </Link>
  );
}

// useLinkStatus only works below the Link. Pulsing the icon confirms the click
// while a not-yet-prefetched route loads (common in dev) without shifting layout.
function NavItemIcon({ icon: Icon }: { icon: NavLinkItem["icon"] }) {
  const { pending } = useLinkStatus();

  return (
    <Icon
      size={20}
      aria-hidden
      className={`shrink-0 ${pending ? "animate-pulse" : ""}`}
    />
  );
}
