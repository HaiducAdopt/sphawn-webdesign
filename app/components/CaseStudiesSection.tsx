"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type CaseStudy = {
  id: string;
  typeKey: "real" | "demo";
  tech: string[];
  url?: string;
  image?: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: "haiducadopt",
    typeKey: "real",
    tech: ["Next.js", "React", "Tailwind CSS", "Firebase", "Vercel"],
    url: "https://www.haiducadopt.com",
    image: "/portfolio/haiducadopt.png",
  },
  {
    id: "hhs",
    typeKey: "real",
    tech: ["Next.js", "React", "Tailwind CSS"],
    url: "https://www.haiduchondenservices.nl",
    image: "/portfolio/haiduchondenservices.png",
  },
  {
    id: "wp-presentation",
    typeKey: "demo",
    tech: ["WordPress", "Custom theme", "Elementor / Gutenberg"],
    url: "#",
    image: "/portfolio/wordpresssite.png",
  },
  {
    id: "woocommerce-shop",
    typeKey: "demo",
    tech: ["WordPress", "WooCommerce", "Stripe / iDEAL"],
    url: "#",
    image: "/portfolio/woocommerce.png",
  },
  {
    id: "shopify-store",
    typeKey: "demo",
    tech: ["Shopify", "Theme customization"],
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
  const t = useTranslations("portfolio.caseStudies");

  return (
    <section className="mt-4 space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-1 max-w-2xl text-[15px] sm:text-sm leading-relaxed text-slate-300/90">
            {t("subtitle")}
          </p>
        </div>

        <p className="text-[13px] sm:text-xs text-slate-400">
          {t("note")}
        </p>
      </header>

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
            <div className="pointer-events-none absolute -right-16 top-8 h-6 w-32 rotate-45 bg-gradient-to-r from-cyan-400/70 to-fuchsia-500/70 opacity-0 blur-[2px] transition-opacity duration-300 group-hover:opacity-100" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-50">
                  {t(`items.${item.id}.title`)}
                </h3>
                <p className="mt-0.5 truncate text-[13px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  {t(`items.${item.id}.subtitle`)}
                </p>
              </div>

              <Badge>{t(`types.${item.typeKey}`)}</Badge>
            </div>

            {item.image && (
              <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl border border-slate-800/60">
                <Image
                  src={item.image}
                  alt={t(`items.${item.id}.title`)}
                  fill
                  className="object-cover transition duration-400 group-hover:scale-[1.03] group-hover:brightness-110"
                />
              </div>
            )}

            <p className="mt-3 text-[15px] sm:text-sm leading-relaxed text-slate-300/90 break-words">
              {t(`items.${item.id}.description`)}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[13px] sm:text-[11px] text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-[13px] sm:text-[11px]">
              {item.url && item.url !== "#" ? (
                <Link
                  href={item.url}
                  target="_blank"
                  className="font-semibold text-cyan-300 hover:text-cyan-200 whitespace-nowrap"
                >
                  {t("viewLive")} ↗
                </Link>
              ) : (
                <span className="text-slate-400">{t("comingSoon")}</span>
              )}

              <span className="uppercase tracking-[0.18em] text-[12px] sm:text-[10px] text-slate-500 whitespace-nowrap">
                {t("footerTag")}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
