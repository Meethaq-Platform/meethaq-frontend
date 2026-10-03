import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ClosingSection } from "@/src/features/landing/components/ClosingSection";
import { FeaturesSection } from "@/src/features/landing/components/FeaturesSection";
import { FlowSection } from "@/src/features/landing/components/FlowSection";
import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { LandingFooter } from "@/src/features/landing/components/LandingFooter";
import { LandingNav } from "@/src/features/landing/components/LandingNav";
import { MemorySection } from "@/src/features/landing/components/MemorySection";
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
        <MemorySection />
        <ClosingSection />
      </main>
      <LandingFooter />
    </>
  );
}
