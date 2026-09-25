"use client";

import { Loader2, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { useLogout } from "@/src/features/auth/hooks/useLogout";

export function NavLogoutButton() {
  const { logout, isPending } = useLogout();
  const t = useTranslations("layout");

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isPending}
      className="group relative flex md:justify-center lg:justify-start items-center gap-3 hover:bg-danger-muted disabled:opacity-60 px-3 py-2.5 rounded-xl w-full font-medium text-danger text-sm transition disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 size={20} className="animate-spin shrink-0" aria-hidden />
      ) : (
        <LogOut size={20} className="rtl-flip shrink-0" />
      )}

      <span className="md:hidden lg:inline">{t("logout")}</span>

      <span className="hidden lg:hidden md:group-hover:block inset-s-full z-50 absolute opacity-0 group-hover:opacity-100 shadow-lg ms-2 px-2 py-1 rounded-lg bg-text-primary text-background text-xs whitespace-nowrap transition-opacity pointer-events-none">
        {t("logout")}
      </span>
    </button>
  );
}
