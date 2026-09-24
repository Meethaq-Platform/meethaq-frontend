import type { useTranslations } from "next-intl";

// A translator scoped to one namespace, for code that builds user-facing
// text outside a component render (e.g. zod schema factories).
export type Translator<
  Namespace extends NonNullable<Parameters<typeof useTranslations>[0]>,
> =
  ReturnType<typeof useTranslations<Namespace>>;
