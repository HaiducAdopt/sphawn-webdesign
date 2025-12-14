import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-transparent backdrop-transparent py-4">
      <div className="max-w-6xl mx-auto px-4">

        {/* rând principal */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
          
          {/* STÂNGA – linkuri SEO */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link
              href="/webdesign-heerlen"
              className="
                text-[12px] sm:text-[14px] md:text-[16px]
                font-medium
                text-cyan-300
                hover:text-cyan-200
                transition-colors
              "
            >
              Webdesign Heerlen
            </Link>

            <Link
              href="/webdesign-limburg"
              className="
                text-[12px] sm:text-[14px] md:text-[16px]
                font-medium
                text-cyan-300
                hover:text-cyan-200
                transition-colors
              "
            >
              Webdesign Limburg
            </Link>
          </div>

          {/* DREAPTA – copyright */}
          <p className="text-[12px] sm:text-[14px] md:text-[16px] font-medium text-right text-white">
            © 2025 Sphawn | Heerlen | Nederland — Web Design & Development
          </p>
        </div>

        {/* Bara gradient */}
        <div
          className="w-full h-[8px] rounded-[4px]"
          style={{
            background: "linear-gradient(90deg, #099CB6 0%, #BC4EF0 100%)",
          }}
        />
      </div>
    </footer>
  );
}
