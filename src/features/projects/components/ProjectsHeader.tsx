import { useTranslations } from "next-intl";

import { AddProjectButton } from "./AddProjectButton";

export function ProjectsHeader() {
  const t = useTranslations("projects.header");

  return (
    <div className="flex justify-between items-center gap-4">
      <div>
        <h1 className="font-bold text-text-primary text-xl sm:text-2xl">{t("title")}</h1>
        <p className="text-text-secondary text-xs sm:text-sm">
          {t("subtitle")}
        </p>
      </div>

      <AddProjectButton />
    </div>
  );
}
