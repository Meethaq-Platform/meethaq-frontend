import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { FeaturesSection } from "@/src/features/landing/components/FeaturesSection";
import { FlowSection } from "@/src/features/landing/components/FlowSection";
import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { FinalCta } from "@/src/features/landing/components/FinalCta";
import { LandingFooter } from "@/src/features/landing/components/LandingFooter";
import { LandingNav } from "@/src/features/landing/components/LandingNav";
import { PrincipleSection } from "@/src/features/landing/components/PrincipleSection";
import { ShiftSection } from "@/src/features/landing/components/ShiftSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("pageTitles.home"),
    description: t("landing.metaDescription"),
  };
}

export default function Home() {
  return (
    <>
      <LandingNav />
      <main>
        <HeroSection />
        <ShiftSection />
        <FlowSection />
        <FeaturesSection />
        <PrincipleSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </>
  );
}
