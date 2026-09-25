import Link from "next/link";
import { useTranslations } from "next-intl";

import Brand from "@/src/shared/components/Brand";

export function LandingFooter() {
  const t = useTranslations("landing");
  const year = String(new Date().getFullYear());

  return (
    <footer className="py-8 border-border border-t">
      <div className="flex flex-wrap justify-between items-center gap-4 mx-auto px-4 sm:px-6 max-w-295">
        <Link href="#top">
          <Brand size={26} className="" nameClassName="text-lg" />
        </Link>
        <nav className="flex gap-5.5 text-text-secondary text-sm">
          <a href="#features" className="hover:text-primary transition">
            {t("nav.features")}
          </a>
          <a href="#how" className="hover:text-primary transition">
            {t("nav.howItWorks")}
          </a>
          <a href="#contact" className="hover:text-primary transition">
            {t("nav.contact")}
          </a>
        </nav>
        <span className="text-[13px] text-text-secondary">
          {t("footer.rights", { year })}
        </span>
      </div>
    </footer>
  );
}
