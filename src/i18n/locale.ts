import { LOCALE_COOKIE, type Locale } from "./config";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Client-side: remember the choice for the next server render. Callers
// router.refresh() afterwards so the root layout re-renders with the new
// lang/dir and messages.
export async function saveLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
  await persistLocalePreference(locale);
}

// TODO(i18n): save the preference to the user's profile once the API supports
// it (e.g. PATCH /users/me { preferredLanguage }), and on login write the
// profile's value into the cookie so the choice follows the user across
// devices. Until then the cookie is the only source of truth.
async function persistLocalePreference(locale: Locale) {
  void locale;
}
