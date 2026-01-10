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

type FAQItem = {
  q: string;
  a: string;
};

export default function ProcessDashboardSection() {
  const t = useTranslations("process");

  const rawSteps = t.raw("steps");
  const STEPS: Step[] = Array.isArray(rawSteps) ? (rawSteps as Step[]) : [];

  const faqItems = t.raw("faq.items") as FAQItem[];

  return (
    <section className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden py-20">
      {/* BG blur */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {t("title")}
            </h2>

            <p className="mt-3 max-w-xl text-slate-300/80">
              {t("intro")}
            </p>

            <div className="mt-6">
              <LocaleLink
                href="/contact"
                className="
                  inline-block px-6 py-3 rounded-full
                  bg-[#00E1F0] text-black font-bold
                  border border-[#9747FF]
                  hover:brightness-110 transition
                "
              >
                {t("cta")}
              </LocaleLink>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT TIMELINE */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {t("overview.label")}
              </p>

              <h3 className="mt-2 text-lg font-semibold">
                {t("overview.title")}
              </h3>

              <p className="mt-2 text-sm text-slate-300/80">
                {t("overview.text")}
              </p>

              <div className="mt-6 space-y-3">
                {STEPS.map((step) => (
                  <div key={step.id}>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {step.id.toString().padStart(2, "0")}
                    </p>
                    <p className="text-sm text-slate-100">
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CARDS */}
          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {STEPS.map((step) => (
                <article
                  key={step.id}
                  className="rounded-3xl bg-slate-950/90 p-5 border border-slate-800/60"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-900">
                      {step.icon}
                    </div>
                    <p className="text-xs uppercase tracking-wide text-cyan-300">
                      Step {step.id}
                    </p>
                  </div>

                  <h4 className="font-semibold text-slate-50">
                    {step.title}
                  </h4>

                  <p className="mt-2 text-sm text-slate-300">
                    {step.short}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER LINE */}
        <p className="mt-12 text-center text-xs uppercase tracking-widest text-slate-500">
          {t("footerLine")}
        </p>

        {/* FAQ SECTION */}
        <section className="mt-20 rounded-3xl border border-slate-700/60 bg-slate-950/60 p-6 sm:p-8 backdrop-blur">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
            {t("faq.title")}
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  <span className="pr-4">{item.q}</span>
                  <span
                    className="
                      text-xl text-cyan-400
                      transition-transform duration-300
                      group-open:rotate-45
                    "
                  >
                    +
                  </span>
                </summary>

                <div className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
