import { useTranslations } from "next-intl";

export default function NextIntroduction() {
  const t = useTranslations("NextJsPage.introduction");

  return (
    <section
      id="why-nextjs"
      className="bg-[#0a1a2f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {t("label")}
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <div className="mt-8 space-y-6 text-lg leading-8 text-slate-300">
            <p>{t("paragraphOne")}</p>
            <p>{t("paragraphTwo")}</p>
            <p>{t("paragraphThree")}</p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-sm font-bold tracking-wider text-cyan-300">
              UX
            </div>

            <h3 className="text-2xl font-semibold">
              {t("businessTitle")}
            </h3>

            <p className="mt-4 leading-7 text-slate-300">
              {t("businessText")}
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-sm font-bold tracking-wider text-purple-300">
              DEV
            </div>

            <h3 className="text-2xl font-semibold">
              {t("technicalTitle")}
            </h3>

            <p className="mt-4 leading-7 text-slate-300">
              {t("technicalText")}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}