import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Picks up src/i18n/request.ts (cookie-based locale, no i18n routing).
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storyset.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
