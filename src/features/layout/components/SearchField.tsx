import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useTranslations } from "next-intl";

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SearchField({ className = "", ...props }: SearchFieldProps) {
  const t = useTranslations("layout.search");

  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        className="top-1/2 inset-s-3 absolute text-text-secondary -translate-y-1/2"
      />

      <input
        type="search"
        placeholder={t("fieldPlaceholder")}
        {...props}
        className="bg-background py-2 pe-4 ps-10 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full text-text-primary placeholder:text-text-secondary text-sm transition"
      />
    </div>
  );
}
