// app/offers/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import OffersIntelligentForm from "../components/OffersIntelligentForm";
import PricingFlipCards from "../components/PricingFlipCards";

type Card = { title: string; items: string[] };
type FAQItem = { q: string; a: string };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("offersMeta");

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/offers" },
  };
}

export default async function OffersPage() {
  const t = await getTranslations("offersPage");

  const cards = t.raw("cards") as Card[];
  const faqItems = t.raw("faq.items") as FAQItem[];

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BACKGROUND BLUR */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-400/25 blur-[160px]" />
      <div className="absolute -top-64 -left-40 w-[700px] h-[700px] rounded-full bg-fuchsia-500/25 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-32 pb-28">

        {/* HERO */}
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* TEXT */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t("hero.title")}
            </h1>

            <p className="mt-5 text-lg text-white/70 max-w-xl">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white hover:text-black transition"
              >
                {t("hero.ctaContact")}
              </Link>

              <a
                href="#offer-form"
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black hover:brightness-110 transition"
              >
                {t("hero.ctaStart")}
              </a>
            </div>
          </div>

          {/* IMAGE */}
          <div className="lg:col-span-6">
            <Image
              src="/herro-oferte.png"
              alt={t("hero.imageAlt")}
              width={1200}
              height={900}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm"
            >
              <h2 className="font-semibold mb-3">{c.title}</h2>
              <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                {c.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div
          id="offer-form"
          className="
            mt-24
            max-w-4xl
            mx-auto
            rounded-3xl
            border border-white/10
            bg-white/5
            backdrop-blur-sm
            p-6 sm:p-10
          "
        >
          <h2 className="text-2xl font-semibold">
            {t("formBox.title")}
          </h2>

          <p className="mt-2 text-white/60 max-w-xl">
            {t("formBox.desc")}
          </p>

          <div className="mt-8">
            <OffersIntelligentForm />
          </div>
        </div>

        {/* PACKAGES */}
        <div className="mt-28">
          <PricingFlipCards />
        </div>

        {/* FAQ */}
        <section className="mt-28 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">
            {t("faq.title")}
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  <span>{item.q}</span>
                  <span className="text-cyan-400 text-xl transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

      </section>
    </main>
  );
}
