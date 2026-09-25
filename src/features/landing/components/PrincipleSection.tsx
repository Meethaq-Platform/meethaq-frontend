import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";

const QUESTIONS = ["what", "when", "criteria", "value", "proof"] as const;

// Amber fades into the page's light background in light mode and into near
// black in dark mode, so the text flips from dark to light with the theme.
export function PrincipleSection() {
  const t = useTranslations("landing.principle");

  return (
    <section className="relative bg-linear-135 from-accent-value to-neutral-50 dark:to-[#14110d] py-22 overflow-hidden text-neutral-900 dark:text-amber-50">
      <Image
        src="/illustrations/idea.svg"
        alt=""
        aria-hidden
        width={200}
        height={200}
        className="hidden md:block -bottom-3.5 -end-4.5 absolute opacity-90 w-[clamp(120px,16vw,200px)] h-auto pointer-events-none"
      />

      <Reveal className="relative mx-auto px-4 sm:px-6 max-w-190 text-center">
        <p className="mb-11 font-semibold text-[clamp(1.5rem,2vw+1rem,2rem)] dark:text-white leading-snug">
          {t("title")}
        </p>
        <ul className="flex flex-wrap justify-center gap-3.5">
          {QUESTIONS.map((key) => (
            <li
              key={key}
              className="px-5.5 py-2.5 border border-neutral-900/25 dark:border-amber-50/35 rounded-full text-[15px]"
            >
              {t(`questions.${key}`)}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
