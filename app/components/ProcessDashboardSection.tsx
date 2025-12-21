"use client";

import { useTranslations } from "next-intl";
import LocaleLink from "./LocaleLink";

type Step = {
  id: number;
  title: string;
  short: string;
  description: string;
  icon: string;
};

export default function ProcessDashboardSection() {
  const t = useTranslations("process");

  const rawSteps = t.raw("steps");
  const STEPS: Step[] = Array.isArray(rawSteps) ? (rawSteps as Step[]) : [];

  return (
    <section className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden py-20">
      {/* BG secundar – cercuri blur */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      {/* background blobs suplimentare */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 sm:h-72 sm:w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="mb-10 sm:mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("title")}
            </h2>

            <p className="mt-3 max-w-xl text-[15px] sm:text-base leading-relaxed text-slate-300/80">
              {t("intro")}
            </p>

            {/* CTA */}
            <div className="mt-6">
              <LocaleLink
                href="/contact"
                className="
                  inline-block
                  text-[16px] sm:text-[16px] font-bold
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
          </div>

          {/* progress mini-card */}
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center gap-4 rounded-2xl border border-cyan-500/20 bg-slate-950/40 px-4 sm:px-5 py-3 sm:py-4 shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur">
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-400 to-fuchsia-400 opacity-70 blur-[2px]" />
                <div
  className="
    relative
    flex h-12 w-12 sm:h-14 sm:w-14
    flex-col
    items-center justify-center
    rounded-full
    border border-cyan-300/60
    bg-slate-950/90
    leading-none
  "
>
  <span className="text-[14px] sm:text-[16px] font-extrabold">9</span>
  <span className="text-[9px] sm:text-[10px] font-semibold tracking-wide text-slate-200/90">
    {t("progress.steps")}
  </span>
</div>

              </div>

              <div className="space-y-1">
                <p className="text-[14px] sm:text-sm font-semibold text-slate-100">
                  {t("progress.title")}
                </p>
                <p className="text-[13px] sm:text-xs text-slate-300/80">
                  {t("progress.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-column layout */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* left column timeline */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="rounded-3xl border border-slate-700/60 bg-slate-950/60 px-4 sm:px-5 py-5 sm:py-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <p className="text-[13px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t("overview.label")}
              </p>

              <h3 className="mt-2 text-[17px] sm:text-lg font-semibold text-slate-50">
                {t("overview.title")}
              </h3>

              <p className="mt-2 text-[15px] sm:text-sm leading-relaxed text-slate-300/80">
                {t("overview.text")}
              </p>

              <div className="mt-6 flex gap-4">
                {/* vertical line */}
                <div className="relative mt-1 w-8">
                  <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan-400/70 via-sky-500/50 to-fuchsia-500/70 opacity-80" />
                  <div className="flex h-full flex-col justify-between py-1">
                    {STEPS.map((step) => (
                      <div
                        key={step.id}
                        className="relative flex items-center justify-center"
                      >
                        <div className="h-3 w-3 rounded-full bg-slate-900">
                          <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* titles */}
                <div className="flex-1 space-y-3">
                  {STEPS.map((step) => (
                    <div key={step.id} className="group">
                      <p className="text-[13px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-cyan-300 transition-colors">
                        {step.id.toString().padStart(2, "0")}
                      </p>
                      <p className="text-[15px] sm:text-sm font-medium text-slate-100 group-hover:text-cyan-100 break-words">
                        {step.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* right column cards */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {STEPS.map((step) => (
                <article
                  key={step.id}
                  className="group relative rounded-3xl bg-gradient-to-br from-cyan-500/40 via-sky-500/25 to-fuchsia-500/40 p-[1px] shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(244,114,182,0.45)]"
                >
                  <div className="flex h-full flex-col rounded-3xl bg-slate-950/90 px-4 sm:px-5 py-5 sm:py-6 backdrop-blur">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-2xl bg-slate-900/80 text-base sm:text-lg shrink-0">
                          <span className="leading-none">{step.icon}</span>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[13px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
                            {t("timeline.stepLabel")}{" "}
                            {step.id.toString().padStart(2, "0")}
                          </p>

                          <h3 className="mt-0.5 text-[16px] sm:text-sm font-semibold text-slate-50 break-words">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-[15px] sm:text-xs font-medium text-slate-200/90 leading-snug break-words">
                      {step.short}
                    </p>

                    <p className="mt-2 text-[14px] sm:text-xs leading-relaxed text-slate-300/85 break-words">
                      {step.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[13px] sm:text-[11px] text-slate-400/90">
                      <span className="whitespace-nowrap">
                        {t("timeline.badgeLeft")}
                      </span>
                      <span className="text-cyan-300 group-hover:text-fuchsia-300 transition-colors whitespace-nowrap">
                        {step.id}/9
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[13px] sm:text-[11px] uppercase tracking-[0.3em] text-slate-500">
          {t("footerLine")}
        </p>
      </div>
    </section>
  );
}
