import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SignupForm } from "@/src/features/auth/components/SignupForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("register") };
}

export default function page() {
  return <SignupForm />;
}
