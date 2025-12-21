// app/[locale]/portfolio/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CaseStudiesSection from "../components/CaseStudiesSection";
import HomeConceptsSection from "../components/HomeConceptsSection";
import LocaleLink from "../components/LocaleLink";

type Props = {
  params: { locale: "nl" | "en" };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "portfolio.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PortfolioPage() {
  const t = await getTranslations("portfolio.page");

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG secundar – cercuri blur */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-24 md:px-8 lg:pt-28">
        {/* Hero mic */}
        <header className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {t("pill")}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            {t("headline.beforeFigma")}{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">
              {t("headline.figma")}
            </span>{" "}
            {t("headline.afterFigma")}{" "}
            <span className="bg-gradient-to-r from-sky-300 to-cyan-400 bg-clip-text text-transparent">
              {t("headline.stack")}
            </span>
            {t("headline.end")}
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            {t("intro")}
          </p>
        </header>

        {/* Secțiunea 1 */}
        <CaseStudiesSection />

        {/* Secțiunea 2 */}
        <HomeConceptsSection />

        {/* CTA final */}
        <section className="mt-6 rounded-2xl border border-cyan-400/25 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80 px-6 py-8 shadow-[0_0_40px_rgba(34,211,238,0.25)] sm:px-10 sm:py-10">
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            {t("cta.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300/90 sm:text-base">
            {t("cta.text")}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <LocaleLink
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110"
            >
              {t("cta.primary")}
            </LocaleLink>

            <LocaleLink
              href="/process"
              className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/60 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 hover:border-cyan-300/70 hover:text-cyan-200"
            >
              {t("cta.secondary")}
            </LocaleLink>
          </div>
        </section>
      </section>
    </main>
  );
}
