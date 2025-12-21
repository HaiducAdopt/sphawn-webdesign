"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

export default function OffersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // TEMP: aici vom conecta Firestore / email
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 800);
  }

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG blur circles */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-24">
        {/* HERO: image left, text right (no OFFERS, no extra paragraph, no image card/bg) */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left: image (no wrapper bg/border) */}
          <div className="order-1 lg:order-none flex justify-center lg:justify-start">
            <Image
              src="/herro-oferte.png"
              alt="Homepage preview mockup"
              width={1400}
              height={900}
              priority
              className="w-full max-w-[560px] h-auto object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
            />
          </div>

          {/* Right: text */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              This is how your homepage could look.
            </h1>

            <p className="mt-4 text-slate-300 max-w-xl mx-auto lg:mx-0">
              A real design preview — created fast, clean and modern — so you
              can decide with confidence.
            </p>
          </div>
        </div>

        {/* Regulile jocului */}
        <div className="mt-12 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.6)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase">
                Rules of the game
              </p>

              <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-white">
                See the design before you commit.
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                If you want a website but are not sure how it should look yet,
                it’s simple: send us a few basic requirements using the form
                (company name, industry, short description, preferences). Based
                on that, we design your homepage in Figma and publish it here as
                an interactive prototype — with a separate desktop link and a
                separate mobile link.
              </p>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                In other words, we show you exactly what you get before there is
                any contract or payment. If you like the direction, we can
                continue with the full website based on a clear proposal.
              </p>
            </div>

            {/* mini highlight */}
            <div className="shrink-0 rounded-2xl border border-cyan-400/20 bg-slate-950/40 px-4 py-4 text-center shadow-[0_0_30px_rgba(56,189,248,0.15)]">
              {/* Figma logo */}
              <div className="mx-auto mb-3 flex h-16 w-24 items-center justify-center rounded-xl bg-slate-900/40">
                <img
                  src="/figma.png"
                  alt="Figma"
                  className="max-h-full max-w-full object-contain opacity-85"
                />
              </div>

              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                100% free
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                Figma Prototype
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Desktop + Mobile links
              </p>
            </div>
          </div>

          {/* Why hero matters */}
          <div className="mt-6 rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We believe the{" "}
              <span className="text-white font-semibold">Hero section</span> is
              the most important part of any website. In the first{" "}
              <span className="text-white font-semibold">3 seconds</span>,
              visitors decide whether they continue exploring your content or
              leave and choose another website from Google’s long list of
              results. That’s why we always start with a strong, clear and
              message-driven Hero.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold mb-3">What you get</h2>
            <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
              <li>A homepage demo (modern, clear layout)</li>
              <li>Mobile-only or desktop-only (your choice)</li>
              <li>Strong structure + clear CTA</li>
              <li>Presented as an interactive prototype</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold mb-3">Not included</h2>
            <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
              <li>Full website build</li>
              <li>Technical implementation & hosting</li>
              <li>Advanced SEO strategy</li>
              <li>Unlimited revisions</li>
            </ul>
          </div>
        </div>

        {/* FORM */}
        <div className="mt-14 max-w-xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold">Apply for the offer</h2>
            <p className="text-sm text-slate-400 mt-1">
              Fill in a few details. I’ll get back to you shortly.
            </p>
          </div>

          {!success ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-slate-900/50 border border-slate-800/70 rounded-2xl p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-200">Company name</label>
                <input
                  required
                  className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  placeholder="e.g. Studio XYZ"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-200">Contact person</label>
                <input
                  required
                  className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  placeholder="Your name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-200">Email</label>
                <input
                  type="email"
                  required
                  className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  placeholder="you@company.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-200">
                  What does your company do?
                </label>
                <input
                  className="rounded-xl bg-[#0F233E] border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  placeholder="e.g. restaurant, clinic, logistics, services"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500 py-3 text-slate-950 font-semibold hover:brightness-110 transition disabled:opacity-60"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>

              <p className="text-xs text-slate-400 text-center">
                This is a limited offer and not all requests are guaranteed to
                be accepted.
              </p>
            </form>
          ) : (
            <div className="rounded-2xl border border-emerald-700/60 bg-emerald-900/30 p-6 text-center">
              <h3 className="text-lg font-semibold text-emerald-300">
                Thank you!
              </h3>
              <p className="text-sm text-slate-200 mt-2">
                Your request has been sent. I’ll contact you soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
