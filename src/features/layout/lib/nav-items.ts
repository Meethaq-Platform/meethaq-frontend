import { Briefcase, LayoutDashboard, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { UserRole } from "../../auth/types/register";

export interface NavLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const dashboardItem: NavLinkItem = {
  label: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
};

const projectsItem: NavLinkItem = {
  label: "Projects",
  href: "/projects",
  icon: Briefcase,
};

const clientsItem: NavLinkItem = {
  label: "Clients",
  href: "/clients",
  icon: Users,
};

const profileItem: NavLinkItem = {
  label: "Profile",
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
