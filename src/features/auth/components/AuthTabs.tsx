"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AuthTabs() {
  const pathname = usePathname();
  const t = useTranslations("auth.tabs");

  const activeTab = pathname === "/register" ? "register" : "login";
  return (
    <div className="flex items-center gap-2 bg-surface mb-8 p-1 rounded-xl">
      <Link
        href="/login"
        className={` font-semibold text-sm text-center transition ${
          activeTab === "login"
            ? "text-primary font-extrabold"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        {t("signIn")}
      </Link>
      <div className="bg-border w-[1px] h-5"></div>
      <Link
        href="/register"
        className={` font-medium text-sm text-center transition ${
          activeTab === "register"
            ? "text-primary font-extrabold"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        {t("signUp")}
      </Link>
    </div>
  );
}
