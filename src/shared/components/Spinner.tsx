import { useTranslations } from "next-intl";

interface SpinnerProps {
  size?: number;
  className?: string;
}

// `size` used to size a small spinner glyph — existing call sites still
// pass icon-scale values (20-28px), which would make the illustration
// illegible, so it sets a floor rather than the exact rendered size.
export default function Spinner({ size = 24, className }: SpinnerProps) {
  const displaySize = Math.max(size, 140);
  const t = useTranslations("common.states");

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/illustrations/loading.svg"
        alt=""
        style={{ width: displaySize, height: displaySize }}
        className={`animate-pulse object-contain ${className ?? ""}`}
      />
      <span className="text-text-secondary text-sm">{t("loading")}</span>
    </div>
  );
}
