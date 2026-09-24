import { useTranslations } from "next-intl";
import type { ButtonHTMLAttributes } from "react";
import { Pencil } from "lucide-react";

export function EditButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const t = useTranslations("common.actions");

  return (
    <button
      type="button"
      {...props}
      className={`flex items-center gap-1.5 bg-accent-value hover:opacity-90 px-4 rounded-lg h-9 font-semibold text-on-accent-value text-sm transition ${className ?? ""}`}
    >
      {t("edit")}
      <Pencil size={14} />
    </button>
  );
}
