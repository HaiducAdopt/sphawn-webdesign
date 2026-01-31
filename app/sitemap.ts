import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sphawn.nl";

  const routes = [
    "",
    "/offers",
    "/portfolio",
    "/process",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/webdesign-heerlen",
    "/webdesign-limburg",
    "/lab",
  ];

  const locales = ["en", "nl"];

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "monthly" : "yearly",
      priority: route === "" ? 1.0 : 0.7,
    }))
  );
}
