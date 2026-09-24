import { useTranslations } from "next-intl";

interface CurrencySelectProps {
  currencies: string[];
  value: string;
  onChange: (currency: string) => void;
}

// Only rendered when a user's records span more than one currency (Feature
// 22) — never introduces conversion, just switches which currency's figures
// are shown.
export default function CurrencySelect({
  currencies,
  value,
  onChange,
}: CurrencySelectProps) {
  const t = useTranslations("dashboard");

  if (currencies.length <= 1) return null;

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-text-secondary">{t("currency")}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-surface px-3 border border-border rounded-lg h-9 font-medium text-text-primary text-sm"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </label>
  );
}
