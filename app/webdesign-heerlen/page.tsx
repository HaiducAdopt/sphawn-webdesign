// app/webdesign-heerlen/page.tsx
"use client";

import Link from "next/link";

const FAQ = [
  {
    q: "How much does a website cost in Heerlen?",
    a: "Pricing depends on the scope, but most websites start between €300 and €800. After a short chat, I can give you a clear proposal based on your needs.",
  },
  {
    q: "How long does it take to build a website?",
    a: "Most projects are completed within 2–5 weeks, depending on the number of pages, content readiness and revisions.",
  },
  {
    q: "Do you only work in Heerlen?",
    a: "No. I work with clients across Limburg and the Netherlands, but I’m based in Heerlen and love working with local businesses.",
  },
  {
    q: "Do you help with SEO?",
    a: "Yes. Every website is built with a strong SEO foundation: clean structure, correct titles/descriptions, fast performance and mobile-first layout.",
  },
];

export default function WebdesignHeerlenPage() {
  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG secundar – cercuri blur */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-20">

        {/* HERO */}
        <header className="mb-10 sm:mb-12">
          <p className="text-[13px] sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase">
            Local Web Design
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Webdesign &amp; Web Development in Heerlen, Limburg
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] sm:text-base leading-relaxed text-slate-300/90">
            Looking for professional web design and web development in Heerlen?
            I’m a freelance web designer and developer based in Heerlen, Limburg,
            building fast, modern and SEO-friendly websites for businesses,
            freelancers and entrepreneurs across the Netherlands.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="
                inline-flex items-center justify-center
                text-[16px] font-bold
                px-6 py-3 rounded-[25px]
                bg-[#00E1F0] text-black
                border border-[#9747FF]
                transition-all duration-300
                hover:brightness-110 hover:shadow-[0_0_15px_rgba(148,70,255,0.5)]
              "
            >
              Request a Free Quote
            </Link>

            <Link
              href="/portfolio"
              className="
                inline-flex items-center justify-center
                text-[16px] font-semibold
                px-6 py-3 rounded-[25px]
                border border-white/15 bg-slate-950/40
                text-slate-100
                transition-all duration-300
                hover:border-cyan-400/60 hover:bg-slate-950/55
              "
            >
              View Portfolio
            </Link>
          </div>
        </header>

        {/* CONTENT GRID */}
        <section className="grid gap-6 lg:grid-cols-12">
          {/* LEFT: main content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1 */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                Webdesign services in Heerlen
              </h2>
              <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-300/85">
                A professional website builds trust and helps people find your
                business. As a web designer in Heerlen, I create websites that
                are visually clean, technically solid and easy to use — with a
                strong foundation for Google.
              </p>

              <ul className="mt-4 space-y-2 text-[15px] sm:text-base text-slate-200/90">
                <li>• Custom website design tailored to your business</li>
                <li>• Mobile-first and fully responsive layouts</li>
                <li>• Clear structure and intuitive navigation</li>
                <li>• Strong SEO foundation for better Google visibility</li>
                <li>• Fast loading times and optimized performance</li>
              </ul>
            </article>

            {/* Card 2 */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                Modern web development with Next.js and React
              </h2>
              <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-300/85">
                I build websites using Next.js, React and Tailwind CSS. This
                modern stack makes your website fast, secure and future-proof —
                with clean structure and excellent performance.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    t: "Performance",
                    d: "Fast loading times and smooth user experience.",
                  },
                  {
                    t: "SEO foundation",
                    d: "Clean structure so Google understands your website.",
                  },
                  {
                    t: "Scalable",
                    d: "Built to grow with your business and content.",
                  },
                  {
                    t: "Reliable",
                    d: "Modern, secure and stable technical base.",
                  },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <p className="text-[16px] font-semibold text-slate-50">
                      {x.t}
                    </p>
                    <p className="mt-1 text-[14px] sm:text-[14px] leading-relaxed text-slate-300/85">
                      {x.d}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* Card 3 */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                Local web designer in Limburg &amp; the Netherlands
              </h2>
              <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-300/85">
                Being based in Heerlen allows me to work closely with local
                businesses in Limburg, while also supporting clients throughout
                the Netherlands. I understand what ZZP’ers and small businesses
                need: a clear message, a professional look and a website that
                simply works.
              </p>
            </article>

            {/* Card 4: Process */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                From idea to live website
              </h2>

              <ol className="mt-4 space-y-3 text-[15px] sm:text-base text-slate-200/90">
                <li>
                  <span className="font-semibold text-cyan-200">1.</span> We
                  discuss your goals and requirements.
                </li>
                <li>
                  <span className="font-semibold text-cyan-200">2.</span> I
                  design the structure and layout (Figma).
                </li>
                <li>
                  <span className="font-semibold text-cyan-200">3.</span> I
                  develop the website using modern technologies.
                </li>
                <li>
                  <span className="font-semibold text-cyan-200">4.</span> We
                  optimize for speed, SEO and mobile.
                </li>
                <li>
                  <span className="font-semibold text-cyan-200">5.</span> Launch,
                  and I stay available for support if needed.
                </li>
              </ol>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Let’s talk about your website ↗
                </Link>
              </div>
            </article>

            {/* FAQ */}
            <article className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                Frequently asked questions
              </h2>

              <div className="mt-4 space-y-4">
                {FAQ.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-[16px] font-semibold text-slate-50">
                      {f.q}
                    </p>
                    <p className="mt-1 text-[15px] sm:text-base leading-relaxed text-slate-300/85">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* CTA bottom */}
            <article className="rounded-3xl border border-cyan-500/20 bg-slate-950/50 p-6 shadow-[0_0_35px_rgba(34,211,238,0.15)] backdrop-blur">
              <h2 className="text-2xl font-semibold text-slate-50">
                Ready to start your website?
              </h2>
              <p className="mt-2 text-[15px] sm:text-base leading-relaxed text-slate-300/90">
                If you need webdesign and web development in Heerlen or Limburg,
                feel free to contact me for a free consultation and a clear
                proposal.
              </p>

              <div className="mt-5">
                <Link
                  href="/contact"
                  className="
                    inline-flex items-center justify-center
                    text-[16px] font-bold
                    px-6 py-3 rounded-[25px]
                    bg-[#00E1F0] text-black
                    border border-[#9747FF]
                    transition-all duration-300
                    hover:brightness-110 hover:shadow-[0_0_15px_rgba(148,70,255,0.5)]
                  "
                >
                  Contact Sphawn Webdesign
                </Link>
              </div>
            </article>
          </div>

          {/* RIGHT: sticky summary card */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 sm:p-6 shadow-inner shadow-slate-900/80 backdrop-blur">
              <p className="text-[13px] uppercase tracking-[0.3em] text-slate-400 font-semibold">
                Quick summary
              </p>

              <h3 className="mt-2 text-lg font-semibold text-slate-50">
                Webdesign in Heerlen, built for results.
              </h3>

              <ul className="mt-4 space-y-2 text-[15px] text-slate-200/90">
                <li>• Based in Heerlen, Limburg</li>
                <li>• Next.js · React · Tailwind CSS</li>
                <li>• Fast & SEO-friendly structure</li>
                <li>• Mobile-first design</li>
                <li>• Clear process & direct contact</li>
              </ul>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-[20px] border border-white/15 bg-slate-950/40 px-4 py-3 text-[16px] font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:bg-slate-950/55"
                >
                  Get a quote
                </Link>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-slate-400">
                Keywords covered: webdesign Heerlen, web development Heerlen,
                webdesigner Limburg, website laten maken Nederland.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
