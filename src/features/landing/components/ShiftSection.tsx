import { FileText, Folder, MessageCircle, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  container,
  sectionDisplayTitle,
  sectionEyebrow,
  sectionLead,
} from "../lib/styles";
import { Reveal } from "./Reveal";

// Each piece of a project and the separate place it usually ends up in.
const ITEMS = [
  { key: "agreement", Icon: MessageCircle },
  { key: "contract", Icon: FileText },
  { key: "delivery", Icon: Folder },
  { key: "payment", Icon: Wallet },
] as const;

export function ShiftSection() {
  const t = useTranslations("landing.shift");

  return (
    <section className="py-20 md:py-24">
      <div className={container}>
        <Reveal className="mx-auto max-w-200 text-center">
          <p className={`${sectionEyebrow} text-accent-value`}>
            {t("eyebrow")}
          </p>
          <h2 className={sectionDisplayTitle}>
            {t("title")}
          </h2>
          <p className={`${sectionLead} mx-auto max-w-[62ch]`}>
            {t("subtitle")}
          </p>
        </Reveal>

        <ul className="gap-3 lg:gap-4 grid grid-cols-2 lg:grid-cols-4 mt-14">
          {ITEMS.map(({ key, Icon }, index) => (
            <Reveal
              as="li"
              key={key}
              delay={index * 80}
              // On one row, a dashed line links each card to the next at icon
              // height, bridging the grid gap.
              className="lg:after:top-14 lg:after:-inset-e-4 lg:after:absolute relative flex flex-col items-center bg-surface px-4 py-6 border border-border lg:after:border-text-secondary/40 lg:after:border-t lg:after:border-dashed rounded-[20px] lg:after:w-4 text-center lg:last:after:hidden"
            >
              <span className="flex justify-center items-center bg-accent-value-muted mb-5 border border-accent-value/25 rounded-2xl size-16 text-accent-value">
                <Icon aria-hidden size={24} strokeWidth={1.8} />
              </span>
              <h3 className="mb-1 font-bold text-lg">{t(`items.${key}.title`)}</h3>
              <p className="text-text-secondary text-sm md:text-[15px]">
                {t(`items.${key}.source`)}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
