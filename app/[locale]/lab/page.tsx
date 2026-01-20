// app/[locale]/lab/page.tsx
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firestore";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function LabIndexPage({
  params,
}: {
  params: Promise<{ locale: "en" | "nl" }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "lab",
  });

  const q = query(
    collection(db, "labArticles"),
    where("status", "==", "published"),
    where("locale", "==", locale),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  const articles = snap.docs.map((doc) => ({
    id: doc.id,
    slug: doc.data().slug as string,
    title: doc.data().title as string,
    excerpt: doc.data().excerpt as string | undefined,
    coverImage: doc.data().coverImage as string | undefined,
  }));

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main className="relative bg-[#0A1A2F] text-white overflow-hidden min-h-screen">
      {/* BACKGROUND BLUR – SPHAWN */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* TEXT */}
          <div>
            <h1 className="text-[36px] sm:text-[48px] font-bold mb-6">
              {t("title")}
            </h1>

            <p className="text-white/70 max-w-xl text-[18px] leading-relaxed">
              {t("description")}
            </p>

            {/* META */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/50">
              <span>→ Web Architecture</span>
              <span>→ SEO & AI</span>
              <span>→ Experiments</span>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="hidden lg:flex justify-end">
            <img
              src="/lab-hero.png"
              alt="Sphawn Lab"
              className="max-w-[420px] w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {featured && (
        <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
          <p className="text-sm tracking-widest text-white/50 mb-6">
            FEATURED ARTICLE
          </p>

          <Link
            href={`/${locale}/lab/${featured.slug}`}
            className="
              group
              grid grid-cols-1 sm:grid-cols-[260px_1fr]
              gap-8
              items-center
            "
          >
            {/* IMAGE */}
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              {featured.coverImage ? (
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="h-[160px] flex items-center justify-center text-white/30 text-sm">
                  No image
                </div>
              )}
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-[26px] sm:text-[32px] font-semibold mb-3 group-hover:text-[#00E1F0] transition">
                {featured.title}
              </h2>

              {featured.excerpt && (
                <p className="text-white/70 max-w-2xl leading-relaxed mb-4">
                  {featured.excerpt}
                </p>
              )}

              <span className="text-sm text-[#00E1F0]">
                {t("readArticle")} →
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ARTICLES STREAM */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <ul className="space-y-14">
          {rest.map((a) => (
            <li
              key={a.id}
              className="
                group
                grid grid-cols-1 sm:grid-cols-[200px_1fr]
                gap-6
                border-b border-white/10
                pb-10
              "
            >
              {/* THUMB */}
              <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
                {a.coverImage ? (
                  <img
                    src={a.coverImage}
                    alt={a.title}
                    className="w-full h-auto object-contain"
                  />
                ) : (
                  <div className="h-[100px] flex items-center justify-center text-white/30 text-sm">
                    No image
                  </div>
                )}
              </div>

              {/* TEXT */}
              <div>
                <h3 className="text-[20px] sm:text-[24px] font-medium mb-2 group-hover:text-[#00E1F0] transition">
                  {a.title}
                </h3>

                {a.excerpt && (
                  <p className="text-white/60 max-w-2xl leading-relaxed mb-3">
                    {a.excerpt}
                  </p>
                )}

                <Link
                  href={`/${locale}/lab/${a.slug}`}
                  className="text-sm text-[#00E1F0] hover:underline"
                >
                  {t("readArticle")}
                </Link>
              </div>
            </li>
          ))}

          {articles.length === 0 && (
            <p className="text-white/60">
              {t("empty")}
            </p>
          )}
        </ul>
      </section>
    </main>
  );
}
