"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthTabs() {
  const pathname = usePathname();

  const activeTab = pathname === "/register" ? "register" : "login";
  return (
    <div className="flex items-center gap-2 bg-surface mb-8 p-1 rounded-xl">
      <Link
        href="/login"
        className={` font-semibold text-sm text-center transition ${
          activeTab === "login"
            ? "text-teal-700 font-extrabold"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Sign in
      </Link>
      <div className="bg-gray-500 w-[1px] h-5"></div>
      <Link
        href="/register"
        className={` font-medium text-sm text-center transition ${
          activeTab === "register"
            ? "text-teal-700 font-extrabold"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Sign up
      </Link>
    </div>
  );
}
