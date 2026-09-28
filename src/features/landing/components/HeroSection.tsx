import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { container, pillLarge, pillPrimary } from "../lib/styles";
import { Reveal } from "./Reveal";

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    // From md up it fills the first screen under the sticky nav (~4.5rem).
    <section
      id="top"
      className="relative flex items-center md:min-h-[calc(100svh-4.5rem)] pt-10 md:pt-12 pb-10 md:pb-16 overflow-hidden"
    >
      {/* Faint dot grid that fades out toward the edges. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none"
      />

      <Reveal
        className={`relative flex md:flex-row flex-col items-center gap-10 md:gap-16 w-full text-start ${container}`}
      >
        <div className="md:flex-[1_1_540px] min-w-0">
          <span className="inline-flex items-center gap-2 bg-surface shadow-xs mb-6 px-4 py-2 border border-border rounded-full font-semibold text-primary text-sm">
            <ShieldCheck aria-hidden size={16} strokeWidth={2.2} />
            {t("hero.eyebrow")}
          </span>
          <h1 className="font-bold text-[clamp(2.3rem,3.8vw+1rem,4rem)] leading-[1.15] tracking-tight">
            {t("hero.titleLead")}{" "}
            <span className="block text-primary">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-text-secondary text-lg md:text-xl leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-9 md:mt-10 pe-36 md:pe-0">
            <Link
              href="/register"
              className={`${pillPrimary} ${pillLarge} md:px-9 md:py-4 md:text-lg`}
            >
              {t("nav.getStarted")}
            </Link>
            <a
              href="#how"
              className="px-1 py-2.75 font-semibold text-primary md:text-lg hover:opacity-75 transition"
            >
              {t("hero.seeHowItWorks")}
            </a>
          </div>
        </div>

        {/* On small screens it shrinks into the text block's bottom corner,
            opposite the buttons (which leave room for it with pe-36). Both theme
            variants are rendered and the theme class picks one; neither is
            `priority`, so the hidden one isn't fetched. Capped near the GIFs'
            500px source size so they don't blur. */}
        <div className="md:static absolute bottom-0 inset-e-4 md:flex-[1_1_440px] w-32 md:w-full md:max-w-135 min-w-0">
          <div className="rounded-2xl md:rounded-4xl overflow-hidden">
            <Image
              src="/illustrations/Accept terms.gif"
              alt={t("hero.illustrationAlt")}
              width={500}
              height={500}
              className="dark:hidden w-full h-auto"
            />
            <Image
              src="/illustrations/Accept terms-dark.gif"
              alt={t("hero.illustrationAlt")}
              width={500}
              height={500}
              className="hidden dark:block w-full h-auto"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
