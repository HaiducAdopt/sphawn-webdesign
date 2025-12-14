"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type CaseStudy = {
  id: string;
  title: string;
  subtitle: string;
  type: "Real project" | "Demo shop";
  tech: string[];
  description: string;
  url?: string;
  image?: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: "haiducadopt",
    title: "HaiducAdopt.com",
    subtitle: "Dog adoption platform for all of Europe",
    type: "Real project",
    tech: ["Next.js", "React", "Tailwind CSS", "Firebase", "Vercel"],
    description:
      "A full web app with user profiles, dog profiles, messaging, filters, SEO, affiliate links and admin area.",
    url: "https://www.haiducadopt.com",
    image: "/portfolio/haiducadopt.png",
  },
  {
    id: "hhs",
    title: "Haiduc Honden Services",
    subtitle: "Local dog services presentation website",
    type: "Real project",
    tech: ["Next.js", "React", "Tailwind CSS"],
    description:
      "A presentation website for local dog services, focused on clarity, trust and easy contact.",
    url: "https://www.haiduchondenservices.nl",
    image: "/portfolio/haiduchondenservices.png",
  },
  {
    id: "wp-presentation",
    title: "Business Website (WordPress)",
    subtitle: "Classic presentation website demo",
    type: "Demo shop",
    tech: ["WordPress", "Custom theme", "Elementor / Gutenberg"],
    description:
      "Demo project showing how a small business can have a clean, editable WordPress website with blog & contact.",
    url: "#",
    image: "/portfolio/wordpresssite.png",
  },
  {
    id: "woocommerce-shop",
    title: "Parts Store (WooCommerce)",
    subtitle: "Small e-commerce for niche products",
    type: "Demo shop",
    tech: ["WordPress", "WooCommerce", "Stripe / iDEAL"],
    description:
      "Demo WooCommerce shop with product categories, filters and a simple checkout flow for small inventories.",
    url: "#",
    image: "/portfolio/woocommerce.png",
  },
  {
    id: "shopify-store",
    title: "Lifestyle Brand (Shopify)",
    subtitle: "Modern Shopify storefront demo",
    type: "Demo shop",
    tech: ["Shopify", "Theme customization"],
    description:
      "Demo Shopify store to show how I can customize themes, structure collections and optimize product pages.",
    url: "#",
    image: "/portfolio/shopify.png",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-600/70 bg-slate-900/70 px-2.5 py-1 text-[12px] sm:text-[10px] font-medium uppercase tracking-[0.16em] text-slate-200 whitespace-nowrap">
      {children}
    </span>
  );
}

export default function CaseStudiesSection() {
  return (
    <section className="mt-4 space-y-6">
      {/* Header secțiune */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {/* was text-xl OK, keep */}
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Case studies & real projects
          </h2>

          {/* was text-sm — bump mobile */}
          <p className="mt-1 max-w-2xl text-[15px] sm:text-sm leading-relaxed text-slate-300/90">
            A quick overview of the projects I&apos;ve designed and built, plus
            a few demo shops to show what&apos;s possible with WordPress,
            WooCommerce and Shopify.
          </p>
        </div>

        {/* was text-xs — bump mobile */}
        <p className="text-[13px] sm:text-xs text-slate-400">
          More in-depth breakdowns coming soon.
        </p>
      </header>

      {/* Grid proiecte */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {caseStudies.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.85)] ring-1 ring-slate-900/70 transition hover:-translate-y-1.5 hover:border-cyan-400/60 hover:ring-cyan-400/40"
          >
            {/* ribbon glow fin */}
            <div className="pointer-events-none absolute -right-16 top-8 h-6 w-32 rotate-45 bg-gradient-to-r from-cyan-400/70 to-fuchsia-500/70 opacity-0 blur-[2px] transition-opacity duration-300 group-hover:opacity-100" />

            {/* Titlu + tip */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {/* was text-base OK */}
                <h3 className="truncate text-base font-semibold text-slate-50">
                  {item.title}
                </h3>

                {/* was 11px — bump mobile */}
                <p className="mt-0.5 truncate text-[13px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  {item.subtitle}
                </p>
              </div>

              <Badge>{item.type}</Badge>
            </div>

            {/* Thumbnail */}
            {item.image && (
              <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl border border-slate-800/60">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-400 group-hover:scale-[1.03] group-hover:brightness-110"
                />
              </div>
            )}

            {/* Descriere – was text-sm OK, keep but add leading */}
            <p className="mt-3 text-[15px] sm:text-sm leading-relaxed text-slate-300/90 break-words">
              {item.description}
            </p>

            {/* Tech stack – was 11px, bump mobile */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[13px] sm:text-[11px] text-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Footer card */}
            <div className="mt-4 flex items-center justify-between gap-3 text-[13px] sm:text-[11px]">
              {item.url && item.url !== "#" ? (
                <Link
                  href={item.url}
                  target="_blank"
                  className="font-semibold text-cyan-300 hover:text-cyan-200 whitespace-nowrap"
                >
                  View live project ↗
                </Link>
              ) : (
                <span className="text-slate-400">Demo / coming soon</span>
              )}

              {/* was 10px — bump mobile */}
              <span className="uppercase tracking-[0.18em] text-[12px] sm:text-[10px] text-slate-500 whitespace-nowrap">
                Designed in Figma · Built by me
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
