import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FreelancerFirstUse as FreelancerFirstUseDto } from "../types/dashboard";
import { getOnboardingSteps } from "../lib/onboarding-steps";
import FirstUseShell from "./FirstUseShell";

interface FreelancerFirstUseProps {
  firstUse: FreelancerFirstUseDto;
  userName: string | null;
}

// Feature 24. Laid out like the landing page's "how it works" flow: numbered
// steps on a connector line, with the first unfinished step carrying the one
// call to action so there's never a question of what to do next.
export default function FreelancerFirstUse({ firstUse, userName }: FreelancerFirstUseProps) {
  const t = useTranslations("dashboard");
  const steps = getOnboardingSteps(firstUse);
  const doneCount = steps.filter((step) => step.done).length;
  const nextIndex = steps.findIndex((step) => !step.done);

  return (
    <FirstUseShell
      eyebrow={t("firstUse.eyebrow")}
      title={
        userName
          ? t("firstUse.freelancerTitle", { name: userName })
          : t("firstUse.freelancerTitleNoName")
      }
      subtitle={t("firstUse.freelancerSubtitle")}
      illustration="/illustrations/idea.svg"
    >
      <div className="flex items-center gap-3 mb-6 max-w-md">
        <div
          role="progressbar"
          aria-label={t("onboarding.title")}
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={doneCount}
          className="flex-1 bg-surface-muted rounded-full h-1.5 overflow-hidden"
        >
          <div
            className="bg-primary rounded-full h-full transition-all"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>
        <span className="font-medium text-text-secondary text-xs shrink-0">
          {t("onboarding.progress", { done: doneCount, total: steps.length })}
        </span>
      </div>

      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const isNext = index === nextIndex;
          return (
            <li
              key={step.key}
              aria-current={isNext ? "step" : undefined}
              // The connector runs from under this badge to the next one and
              // turns teal once the step is done; the last step has none.
              className={`before:top-12 before:bottom-1 before:absolute relative flex gap-4 pb-6 last:pb-0 last:before:hidden before:w-px before:inset-s-5 ${
                step.done ? "before:bg-primary" : "before:bg-border"
              }`}
            >
              <span
                className={`z-10 flex justify-center items-center rounded-full size-10 font-numbers font-bold text-[15px] shrink-0 ${
                  step.done
                    ? "bg-primary text-on-primary"
                    : isNext
                      ? "bg-accent-value text-on-accent-value ring-4 ring-accent-value-muted"
                      : "bg-primary-muted text-primary"
                }`}
              >
                {step.done ? <Check size={18} strokeWidth={2.5} /> : index + 1}
              </span>

              <div className="pt-1.5 min-w-0">
                <h3
                  className={`font-bold text-[15px] ${
                    step.done ? "text-text-secondary line-through" : "text-text-primary"
                  }`}
                >
                  {t(`firstUse.steps.${step.key}`)}
                </h3>
                <p className="mt-0.5 max-w-[46ch] text-text-secondary text-sm">
                  {t(`firstUse.stepDetails.${step.key}.description`)}
                </p>

                {isNext && (
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-2 bg-accent-value hover:opacity-90 mt-3 px-5 py-2.5 rounded-full font-semibold text-on-accent-value text-sm transition motion-safe:hover:-translate-y-px motion-reduce:transition-none"
                  >
                    {t(`firstUse.stepDetails.${step.key}.cta`)}
                    <ArrowRight size={15} className="rtl-flip" />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </FirstUseShell>
  );
}
