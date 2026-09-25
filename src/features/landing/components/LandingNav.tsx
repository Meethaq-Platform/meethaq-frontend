import Link from "next/link";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import Brand from "@/src/shared/components/Brand";
import LanguageSwitcher from "@/src/shared/components/LanguageSwitcher";
import ThemeToggle from "@/src/shared/components/ThemeToggle";

import { pillBase, pillPrimary } from "../lib/styles";
import { LandingMobileMenu } from "./LandingMobileMenu";

export function LandingNav() {
  const t = useTranslations("landing.nav");

  return (
    <header className="top-0 z-40 sticky bg-background/90 backdrop-blur-md border-border border-b">
      <div className="flex justify-between items-center gap-3 mx-auto px-4 sm:px-6 py-3 max-w-295">
        <Link href="#">
          <Brand size={32} className="" nameClassName="text-lg" />
        </Link>

        <nav
          aria-label={t("label")}
          className="hidden md:flex items-center gap-7 text-[15px] text-text-secondary"
        >
          <a href="#features" className="hover:text-primary transition">
            {t("features")}
          </a>
          <a href="#how" className="hover:text-primary transition">
            {t("howItWorks")}
          </a>
          <a href="#contact" className="hover:text-primary transition">
            {t("contact")}
          </a>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* On small screens these live in the menu sidebar instead. */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Link
            href="/login"
            className={twMerge(
              pillBase,
              "hidden md:inline-flex text-text-primary hover:text-primary",
            )}
          >
            {t("signIn")}
          </Link>
          <Link
            href="/register"
            className={twMerge(
              pillPrimary,
              "px-4 sm:px-5.5 py-2 sm:py-2.75 text-sm sm:text-[15px]",
            )}
          >
            {t("getStarted")}
          </Link>
          <LandingMobileMenu />
        </div>
      </div>
    </header>
  );
}
