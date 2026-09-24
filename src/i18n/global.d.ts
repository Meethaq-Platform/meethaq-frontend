import type { Locale } from "./config";
import type { formats } from "./formats";
import type messages from "./messages/en";

// Types next-intl's hooks and APIs against our locales, formats and the
// English message catalog (the source of truth for keys).
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Formats: typeof formats;
    Messages: typeof messages;
  }
}
