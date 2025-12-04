export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden flex items-center justify-center px-6">
      {/* BG blur circles (same style as Contact page) */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      {/* Content */}
      <section className="relative z-10 text-center max-w-xl space-y-6">
        <h1 className="text-6xl font-bold tracking-tight">404</h1>

        <h2 className="text-2xl font-semibold text-slate-200">
          Pagina niet gevonden
        </h2>

        <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
          De pagina die je probeert te bezoeken bestaat niet (meer) of is
          verplaatst.  
          <br />
          Geen zorgen — je kunt makkelijk terug naar de homepage.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-8 py-3 text-slate-950 font-semibold shadow-lg shadow-fuchsia-500/25 hover:brightness-110 transition"
        >
          Terug naar home
        </a>
      </section>
    </main>
  );
}
