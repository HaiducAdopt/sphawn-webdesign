// app/sitemap.xml/route.ts
import { MetadataRoute } from "next";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.sphawn.nl";
  const locales = ["en", "nl"];

  /* ------------------------
   * STATIC ROUTES
   * ------------------------ */
  const staticRoutes = [
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

  const staticEntries = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "monthly" : "yearly",
      priority: route === "" ? 1.0 : 0.7,
    }))
  );

  /* ------------------------
   * LAB ARTICLES (Firestore)
   * ------------------------ */
  const articlesQuery = query(
    collection(db, "labArticles"),
    where("status", "==", "published")
  );

  const snapshot = await getDocs(articlesQuery);

  const articleEntries = snapshot.docs.flatMap((doc) => {
    const data = doc.data();
    const slug = data.slug;
    const locale = data.locale || "en";

    if (!slug) return [];

    return {
      url: `${baseUrl}/${locale}/lab/${slug}`,
      lastModified: data.updatedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [...staticEntries, ...articleEntries];
}
