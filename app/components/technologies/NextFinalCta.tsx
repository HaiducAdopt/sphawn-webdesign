import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function NextFinalCta() {
  const t = useTranslations("NextJsPage.finalCta");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-[#07111f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] px-7 py-14 text-center shadow-2xl sm:px-12 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          {t("label")}
        </p>

        <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t("title")}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          {t("description")}
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {t("primaryButton")}
          </Link>

          <Link
            href={`/${locale}/process`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[0.04] px-6 py-3 font-semibold text-white transition hover:bg-white/[0.09]"
          >
            {t("secondaryButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}