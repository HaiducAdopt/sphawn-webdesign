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
    <header className="fixed left-0 top-0 z-50 w-full">
      {/* BARĂ SUPERIOARĂ */}
      <div className="bg-gradient-to-b from-[#050B16]/95 to-transparent backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* LOGO */}
          <LocaleLink href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Sphawn"
              width={256}
              height={128}
              className="h-12 w-auto transition-opacity hover:opacity-90 sm:h-16"
              priority
            />
          </LocaleLink>

          {/* MENIU DESKTOP */}
          <nav
            className="hidden flex-wrap items-center gap-6 text-[14px] md:flex sm:text-[16px]"
            aria-label="Main navigation"
          >
            <LocaleLink
              href="/process"
              className="font-normal text-slate-100 transition-colors hover:text-[#BC4EF0]"
            >
              {t("process")}
            </LocaleLink>

            <LocaleLink
              href="/portfolio"
              className="font-normal text-slate-100 transition-colors hover:text-[#BC4EF0]"
            >
              {t("portfolio")}
            </LocaleLink>

            {/* TECHNOLOGIES DROPDOWN */}
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 font-normal text-slate-100 transition-colors hover:text-[#00E1F0] group-focus-within:text-[#00E1F0]"
                aria-haspopup="true"
              >
                {t("technologies")}

                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.092 1.028l-4.256 4.516a.75.75 0 0 1-1.092 0L5.21 8.258a.75.75 0 0 1 .02-1.048Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div
                className="
                  invisible absolute left-0 top-full pt-3 opacity-0
                  transition-all duration-200
                  group-hover:visible group-hover:opacity-100
                  group-focus-within:visible group-focus-within:opacity-100
                "
              >
                <div className="min-w-48 rounded-2xl border border-white/10 bg-[#07111f]/95 p-2 shadow-2xl backdrop-blur-xl">
                  <LocaleLink
                    href="/technologies/nextjs"
                    className="block rounded-xl px-4 py-3 text-slate-100 transition-colors hover:bg-white/10 hover:text-[#00E1F0]"
                  >
                    {t("nextjs")}
                  </LocaleLink>
                </div>
              </div>
            </div>

            <LocaleLink
              href="/lab"
              className="font-normal text-slate-100 transition-colors hover:text-[#00E1F0]"
            >
              {t("lab")}
            </LocaleLink>

            <LocaleLink
              href="/offers"
              className="font-normal text-slate-100 transition-colors hover:text-[#BC4EF0]"
            >
              {t("offers")}
            </LocaleLink>

            <LocaleLink
              href="/contact"
              className="font-normal text-slate-100 transition-colors hover:text-[#BC4EF0]"
            >
              {t("contact")}
            </LocaleLink>

            <LanguageSwitch />
          </nav>

          {/* HAMBURGER */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 p-2.5 text-slate-100 hover:bg-white/10 hover:text-[#BC4EF0] md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            <div className="space-y-1.5">
              <span
                className={`block h-[2px] w-6 bg-slate-100 transition-transform ${
                  isOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />

              <span
                className={`block h-[2px] w-6 bg-slate-100 transition-opacity ${
                  isOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`block h-[2px] w-6 bg-slate-100 transition-transform ${
                  isOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* MENIU MOBIL */}
      {isOpen && (
        <div className="md:hidden">
          <div className="absolute inset-x-0 top-full border-t border-white/10 bg-[#050B16]/95 shadow-xl backdrop-blur-sm">
            <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[17px] sm:px-6">
              <div className="pb-2">
                <LanguageSwitch />
              </div>

              <LocaleLink
                href="/process"
                onClick={() => setIsOpen(false)}
                className="text-slate-100 hover:text-[#BC4EF0]"
              >
                {t("process")}
              </LocaleLink>

              <LocaleLink
                href="/portfolio"
                onClick={() => setIsOpen(false)}
                className="text-slate-100 hover:text-[#BC4EF0]"
              >
                {t("portfolio")}
              </LocaleLink>

              {/* TECHNOLOGIES MOBILE */}
              <div className="border-y border-white/10 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
                  {t("technologies")}
                </p>

                <LocaleLink
                  href="/technologies/nextjs"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 block pl-3 text-slate-100 transition-colors hover:text-[#00E1F0]"
                >
                  {t("nextjs")}
                </LocaleLink>
              </div>

              <LocaleLink
                href="/lab"
                onClick={() => setIsOpen(false)}
                className="
                  relative font-normal text-slate-100
                  after:absolute after:-bottom-1 after:left-0
                  after:h-[2px] after:w-0 after:bg-[#00E1F0]
                  after:transition-all after:duration-300
                  hover:text-[#00E1F0] hover:after:w-full
                "
              >
                {t("lab")}
              </LocaleLink>

              <LocaleLink
                href="/offers"
                onClick={() => setIsOpen(false)}
                className="text-slate-100 hover:text-[#BC4EF0]"
              >
                {t("offers")}
              </LocaleLink>

              <LocaleLink
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-slate-100 hover:text-[#BC4EF0]"
              >
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