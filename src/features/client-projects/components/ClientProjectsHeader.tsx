import { useTranslations } from "next-intl";

export function ClientProjectsHeader() {
  const t = useTranslations("clientProjects.header");

  return (
    <div>
      <h1 className="font-bold text-text-primary text-xl sm:text-2xl">{t("title")}</h1>
      <p className="text-text-secondary text-xs sm:text-sm">
        {t("subtitle")}
      </p>
    </div>
  );
}
