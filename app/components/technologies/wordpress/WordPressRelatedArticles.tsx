import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type RelatedArticle = { title: string; description: string; slug: string };

export default function WordPressRelatedArticles() {
  const t = useTranslations("WordPressPage.relatedArticles");
  const locale = useLocale();
  const articles = t.raw("items") as RelatedArticle[];

  return (
    <section className="bg-[#0a1a2f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{t("label")}</p>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("title")}</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="flex flex-col rounded-3xl border border-white/10 bg-[#07111f] p-7">
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="mt-4 flex-1 leading-7 text-slate-300">{article.description}</p>
              <Link href={`/${locale}/lab/${article.slug}`} className="mt-7 inline-flex items-center gap-2 font-semibold text-sky-200 transition hover:text-sky-100">
                {t("read")} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
