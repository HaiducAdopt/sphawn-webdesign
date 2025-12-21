// app/webdesign-heerlen/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LocaleLink from "../components/LocaleLink";

type Props = {
  params: { locale: "nl" | "en" };
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("webdesignHeerlen.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}




export default async function WebdesignHeerlenPage() {
  const t = await getTranslations("webdesignHeerlen.page");

  // Arrays (must be arrays in JSON)
  const serviceItems = t.raw("services.items") as string[];
  const techFeatures = t.raw("tech.features") as Array<{
    title: string;
    description: string;
  }>;
  const processSteps = t.raw("process.steps") as string[];
  const faqItems = t.raw("faq.items") as Array<{
    question: string;
    answer: string;
  }>;
  const asideItems = t.raw("aside.items") as string[];

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG secundar – cercuri blur */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-20">
        {/* HERO */}
        <header className="mb-10 sm:mb-12">
          <p className="text-[13px] sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase">
            {t("hero.label")}
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("hero.title")}
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] sm:text-base leading-relaxed text-slate-300/90">
            {t("hero.description")}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <LocaleLink
              href="/contact"
              className="
                inline-flex items-center justify-center
                text-[16px] font-bold
                px-6 py-3 rounded-[25px]
                bg-[#00E1F0] text-black
                border border-[#9747FF]
                transition-all duration-300
                hover:brightness-110 hover:shadow-[0_0_15px_rgba(148,70,255,0.5)]
              "
            >
              {t("hero.ctaPrimary")}
            </LocaleLink>

            <LocaleLink
              href="/portfolio"
              className="
                inline-flex items-center justify-center
                text-[16px] font-semibold
                px-6 py-3 rounded-[25px]
                border border-white/15 bg-slate-950/40
                text-slate-100
                transition-all duration-300
                hover:border-cyan-400/60 hover:bg-slate-950/55
              "
            >
              {t("hero.ctaSecondary")}
            </LocaleLink>
          </div>
        </header>

        {/* CONTENT GRID */}
        <section className="grid gap-6 lg:grid-cols-12">
          {/* LEFT: main content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1 */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                {t("services.title")}
              </h2>
              <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-300/85">
                {t("services.description")}
              </p>

              <ul className="mt-4 space-y-2 text-[15px] sm:text-base text-slate-200/90">
                {serviceItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>

            {/* Card 2 */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                {t("tech.title")}
              </h2>
              <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-300/85">
                {t("tech.description")}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {techFeatures.map((x) => (
                  <div
                    key={x.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <p className="text-[16px] font-semibold text-slate-50">
                      {x.title}
                    </p>
                    <p className="mt-1 text-[14px] leading-relaxed text-slate-300/85">
                      {x.description}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* Card 3 */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                {t("local.title")}
              </h2>
              <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-300/85">
                {t("local.description")}
              </p>
            </article>

            {/* Card 4: Process */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                {t("process.title")}
              </h2>

              <ol className="mt-4 space-y-3 text-[15px] sm:text-base text-slate-200/90">
                {processSteps.map((step, idx) => (
                  <li key={step}>
                    <span className="font-semibold text-cyan-200">{idx + 1}.</span>{" "}
                    {step}
                  </li>
                ))}
              </ol>

              <div className="mt-6">
                <LocaleLink
                  href="/contact"
                  className="inline-flex items-center font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  {t("process.cta")}
                </LocaleLink>
              </div>
            </article>

            {/* FAQ */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                {t("faq.title")}
              </h2>

              <div className="mt-4 space-y-4">
                {faqItems.map((f) => (
                  <div
                    key={f.question}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <p className="text-[16px] font-semibold text-slate-50">
                      {f.question}
                    </p>
                    <p className="mt-1 text-[15px] sm:text-base leading-relaxed text-slate-300/85">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* CTA bottom */}
            <article className="rounded-3xl border border-cyan-500/20 bg-slate-950/50 p-6 shadow-[0_0_35px_rgba(34,211,238,0.15)] backdrop-blur">
              <h2 className="text-2xl font-semibold text-slate-50">
                {t("ctaBottom.title")}
              </h2>
              <p className="mt-2 text-[15px] sm:text-base leading-relaxed text-slate-300/90">
                {t("ctaBottom.description")}
              </p>

              <div className="mt-5">
                <LocaleLink
                  href="/contact"
                  className="
                    inline-flex items-center justify-center
                    text-[16px] font-bold
                    px-6 py-3 rounded-[25px]
                    bg-[#00E1F0] text-black
                    border border-[#9747FF]
                    transition-all duration-300
                    hover:brightness-110 hover:shadow-[0_0_15px_rgba(148,70,255,0.5)]
                  "
                >
                  {t("ctaBottom.button")}
                </LocaleLink>
              </div>
            </article>
          </div>

          {/* RIGHT: sticky summary card */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <p className="text-[13px] uppercase tracking-[0.3em] text-slate-400 font-semibold">
                {t("aside.label")}
              </p>

              <h3 className="mt-2 text-lg font-semibold text-slate-50">
                {t("aside.title")}
              </h3>

              <ul className="mt-4 space-y-2 text-[15px] text-slate-200/90">
                {asideItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>

              <div className="mt-6">
                <LocaleLink
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-[20px] border border-white/15 bg-slate-950/40 px-4 py-3 text-[16px] font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:bg-slate-950/55"
                >
                  {t("aside.button")}
                </LocaleLink>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-slate-400">
                {t("aside.keywords")}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
