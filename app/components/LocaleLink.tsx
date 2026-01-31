"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = Omit<LinkProps, "href"> & {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Link care păstrează automat prefixul /nl sau /en în URL.
 * Dacă îi dai href="/contact", el va genera "/nl/contact" sau "/en/contact".
 */
export default function LocaleLink({
  href,
  children,
  className,
  ...rest
}: Props) {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "nl";

  const normalized = href.startsWith("/") ? href : `/${href}`;

  // Dacă deja ai /nl sau /en, nu mai adăugăm nimic
  const finalHref =
    normalized.startsWith("/nl") || normalized.startsWith("/en")
      ? normalized
      : `/${locale}${normalized}`;

  return (
    <Link href={finalHref} className={className} {...rest}>
      {children}
    </Link>
  );
}
