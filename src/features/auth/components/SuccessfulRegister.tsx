import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SuccessfulRegister() {
  const t = useTranslations("auth.success");

  return (
    <div className="flex flex-col items-center w-full max-w-md text-center">
      {/* Success icon */}
      <div className="flex justify-center items-center bg-success-muted mb-6 rounded-full w-16 h-16">
        <CheckCircle2 className="w-8 h-8 text-success" strokeWidth={2} />
      </div>

      {/* Heading */}
      <h1 className="font-bold text-text-primary text-2xl sm:text-3xl tracking-tight">
        {t("title")}
      </h1>

      {/* Description */}
      <p className="mt-3 max-w-sm text-text-secondary text-sm sm:text-base leading-6">
        {t("description")}
      </p>

      {/* CTA */}
      <Link
        href="/login"
        className="flex justify-center items-center gap-2 bg-primary hover:opacity-90 mt-8 px-5 rounded-xl w-full h-11 font-semibold text-on-primary text-sm transition"
      >
        {t("cta")}
        <ArrowRight className="rtl-flip w-4 h-4" />
      </Link>
    </div>
  );
}
