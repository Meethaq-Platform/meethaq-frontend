import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { pillLarge, pillPrimary } from "../lib/styles";
import { Reveal } from "./Reveal";

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    <section id="top" className="pt-10 md:pt-18 pb-10 overflow-hidden">
      <Reveal className="relative flex md:flex-row flex-col items-center gap-10 md:gap-14 mx-auto px-4 sm:px-6 max-w-295 text-start">
        <div className="md:flex-[1_1_480px] min-w-0">
          <h1 className="font-bold text-[clamp(2.1rem,3.6vw+1rem,3.4rem)] leading-tight tracking-tight">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-[46ch] text-text-secondary text-lg leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-8 pe-36 md:pe-0">
            <Link href="/register" className={`${pillPrimary} ${pillLarge}`}>
              {t("nav.getStarted")}
            </Link>
            <a
              href="#how"
              className="px-1 py-2.75 font-semibold text-accent-value hover:opacity-75 transition"
            >
              {t("hero.seeHowItWorks")}
            </a>
          </div>
        </div>

        {/* On small screens it shrinks into the text block's bottom corner,
            opposite the buttons (which leave room for it with pe-36). Both theme
            variants are rendered and the theme class picks one; neither is
            `priority`, so the hidden one isn't fetched. */}
        <div className="md:static absolute bottom-0 end-4 md:flex-[1_1_380px] w-32 md:w-full min-w-0">
          <div className="rounded-2xl md:rounded-[28px] overflow-hidden">
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
