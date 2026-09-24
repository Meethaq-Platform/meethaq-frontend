import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("home") };
}

export default function Home() {
  return (
    <div>
      <main>Home</main>
    </div>
  );
}
