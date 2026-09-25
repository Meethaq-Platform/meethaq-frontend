import Image from "next/image";
import { useTranslations } from "next-intl";

import { sectionTitle } from "../lib/styles";
import { Reveal } from "./Reveal";

const STEPS = ["create", "agree", "deliver", "accept", "release"] as const;

export function FlowSection() {
  const t = useTranslations("landing.flow");

  return (
    <section id="how" className="py-18 scroll-mt-16">
      <div className="lg:flex items-center gap-14 mx-auto px-4 sm:px-6 max-w-295">
        <div className="hidden lg:block flex-[1_1_340px] max-w-100">
          <Image
            src="/illustrations/steps.svg"
            alt={t("illustrationAlt")}
            width={400}
            height={400}
            className="w-full h-auto"
          />
        </div>

        <div className="flex-[1_1_480px] min-w-0">
          <h2 className={`${sectionTitle} mb-13`}>{t("title")}</h2>

          <ol className="flex flex-col mx-auto max-w-160">
            {STEPS.map((key, index) => {
              return (
                <Reveal
                  as="li"
                  key={key}
                  delay={index * 90}
                  // The connector runs from under this number to the next one.
                  className="before:top-11 before:bottom-0 before:absolute relative flex gap-5 pb-10 last:pb-0 before:bg-border before:w-px before:start-5.25"
                >
                  <span className="z-10 flex justify-center items-center bg-primary-muted rounded-full size-11 font-numbers font-bold text-[17px] text-primary shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="mb-1.5 font-bold text-[17px]">
                      {t(`steps.${key}.title`)}
                    </h3>
                    <p className="max-w-[46ch] text-[15px] text-text-secondary">
                      {t(`steps.${key}.description`)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
