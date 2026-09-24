import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "./config";
import { formats } from "./formats";

const loadMessages = {
  en: () => import("./messages/en"),
  ar: () => import("./messages/ar"),
} satisfies Record<Locale, () => Promise<unknown>>;

// No i18n routing: the locale lives in a cookie, and URLs stay the same.
export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  return {
    locale,
    formats,
    messages: (await loadMessages[locale]()).default,
  };
});

async function resolveLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  return localeFromAcceptLanguage((await headers()).get("accept-language"));
}

// First visit, no cookie: Arabic if the browser's top preference is any
// Arabic variant (ar, ar-SA, ...), English otherwise.
function localeFromAcceptLanguage(header: string | null): Locale {
  const preferred = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter(({ tag, q }) => tag && tag !== "*" && q > 0)
    .sort((a, b) => b.q - a.q)[0];

  return preferred?.tag.split("-")[0] === "ar" ? "ar" : defaultLocale;
}
