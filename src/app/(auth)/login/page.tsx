import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/src/features/auth/components/LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("login") };
}

export default function LoginPage() {
  return <LoginForm />;
}
