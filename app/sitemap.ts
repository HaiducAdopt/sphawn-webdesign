import { MetadataRoute } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.sphawn.nl";
  const locales = ["en", "nl"] as const;

  const staticRoutes = [
    "",
    "/offers",
    "/portfolio",
    "/process",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/lab",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "monthly" : "yearly",
      priority: route === "" ? 1 : 0.7,
    }))
  );

  const labSnap = await getDocs(
    query(
      collection(db, "labArticles"),
      where("status", "==", "published")
    )
  );

  const labEntries: MetadataRoute.Sitemap = labSnap.docs.map((doc) => {
    const data = doc.data();

    return {
      url: `${baseUrl}/${data.locale}/lab/${data.slug}`,
      lastModified: data.updatedAt?.toDate?.() ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [...staticEntries, ...labEntries];
}
