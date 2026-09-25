"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import Brand from "@/src/shared/components/Brand";
import LanguageSwitcher from "@/src/shared/components/LanguageSwitcher";
import ThemeToggle from "@/src/shared/components/ThemeToggle";

// Matches the app sidebar's link style.
const itemClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary transition";

const LINKS = [
  { href: "#features", key: "features" },
  { href: "#how", key: "howItWorks" },
  { href: "#contact", key: "contact" },
] as const;

export function LandingMobileMenu() {
  const t = useTranslations("landing.nav");
  const tLayout = useTranslations("layout");
  const [isOpen, setIsOpen] = useState(false);
  // The drawer renders into <body>: the header's backdrop-blur would
  // otherwise trap its `fixed` positioning inside the header.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={tLayout("openMenu")}
        aria-expanded={isOpen}
        className="hover:bg-surface-muted p-2 rounded-lg text-text-secondary hover:text-text-primary transition"
      >
        <Menu size={22} />
      </button>

      {isClient &&
        createPortal(
          <div className="md:hidden">
      {isOpen && (
        <div
          onClick={close}
          aria-hidden="true"
          className="z-50 fixed inset-0 bg-black/40"
        />
      )}

      {/* Off-canvas on the start edge: off the right side in RTL. */}
      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-0 inset-s-0 z-50 flex w-64 flex-col border-e border-border bg-neutral-50 dark:bg-surface transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center gap-2 px-4 py-5">
          <Brand size={32} className="" nameClassName="text-lg" />
          <button
            type="button"
            onClick={close}
            aria-label={tLayout("closeMenu")}
            className="hover:bg-surface-muted p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition"
          >
            <X size={20} />
          </button>
        </div>

        <nav aria-label={t("label")} className="flex flex-col gap-1 px-3 py-4">
          {LINKS.map(({ href, key }) => (
            <a key={key} href={href} onClick={close} className={itemClass}>
              {t(key)}
            </a>
          ))}
          <Link href="/login" onClick={close} className={itemClass}>
            {t("signIn")}
          </Link>

          <div className="flex flex-col gap-1 mt-2 pt-3 border-border border-t">
            <LanguageSwitcher showLabel className={itemClass} />
            <ThemeToggle showLabel className={itemClass} />
          </div>
        </nav>
      </aside>
          </div>,
          document.body,
        )}
    </div>
  );
}
