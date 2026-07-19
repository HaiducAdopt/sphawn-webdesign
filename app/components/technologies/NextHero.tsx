import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function NextHero() {
  const t = useTranslations("NextJsPage.hero");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-[#07111f] px-6 pb-20 pt-28 text-white md:px-10 lg:px-16 lg:pb-28 lg:pt-36">
      <div
        aria-hidden="true"
        className="absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium tracking-wide text-cyan-300">
            {t("badge")}
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("titleStart")}{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {t("description")}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {t("primaryButton")}
            </Link>

            <a
              href="#why-nextjs"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              {t("secondaryButton")}
            </a>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-6 rounded-[2rem] bg-cyan-400/10 blur-3xl"
          />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl shadow-cyan-950/40">
            <Image
              src="/hero-nextjs.webp"
              alt={t("imageAlt")}
              width={1536}
              height={1024}
              priority
              className="h-auto w-full rounded-[1.5rem] object-cover"
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}