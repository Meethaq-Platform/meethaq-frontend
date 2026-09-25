import Link from "next/link";
import { useTranslations } from "next-intl";

import { pillLarge, pillPrimary } from "../lib/styles";
import { Reveal } from "./Reveal";

export function FinalCta() {
  const t = useTranslations("landing");

  return (
    <section id="contact" className="px-4 py-24 text-center scroll-mt-16">
      <Reveal>
        <h2 className="mb-7 font-bold text-[clamp(1.8rem,2.4vw+1rem,2.5rem)] leading-snug">
          {t("finalCta.title")}
        </h2>
        <Link href="/register" className={`${pillPrimary} ${pillLarge}`}>
          {t("nav.getStarted")}
        </Link>
      </Reveal>
    </section>
  );
}
