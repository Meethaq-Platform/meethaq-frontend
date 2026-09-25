import { CircleCheck, FileText, ScrollText, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

import { sectionTitle } from "../lib/styles";
import { Reveal } from "./Reveal";

const FEATURES = [
  { key: "contract", Icon: FileText },
  { key: "delivery", Icon: Upload },
  { key: "payment", Icon: CircleCheck },
  { key: "record", Icon: ScrollText },
] as const;

export function FeaturesSection() {
  const t = useTranslations("landing.features");

  return (
    <section id="features" className="pt-10 pb-20 scroll-mt-16">
      <div className="mx-auto px-4 sm:px-6 max-w-295">
        <h2 className={`${sectionTitle} mb-14`}>{t("title")}</h2>

        <div>
          {FEATURES.map(({ key, Icon }, index) => (
            <Reveal
              key={key}
              delay={index * 80}
              // Rows alternate sides on wide screens and stack when narrow.
              className="flex sm:even:flex-row-reverse sm:flex-row flex-col items-center gap-4.5 sm:gap-12 py-9 border-border border-t last:border-b sm:text-start text-center"
            >
              <div className="flex justify-center items-center bg-surface-muted rounded-[20px] size-19 shrink-0">
                <Icon size={30} strokeWidth={1.8} className="text-accent-value" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="mb-2 font-bold text-xl">{t(`${key}.title`)}</h3>
                <p className="mx-auto sm:mx-0 max-w-[56ch] text-text-secondary">
                  {t(`${key}.description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
