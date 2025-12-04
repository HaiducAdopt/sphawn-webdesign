"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* BARĂ SUPERIOARĂ */}
      <div className="bg-gradient-to-b from-[#050B16]/95 to-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={256}
              height={128}
              className="h-12 sm:h-16 w-auto hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* BUTON HAMBURGER – doar pe mobil */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2.5 rounded-full border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-[#BC4EF0] focus:outline-none focus:ring-2 focus:ring-[#BC4EF0] focus:ring-offset-2 focus:ring-offset-[#050B16]"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
              <span
                className={`block h-[2px] w-6 bg-slate-100 transition-transform ${
                  isOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-slate-100 transition-opacity ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-slate-100 transition-transform ${
                  isOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>

          {/* MENIU DESKTOP */}
          <nav
            className="hidden md:flex flex-wrap items-center gap-6 text-[14px] sm:text-[16px]"
            aria-label="Main navigation"
          >
            <Link
              href="/process"
              className="font-normal text-slate-100 hover:text-[#BC4EF0] transition-colors"
            >
              Process
            </Link>
            <Link
              href="/portofolio"
              className="font-normal text-slate-100 hover:text-[#BC4EF0] transition-colors"
            >
              Portofolio
            </Link>
            <Link
              href="/contact"
              className="font-normal text-slate-100 hover:text-[#BC4EF0] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* MENIU MOBIL (overlay) */}
      {isOpen && (
        <div className="md:hidden">
          <div className="absolute inset-x-0 top-full bg-[#050B16]/95 backdrop-blur-sm border-t border-white/10 shadow-xl">
            <nav
              className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4 text-[17px]"
              aria-label="Mobile navigation"
            >
              <Link
                href="/process"
                className="font-medium text-slate-50 hover:text-[#BC4EF0] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Process
              </Link>
              <Link
                href="/portofolio"
                className="font-medium text-slate-50 hover:text-[#BC4EF0] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Portofolio
              </Link>
              <Link
                href="/contact"
                className="font-medium text-slate-50 hover:text-[#BC4EF0] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-3">
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#BC4EF0] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#BC4EF0]/30 hover:bg-[#a138e0] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Let&apos;s talk about your website
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
