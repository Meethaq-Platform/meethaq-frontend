import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProfilePage from "@/src/features/profile/components/ProfilePage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("profile") };
}

export default function Profile() {
  return <ProfilePage />;
}
