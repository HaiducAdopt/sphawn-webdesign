// app/offers/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import OffersIntelligentForm from "../components/OffersIntelligentForm";
import PricingFlipCards from "../components/PricingFlipCards";

type Card = { title: string; items: string[] };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("offersMeta");

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: { canonical: "/offers" },

    openGraph: {
      title,
      description,
      url: "/offers",
      type: "website",
      images: [
        {
          url: "https://www.sphawn.nl/offers-og.png",
          width: 1200,
          height: 900,
          alt: title
        }
      ]
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.sphawn.nl/offers-og.png"]
    }
  };
}

export default async function OffersPage() {
  const t = await getTranslations("offersPage");

  const cards = t.raw("cards") as Card[];

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG blur circles */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-24">
        {/* HERO: imagine stânga + text dreapta */}
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Image LEFT */}
          <div className="lg:col-span-6 order-1">
            <Image
              src="/herro-oferte.png"
              alt={t("hero.imageAlt")}
              width={1200}
              height={900}
              priority
              className="w-full h-auto select-none"
            />
          </div>

          {/* Text RIGHT */}
          <div className="lg:col-span-6 order-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              {t("hero.title")}
            </h1>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="
                  inline-flex items-center justify-center
                  rounded-full
                  border border-slate-700/70
                  bg-slate-950/30
                  px-6 py-3
                  text-slate-100
                  font-semibold
                  hover:border-cyan-400/60
                  hover:bg-slate-950/50
                  transition
                "
              >
                {t("hero.ctaContact")}
              </Link>

              <a
                href="#offer-form"
                className="
                  inline-flex items-center justify-center
                  rounded-full
                  bg-gradient-to-r from-cyan-400 to-fuchsia-500
                  px-6 py-3
                  text-slate-950
                  font-semibold
                  shadow-lg shadow-fuchsia-500/25
                  hover:brightness-110
                  transition
                "
              >
                {t("hero.ctaStart")}
              </a>
            </div>
          </div>
        </div>

        {/* Regulile jocului */}
        <div className="mt-10 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.6)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase">
                {t("rules.label")}
              </p>

              <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-white">
                {t("rules.title")}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                {t("rules.p1")}
              </p>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                {t("rules.p2")}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-cyan-400/20 bg-slate-950/40 px-4 py-4 text-center shadow-[0_0_30px_rgba(56,189,248,0.15)]">
              <div className="mx-auto mb-3 flex h-16 w-24 items-center justify-center rounded-xl bg-slate-900/40">
                <img
                  src="/figma.png"
                  alt="Figma"
                  className="max-h-full max-w-full object-contain opacity-85"
                />
              </div>

              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                {t("rules.badgeTop")}
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {t("rules.badgeTitle")}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {t("rules.badgeSub")}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t("rules.note")}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((c, idx) => (
            <div
              key={`${c.title}-${idx}`}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 backdrop-blur-xl"
            >
              <h2 className="text-lg font-semibold mb-3">{c.title}</h2>
              <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                {c.items.map((it, i) => (
                  <li key={`${c.title}-${i}`}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FORM – full width */}
        <div
          id="offer-form"
          className="mt-20 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.75)]"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">{t("formBox.title")}</h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              {t("formBox.desc")}
            </p>
          </div>

          <OffersIntelligentForm />
        </div>

        {/* PACKAGES (sub formular) */}
        <div className="mt-10">
          <PricingFlipCards />
        </div>

        {/* Small note */}
        <div className="mt-8 rounded-2xl border border-slate-800/70 bg-slate-950/30 p-5 backdrop-blur-xl">
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="text-white font-semibold">{t("noteBox.textStrong")}</span>{" "}
            {t("noteBox.text")}
          </p>
        </div>
      </section>
    </main>
  );
}
