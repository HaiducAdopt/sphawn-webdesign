import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: false, // 🔥 adaugă asta
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);