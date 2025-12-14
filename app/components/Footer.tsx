import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-transparent backdrop-transparent py-4">
      <div className="max-w-6xl mx-auto px-4">

        {/* RÂND LINKURI */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">

          {/* STÂNGA – SEO pages */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href="/webdesign-heerlen"
              className="text-[11px] sm:text-[12px] font-normal text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Webdesign Heerlen
            </Link>

            <Link
              href="/webdesign-limburg"
              className="text-[11px] sm:text-[12px] font-normal text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Webdesign Limburg
            </Link>
          </div>

          {/* DREAPTA – legal pages */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start sm:justify-end">
            <Link
              href="/privacy-policy"
              className="text-[11px] sm:text-[12px] font-light text-slate-400 hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-[11px] sm:text-[12px] font-light text-slate-400 hover:text-slate-200 transition-colors"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/cookie-statement"
              className="text-[11px] sm:text-[12px] font-light text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cookie Statement
            </Link>
          </div>
        </div>

        {/* COPYRIGHT */}
        <p className="text-[11px] sm:text-[12px] font-light text-slate-500 text-right mb-2">
          © 2025 Sphawn · Heerlen · The Netherlands — Web Design & Development
        </p>

        {/* BARA GRADIENT */}
        <div
          className="w-full h-[6px] rounded-[3px]"
          style={{
            background: "linear-gradient(90deg, #099CB6 0%, #BC4EF0 100%)",
          }}
        />
      </div>
    </footer>
  );
}
