import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { sectionTitle } from "../lib/styles";

const BEFORE = ["messages", "contract", "files", "payment"] as const;
const AFTER = ["onePlace", "criteria", "delivery", "payment"] as const;

export function ShiftSection() {
  const t = useTranslations("landing.shift");

  return (
    <section className="py-16">
      <div className="mx-auto px-4 sm:px-6 max-w-295">
        <h2 className={`${sectionTitle} mb-10`}>{t("title")}</h2>

        <div className="flex sm:flex-row flex-col bg-surface border border-border rounded-[20px] overflow-hidden">
          <div className="flex-1 px-6 sm:px-9 py-8">
            <span className="flex items-center gap-2 mb-4.5 font-semibold text-[13px] text-text-secondary">
              {/* rtl-flip turns "?" into the Arabic "؟". */}
              <span
                aria-hidden
                className="flex justify-center items-center bg-accent-value rounded-full size-5 font-bold text-on-accent-value text-xs leading-none"
              >
                <span className="inline-block rtl-flip">?</span>
              </span>
              {t("beforeLabel")}
            </span>
            <ul className="flex flex-col gap-3.5 text-text-secondary">
              {BEFORE.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <X
                    aria-hidden
                    size={16}
                    className="mt-1.5 text-text-secondary/70 shrink-0"
                  />
                  {t(`before.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          <div aria-hidden className="bg-border w-full sm:w-px h-px sm:h-auto" />

          <div className="flex-1 px-6 sm:px-9 py-8">
            <span className="flex items-center gap-2 mb-4.5 font-semibold text-[13px] text-primary">
              <span
                aria-hidden
                className="flex justify-center items-center bg-primary rounded-full size-5 text-on-primary"
              >
                <Check size={13} strokeWidth={3} />
              </span>
              {t("afterLabel")}
            </span>
            <ul className="flex flex-col gap-3.5 font-medium">
              {AFTER.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <Check
                    aria-hidden
                    size={16}
                    strokeWidth={2.5}
                    className="mt-1.5 text-primary shrink-0"
                  />
                  {t(`after.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
