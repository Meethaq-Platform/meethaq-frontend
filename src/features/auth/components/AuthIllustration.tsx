import Image from "next/image";
import { useTranslations } from "next-intl";

// Both versions are rendered and the theme class picks one, so there's no
// flash when the theme is known only on the client. They're lazy-loaded
// (no `priority`): a hidden lazy image isn't fetched, so only the visible
// one downloads.
export function AuthIllustration() {
  const t = useTranslations("auth");

  return (
    <div className="hidden z-10 relative lg:flex justify-center items-center">
      <Image
        src="/illustrations/signing-contract.gif"
        alt={t("illustrationAlt")}
        className="dark:hidden w-[550px] h-[550px]"
        width={300}
        height={300}
      />
      <Image
        src="/illustrations/signing-contract-dark.gif"
        alt={t("illustrationAlt")}
        className="hidden dark:block rounded-2xl w-[550px] h-[550px]"
        width={300}
        height={300}
      />
    </div>
  );
}
