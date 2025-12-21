"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LocaleLink from "./LocaleLink";
import LanguageSwitch from "./LanguageSwitch";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navbar");

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* BARĂ SUPERIOARĂ */}
      <div className="bg-gradient-to-b from-[#050B16]/95 to-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <LocaleLink href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={256}
              height={128}
              className="h-12 sm:h-16 w-auto hover:opacity-90 transition-opacity"
              priority
            />
          </LocaleLink>

          {/* MENIU DESKTOP */}
          <nav
            className="hidden md:flex flex-wrap items-center gap-6 text-[14px] sm:text-[16px]"
            aria-label="Main navigation"
          >
            <LocaleLink
              href="/process"
              className="font-normal text-slate-100 hover:text-[#BC4EF0] transition-colors"
            >
              {t("process")}
            </LocaleLink>

            <LocaleLink
              href="/portfolio"
              className="font-normal text-slate-100 hover:text-[#BC4EF0] transition-colors"
            >
              {t("portfolio")}
            </LocaleLink>

            <LocaleLink
              href="/contact"
              className="font-normal text-slate-100 hover:text-[#BC4EF0] transition-colors"
            >
              {t("contact")}
            </LocaleLink>

            <LanguageSwitch />
          </nav>

          {/* HAMBURGER */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2.5 rounded-full border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-[#BC4EF0]"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <div className="space-y-1.5">
              <span className={`block h-[2px] w-6 bg-slate-100 ${isOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`block h-[2px] w-6 bg-slate-100 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] w-6 bg-slate-100 ${isOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* MENIU MOBIL */}
      {isOpen && (
        <div className="md:hidden">
          <div className="absolute inset-x-0 top-full bg-[#050B16]/95 backdrop-blur-sm border-t border-white/10 shadow-xl">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4 text-[17px]">
              <div className="pb-2">
                <LanguageSwitch />
              </div>

              <LocaleLink href="/process" onClick={() => setIsOpen(false)}>
                {t("process")}
              </LocaleLink>

              <LocaleLink href="/portfolio" onClick={() => setIsOpen(false)}>
                {t("portfolio")}
              </LocaleLink>

              <LocaleLink href="/contact" onClick={() => setIsOpen(false)}>
                {t("contact")}
              </LocaleLink>

              <div className="pt-3">
                <LocaleLink
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#BC4EF0] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {t("cta")}
                </LocaleLink>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
