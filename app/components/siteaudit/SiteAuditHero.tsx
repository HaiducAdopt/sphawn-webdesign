"use client";

import { useTranslations } from "next-intl";

export default function SiteAuditHero() {
  const t = useTranslations("siteaudit");

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl md:p-12">
      <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          {t("heroEyebrow")}
        </p>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
          {t("heroTitle")}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          {t("heroDescription")}
        </p>
      </div>
    </section>
  );
}