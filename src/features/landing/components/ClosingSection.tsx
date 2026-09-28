import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import {
  container,
  pillLarge,
  pillPrimary,
  sectionDisplayTitle,
  sectionEyebrow,
  sectionLead,
} from "../lib/styles";
import { Reveal } from "./Reveal";

// The page's closing sign-up card. It stays deep green in both themes, so its
// text is always light.
export function ClosingSection() {
  const t = useTranslations("landing.closing");
  const brand = useTranslations("common.brand");

  return (
    <section id="contact" className="py-20 md:py-24 scroll-mt-16">
      <div className={container}>
        <Reveal className="relative bg-teal-600 dark:bg-teal-800 px-6 md:px-12 py-14 md:py-20 rounded-[32px] overflow-hidden text-white text-center">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.12)_1.5px,transparent_1.5px)] bg-size-[24px_24px] pointer-events-none"
          />

          <div className="relative mx-auto max-w-200">
            <span className="flex justify-center items-center bg-neutral-50 shadow-sm mx-auto mb-8 rounded-2xl size-18">
              <Image
                src="/logo.webp"
                alt={brand("logoAlt")}
                width={48}
                height={48}
                className="size-12"
              />
            </span>

            <p className={`${sectionEyebrow} text-amber-100`}>{t("eyebrow")}</p>
            <h2 className={sectionDisplayTitle}>{t("title")}</h2>
            <p className={twMerge(sectionLead, "mx-auto max-w-[56ch] text-white/80")}>
              {t("subtitle")}
            </p>

            <Link
              href="/register"
              className={`${pillPrimary} ${pillLarge} gap-2.5 mt-10 md:px-9 md:py-4 md:text-lg`}
            >
              {t("cta")}
              <ArrowRight aria-hidden size={18} className="rtl:-scale-x-100" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
