// app/[locale]/lab/[slug]/page.tsx
import { notFound } from "next/navigation";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firestore";
import ShareButtons from "@/app/components/ShareButtons";
import Link from "next/link";

type LabArticle = {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
};

export default async function LabArticlePage({
  params,
}: {
  params: Promise<{ locale: "en" | "nl"; slug: string }>;
}) {
  const { locale, slug } = await params;

  const siteUrl = "https://www.sphawn.nl";
  const articleUrl = `${siteUrl}/${locale}/lab/${slug}`;

  const q = query(
    collection(db, "labArticles"),
    where("status", "==", "published"),
    where("locale", "==", locale),
    where("slug", "==", slug),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return notFound();

  const article = snap.docs[0].data() as LabArticle;

  return (
    <main className="relative bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG BLUR */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-16">
        <Link
          href={`/${locale}/lab`}
          className="inline-block text-sm text-white/60 hover:text-white mb-6"
        >
          ← Back to Sphawn Lab
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* TEXT */}
          <div className="order-2 lg:order-1">
            <p className="text-[12px] tracking-[0.4em] font-semibold opacity-60 mb-4">
              SPHAWN LAB
            </p>

            {/* DESKTOP TITLE */}
            <h1 className="hidden sm:block font-bold text-[36px] sm:text-[56px] lg:text-[64px] leading-tight mb-6">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-[17px] sm:text-[19px] leading-relaxed text-white/80 mb-6 max-w-2xl">
                {article.excerpt}
              </p>
            )}

            <ShareButtons url={articleUrl} title={article.title} />
          </div>

          {/* IMAGE + MOBILE TITLE */}
          {article.coverImage && (
            <div className="order-1 lg:order-2">
              {/* MOBILE TITLE */}
              <div className="sm:hidden mb-4">
                <h1 className="font-bold text-[22px] leading-snug">
                  {article.title}
                </h1>
              </div>

              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-auto rounded-xl object-contain bg-white/5"
              />
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-white/[0.05] border border-white/10 rounded-xl px-6 sm:px-10 py-10 sm:py-14">
          <article className="prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <div className="flex flex-col sm:flex-row gap-4 border-t border-white/10 pt-10">
          <a
            href={`/${locale}/offers`}
            className="flex-1 text-center px-6 py-3 rounded-md bg-white/5 border border-white/10 hover:bg-white hover:text-black transition"
          >
            View offers
          </a>

          <a
            href={`/${locale}/contact`}
            className="flex-1 text-center px-6 py-3 rounded-md border border-white/20 hover:bg-white hover:text-black transition"
          >
            Contact
          </a>
        </div>
      </section>
    </main>
  );
}
