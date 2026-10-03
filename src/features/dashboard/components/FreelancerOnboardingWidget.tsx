import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FreelancerFirstUse as FreelancerFirstUseDto } from "../types/dashboard";
import { getOnboardingSteps } from "../lib/onboarding-steps";

interface FreelancerOnboardingWidgetProps {
  firstUse: FreelancerFirstUseDto;
}

// Compact follow-up to the FirstUse screen: once the backend stops treating
// the account as first-use but still sets showCompactOnboardingWidget, the
// remaining setup steps sit above the regular dashboard instead of vanishing.
export default function FreelancerOnboardingWidget({ firstUse }: FreelancerOnboardingWidgetProps) {
  const t = useTranslations("dashboard");
  const steps = getOnboardingSteps(firstUse);
  const doneCount = steps.filter((step) => step.done).length;
  const nextIndex = steps.findIndex((step) => !step.done);

  if (nextIndex === -1) return null;

  return (
    <section className="bg-surface p-4 sm:p-5 border border-border rounded-2xl">
      <div className="flex flex-wrap justify-between items-end gap-x-4 gap-y-1">
        <div>
          <h2 className="font-semibold text-text-primary text-base sm:text-lg">
            {t("onboarding.title")}
          </h2>
          <p className="mt-0.5 text-text-secondary text-xs">{t("onboarding.subtitle")}</p>
        </div>
        <span className="font-medium text-text-secondary text-xs">
          {t("onboarding.progress", { done: doneCount, total: steps.length })}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={t("onboarding.title")}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={doneCount}
        className="bg-surface-muted mt-3 rounded-full h-1.5 overflow-hidden"
      >
        <div
          className="bg-primary rounded-full h-full transition-all"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <ol className="gap-2 grid sm:grid-cols-2 lg:grid-cols-4 mt-4">
        {steps.map((step, index) => {
          const isNext = index === nextIndex;
          return (
            <li key={step.key}>
              <Link
                href={step.href}
                aria-current={isNext ? "step" : undefined}
                className={`flex items-center gap-2.5 p-3 border rounded-xl h-full text-sm transition ${
                  isNext
                    ? "border-primary bg-primary-muted hover:opacity-90"
                    : "border-border hover:bg-surface-muted"
                }`}
              >
                <span
                  className={`flex justify-center items-center rounded-full w-6 h-6 font-semibold text-xs shrink-0 ${
                    step.done
                      ? "bg-success-muted text-success"
                      : isNext
                        ? "bg-primary text-on-primary"
                        : "bg-surface-muted text-text-secondary"
                  }`}
                >
                  {step.done ? <Check size={14} /> : index + 1}
                </span>
                <span
                  className={`flex-1 min-w-0 ${
                    step.done
                      ? "text-text-secondary line-through"
                      : isNext
                        ? "font-semibold text-text-primary"
                        : "text-text-primary"
                  }`}
                >
                  {t(`firstUse.steps.${step.key}`)}
                </span>
                {isNext && <ArrowRight size={14} className="text-primary rtl-flip shrink-0" />}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
