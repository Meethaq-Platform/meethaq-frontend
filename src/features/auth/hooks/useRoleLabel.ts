import { useTranslations } from "next-intl";

// The API sends roles as English names ("Freelancer"); known ones are shown
// translated and anything unexpected as sent.
export function useRoleLabel() {
  const t = useTranslations("auth.roles");

  return (role: string | null | undefined) => {
    const key = role?.toLowerCase();
    return key === "freelancer" || key === "client" || key === "admin" ? t(key) : role;
  };
}
