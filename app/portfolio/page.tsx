// app/portfolio/page.tsx
import CaseStudiesSection from "../components/CaseStudiesSection";
import HomeConceptsSection from "../components/HomeConceptsSection";

export const metadata = {
  title: "Portfolio | Webdesign projecten en Figma concepten",
  description:
    "Bekijk webdesign projecten, demo webshops en Figma concepten. Professioneel ontworpen voor bedrijven in Heerlen en Limburg.",
};


export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG secundar – cercuri blur */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-24 md:px-8 lg:pt-28">
        {/* Hero mic */}
        <header className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Portfolio & Case Studies
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            Web projects designed in{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">
              Figma
            </span>{" "}
            & built with{" "}
            <span className="bg-gradient-to-r from-sky-300 to-cyan-400 bg-clip-text text-transparent">
              Next.js & React
            </span>
            .
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            A mix of real client work and experimental concepts. Each project
            follows the same flow: strategy → Figma design → development in
            Next.js / React → testing → launch.
          </p>
        </header>

        {/* Secțiunea 1: proiecte reale + demo shops */}
        <CaseStudiesSection />

        {/* Secțiunea 2: homepage concepts din Figma */}
        <HomeConceptsSection />

        {/* CTA final */}
        <section className="mt-6 rounded-2xl border border-cyan-400/25 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80 px-6 py-8 shadow-[0_0_40px_rgba(34,211,238,0.25)] sm:px-10 sm:py-10">
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Ready for a new website?
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300/90 sm:text-base">
            Whether you need a clean presentation website, a focused landing
            page or a small online shop, we start in Figma and ship a fast,
            modern Next.js build.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110"
            >
              Let’s talk about your project
            </a>
            <a
              href="/process"
              className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/60 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 hover:border-cyan-300/70 hover:text-cyan-200"
            >
              View my process
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
