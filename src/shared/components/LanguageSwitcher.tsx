"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { saveLocale } from "@/src/i18n/locale";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const next = locale === "ar" ? "en" : "ar";
  // Each language is named in its own script, as switchers conventionally do.
  const label = next === "ar" ? "العربية" : "English";

  function switchLanguage() {
    startTransition(async () => {
      await saveLocale(next);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={switchLanguage}
      disabled={isPending}
      lang={next}
      aria-label={label}
      title={label}
      className={twMerge(
        "flex items-center gap-1.5 hover:bg-surface-muted disabled:opacity-60 p-2 rounded-lg font-semibold text-text-secondary hover:text-text-primary text-sm transition",
        className
      )}
    >
      <Languages size={20} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
