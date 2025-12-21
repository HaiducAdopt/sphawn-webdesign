"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitch() {
  const pathname = usePathname() || "/nl";

  const active = pathname.startsWith("/en") ? "en" : "nl";

  // Scoate prefixul /nl sau /en ca să păstrăm restul rutei
  const rest = pathname.startsWith("/nl")
    ? pathname.slice(3)
    : pathname.startsWith("/en")
    ? pathname.slice(3)
    : pathname;

  const nlHref = `/nl${rest || ""}`;
  const enHref = `/en${rest || ""}`;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
      <Link
        href={nlHref}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
          active === "nl" ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
        }`}
      >
        NL
      </Link>

      <Link
        href={enHref}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
          active === "en" ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
