import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  container,
  sectionDisplayTitle,
  sectionEyebrow,
  sectionLead,
} from "../lib/styles";
import { Reveal } from "./Reveal";

const POINTS = ["clarity", "approval", "payment"] as const;

export function MemorySection() {
  const t = useTranslations("landing.memory");

  return (
    <section className="py-20 md:py-24">
      <div className={`lg:flex items-center gap-16 ${container}`}>
        <Reveal className="lg:flex-[1_1_0] min-w-0">
          <p className={`${sectionEyebrow} text-primary`}>{t("eyebrow")}</p>
          <h2 className={sectionDisplayTitle}>{t("title")}</h2>
          <p className={`${sectionLead} max-w-[52ch]`}>{t("subtitle")}</p>
          <p className="flex items-center gap-3 mt-8 ps-4 border-accent-value border-s-2 font-bold text-sm md:text-base">
            <ShieldCheck
              aria-hidden
              size={20}
              className="text-accent-value shrink-0"
            />
            {t("note")}
          </p>
        </Reveal>

        <ol className="flex flex-col gap-4 lg:flex-[1_1_0] mt-12 lg:mt-0 min-w-0">
          {POINTS.map((key, index) => (
            <Reveal
              as="li"
              key={key}
              delay={index * 90}
              className="flex items-center gap-5 bg-surface p-6 md:p-8 border border-border rounded-[20px]"
            >
              <span className="flex justify-center items-center bg-primary-muted rounded-xl size-12 font-numbers font-bold text-primary shrink-0">
                {index + 1}
              </span>
              <div>
                <h3 className="mb-1.5 font-bold text-lg">
                  {t(`points.${key}.title`)}
                </h3>
                <p className="text-text-secondary">
                  {t(`points.${key}.description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
