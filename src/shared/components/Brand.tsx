import Image from "next/image";
import { useTranslations } from "next-intl";

interface BrandProps {
  size?: number;
  showName?: boolean;
  className?: string;
  nameClassName?: string;
}

export default function Brand({
  size = 70,
  showName = true,
  className = "mb-8",
  nameClassName = "text-3xl",
}: BrandProps) {
  const t = useTranslations("common.brand");

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.webp"
        className="w-[32px] lg:w-[48px] h-[32px] lg:h-[48px]"
        alt={t("logoAlt")}
        width={size}
        height={size}
        priority
      />

      {showName && (
        <span className={`font-bold text-text-primary ${nameClassName}`}>
          {t("name")}
        </span>
      )}
    </div>
  );
}
