"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

/**
 * Link care păstrează automat prefixul /nl sau /en în URL.
 * Dacă îi dai href="/contact", el va genera "/nl/contact" sau "/en/contact".
 */
export default function LocaleLink({ href, children, className, ...rest }: Props) {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "nl";

  const hrefString = typeof href === "string" ? href : href.pathname?.toString() || "/";
  const normalized = hrefString.startsWith("/") ? hrefString : `/${hrefString}`;

  // Dacă deja ai /nl sau /en, nu mai adăugăm nimic
  const finalHref =
    normalized.startsWith("/nl") || normalized.startsWith("/en")
      ? normalized
      : `/${locale}${normalized}`;

  return (
    <Link href={finalHref as any} className={className} {...rest}>
      {children}
    </Link>
  );
}
