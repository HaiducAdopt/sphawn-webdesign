"use client";

import { useTranslations } from "next-intl";
import LocaleLink from "./LocaleLink";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG secundar – cercuri blur */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      {/* CONȚINUT */}
      <div
        className="
          relative z-10 max-w-6xl mx-auto 
          px-4 sm:px-6 
          py-10 sm:py-8 
          pt-40 sm:pt-36 md:pt-32 lg:pt-20
        "
      >
        {/* HERO */}
        <section id="hero" className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* STÂNGA – TEXT */}
            <div className="text-white">
              <p className="text-[12px] sm:text-[14px] md:text-[16px] font-semibold tracking-[0.5em] mb-4 sm:mb-6">
                {t("eyebrow")}
              </p>

              {/* H1 */}
              <h1
                className="
                  font-bold 
                  text-[40px] leading-[44px] 
                  sm:text-[60px] sm:leading-[60px] 
                  lg:text-[110px] lg:leading-[90px]
                "
              >
                <div className="hero-line-wrapper">
                  <span className="hero-line hero-line-1">
                    {t("title.line1")}
                  </span>
                </div>
                <div className="hero-line-wrapper">
                  <span className="hero-line hero-line-2">
                    {t("title.line2")}
                  </span>
                </div>
                <div className="hero-line-wrapper">
                  <span className="hero-line hero-line-3">
                    {t("title.line3")}
                  </span>
                </div>
              </h1>

              {/* DESCRIERE */}
              <div className="mt-6 sm:mt-8 max-w-[522px] min-h-[84px]">
                <p className="text-[15px] sm:text-[18px] md:text-[20px] leading-[22px] sm:leading-[24px] md:leading-[26px] font-bold">
                  {t("description")}
                </p>
              </div>
            </div>

            {/* DREAPTA – IMAGINE */}
            <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
              <div className="relative w-full max-w-[260px] sm:max-w-sm md:max-w-md lg:max-w-lg">
                <img
                  src="/hero.png"
                  alt="Neon cloud with code representing modern web development"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-10 flex justify-start">
            <LocaleLink
              href="/contact"
              className="
                inline-block
                text-[14px] sm:text-[16px] font-bold
                px-5 sm:px-6 py-2.5 sm:py-3
                rounded-[25px]
                bg-[#00E1F0]
                text-black
                border border-[#9747FF]
                transition-all duration-300
                hover:brightness-110 hover:shadow-[0_0_15px_rgba(148,70,255,0.5)]
              "
            >
              {t("cta")}
            </LocaleLink>
          </div>
        </section>

        {/* TECH STACK */}
        <section
          id="tech-stack"
          aria-labelledby="tech-stack-heading"
          className="mt-12 sm:mt-16"
        >
          <h2
            id="tech-stack-heading"
            className="text-[14px] sm:text-[16px] font-medium mb-3 sm:mb-4"
          >
            {t("techStackTitle")}
          </h2>

          <div
            className="
              rounded-[5px] bg-[#099CB6]/40 
              px-3 sm:px-6 
              py-2 sm:py-0 
              sm:h-[60px] 
              flex items-center
            "
          >
            <div
              className="
                w-full 
                flex flex-wrap 
                justify-center sm:justify-between 
                items-center 
                gap-x-4 gap-y-1 sm:gap-y-0
              "
            >
              {["Next.js", "React", "Vercel", "Firebase", "Tailwind CSS", "GitHub"].map(
                (item) => (
                  <span
                    key={item}
                    className="
                      text-[11px] xs:text-[13px] 
                      sm:text-[18px] md:text-[22px] lg:text-[30px] 
                      font-bold text-[#111C37] 
                      tracking-[0.08em] 
                      whitespace-nowrap
                    "
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
