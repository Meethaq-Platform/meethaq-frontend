import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FreelancerFirstUse as FreelancerFirstUseDto } from "../types/dashboard";

interface FreelancerFirstUseProps {
  firstUse: FreelancerFirstUseDto;
  userName: string | null;
}

interface Step {
  done: boolean;
  key: "addClient" | "createProject" | "prepareContract" | "sendForApproval";
  href: string;
}

// Feature 24. Completed steps reflect actual records (the backend's own
// step*_ flags), not local/optimistic state. There's no per-step navigation
// URL in FreelancerFirstUseDto, so each step links to the existing workflow
// screen it belongs to (Clients / Projects) rather than a step-specific
// route that doesn't exist yet.
export default function FreelancerFirstUse({ firstUse, userName }: FreelancerFirstUseProps) {
  const t = useTranslations("dashboard.firstUse");
  const steps: Step[] = [
    { done: firstUse.step1_ClientAdded, key: "addClient", href: "/clients" },
    { done: firstUse.step2_ProjectCreated, key: "createProject", href: "/projects" },
    { done: firstUse.step3_ContractPrepared, key: "prepareContract", href: "/projects" },
    { done: firstUse.step4_ContractSentForApproval, key: "sendForApproval", href: "/projects" },
  ];

  return (
    <section className="bg-surface p-6 sm:p-8 border border-border rounded-2xl text-center">
      <h1 className="font-bold text-text-primary text-xl sm:text-2xl">
        {userName ? t("freelancerTitle", { name: userName }) : t("freelancerTitleNoName")}
      </h1>
      <p className="mt-2 text-text-secondary text-sm">
        {t("freelancerSubtitle")}
      </p>

      <ol className="flex flex-col gap-2 mx-auto mt-6 max-w-md text-start">
        {steps.map((step, index) => (
          <li key={step.key}>
            <Link
              href={step.href}
              className={`flex items-center gap-3 p-3 border border-border rounded-xl transition hover:bg-surface-muted ${
                step.done ? "opacity-70" : ""
              }`}
            >
              {step.done ? (
                <Check size={18} className="text-success shrink-0" />
              ) : (
                <Circle size={18} className="text-text-secondary shrink-0" />
              )}
              <span className="text-text-primary text-sm">
                {index + 1}. {t(`steps.${step.key}`)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
