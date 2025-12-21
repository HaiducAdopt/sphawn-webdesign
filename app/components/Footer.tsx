"use client";

import { useTranslations } from "next-intl";
import LocaleLink from "./LocaleLink";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-transparent backdrop-transparent py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* RÂND LINKURI */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
          
          {/* STÂNGA – SEO pages */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <LocaleLink
              href="/webdesign-heerlen"
              className="text-[11px] sm:text-[12px] font-normal text-slate-300 hover:text-cyan-300 transition-colors"
            >
              {t("seoHeerlen")}
            </LocaleLink>

            <LocaleLink
              href="/webdesign-limburg"
              className="text-[11px] sm:text-[12px] font-normal text-slate-300 hover:text-cyan-300 transition-colors"
            >
              {t("seoLimburg")}
            </LocaleLink>
          </div>

          {/* DREAPTA – legal pages */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start sm:justify-end">
            <LocaleLink
              href="/privacy-policy"
              className="text-[11px] sm:text-[12px] font-light text-slate-400 hover:text-slate-200 transition-colors"
            >
              {t("privacy")}
            </LocaleLink>

            <LocaleLink
              href="/terms"
              className="text-[11px] sm:text-[12px] font-light text-slate-400 hover:text-slate-200 transition-colors"
            >
              {t("terms")}
            </LocaleLink>

            <LocaleLink
              href="/cookie-statement"
              className="text-[11px] sm:text-[12px] font-light text-slate-400 hover:text-slate-200 transition-colors"
            >
              {t("cookies")}
            </LocaleLink>
          </div>
        </div>

        {/* COPYRIGHT */}
        <p className="text-[11px] sm:text-[12px] font-light text-slate-500 text-right mb-2">
          {t("copyright")}
        </p>

        {/* BARA GRADIENT */}
        <div
          className="w-full h-[6px] rounded-[3px]"
          style={{
            background: "linear-gradient(90deg, #099CB6 0%, #BC4EF0 100%)",
          }}
        />
      </div>
    </footer>
  );
}
