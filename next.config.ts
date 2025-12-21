import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// legăm next-intl de fișierul tău de config
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);
