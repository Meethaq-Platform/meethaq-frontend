import { Briefcase, LayoutDashboard, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { UserRole } from "../../auth/types/register";

export interface NavLinkItem {
  // Key under layout.nav in the message catalogs.
  labelKey: "dashboard" | "projects" | "clients" | "profile";
  href: string;
  icon: LucideIcon;
}

const dashboardItem: NavLinkItem = {
  labelKey: "dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
};

const projectsItem: NavLinkItem = {
  labelKey: "projects",
  href: "/projects",
  icon: Briefcase,
};

const clientsItem: NavLinkItem = {
  labelKey: "clients",
  href: "/clients",
  icon: Users,
};

const profileItem: NavLinkItem = {
  labelKey: "profile",
  href: "/profile",
  icon: User,
};

const navItemsByRole: Record<UserRole, NavLinkItem[]> = {
  freelancer: [dashboardItem, projectsItem, clientsItem, profileItem],
  client: [dashboardItem, projectsItem, profileItem],
};

export function getNavItems(role?: string): NavLinkItem[] {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "freelancer" || normalizedRole === "client") {
    return navItemsByRole[normalizedRole];
  }

  return navItemsByRole.client;
}
