import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function NextSeoAi() {
  const t = useTranslations("NextJsPage.seoAi");
  const locale = useLocale();

  return (
    <section className="bg-[#07111f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
              {t("label")}
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <div className="mt-7 space-y-5 text-lg leading-8 text-slate-300">
              <p>{t("paragraphOne")}</p>
              <p>{t("paragraphTwo")}</p>
            </div>

            <Link
              href={`/${locale}/lab/how-google-and-ai-see-your-website`}
              className="mt-8 inline-flex items-center gap-2 font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              {t("articleButton")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-6">
            <article className="rounded-3xl border border-cyan-300/20 bg-cyan-400/[0.06] p-8">
              <h3 className="text-2xl font-semibold">
                {t("auditTitle")}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {t("auditText")}
              </p>

              <Link
                href={`/${locale}/siteaudit`}
                className="mt-7 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                {t("auditButton")}
              </Link>
            </article>

            <article className="rounded-3xl border border-purple-300/20 bg-purple-400/[0.06] p-8">
              <h3 className="text-2xl font-semibold">
                {t("securityTitle")}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {t("securityText")}
              </p>

              <Link
                href={`/${locale}/security-audit`}
                className="mt-7 inline-flex rounded-xl border border-white/20 bg-white/[0.05] px-5 py-3 font-semibold text-white transition hover:bg-white/[0.1]"
              >
                {t("securityButton")}
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}