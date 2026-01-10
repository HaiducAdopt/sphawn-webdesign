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
    alternates: { canonical: "/offers" }
  };
}

export default async function OffersPage() {
  const t = await getTranslations("offersPage");

  const cards = t.raw("cards") as Card[];
  const faqItems = t.raw("faq.items") as FAQItem[];

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-24">

        {/* HERO */}
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Image
              src="/herro-oferte.png"
              alt={t("hero.imageAlt")}
              width={1200}
              height={900}
              priority
            />
          </div>

          <div className="lg:col-span-6">
            <h1 className="text-4xl lg:text-6xl font-bold">
              {t("hero.title")}
            </h1>

            <div className="mt-6 flex gap-4">
              <Link href="/contact" className="rounded-full border px-6 py-3">
                {t("hero.ctaContact")}
              </Link>
              <a href="#offer-form" className="rounded-full bg-cyan-400 px-6 py-3 text-black font-semibold">
                {t("hero.ctaStart")}
              </a>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <div key={i} className="rounded-2xl border p-6">
              <h2 className="font-semibold mb-3">{c.title}</h2>
              <ul className="list-disc list-inside text-sm text-slate-300">
                {c.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div id="offer-form" className="mt-20 rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">
            {t("formBox.title")}
          </h2>
          <p className="mt-2 text-slate-400">
            {t("formBox.desc")}
          </p>
          <OffersIntelligentForm />
        </div>

        {/* PACKAGES */}
        <div className="mt-10">
          <PricingFlipCards />
        </div>

{/* FAQ SECTION */}
<section className="mt-20 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl">
  <h2 className="text-2xl font-semibold mb-6">
    {t("faq.title")}
  </h2>

  <div className="space-y-4">
    {faqItems.map((item, i) => (
      <details
        key={i}
        className="group rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 transition"
      >
        <summary
          className="
            flex cursor-pointer list-none items-center justify-between
            font-semibold text-white
          "
        >
          <span>{item.q}</span>

          {/* icon */}
          <span
            className="
              ml-4 text-xl text-cyan-400
              transition-transform duration-300
              group-open:rotate-45
            "
          >
            +
          </span>
        </summary>

        <div
          className="
            mt-3 overflow-hidden
            text-sm text-slate-300 leading-relaxed
            animate-fade-in
          "
        >
          {item.a}
        </div>
      </details>
    ))}
  </div>
</section>


      </section>
    </main>
  );
}
