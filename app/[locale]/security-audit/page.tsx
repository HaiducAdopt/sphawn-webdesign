import type { Metadata } from "next";

import SecurityAuditPageClient from "@/app/components/SecurityAuditPageClient";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } =
    await params;

  const isDutch =
    locale === "nl";

  return {
    title:
      isDutch
        ? "Gratis Website Security Audit | SSL, Headers & DNS Controle | Sphawn"
        : "Free Website Security Audit | SSL, Headers & DNS Check | Sphawn",

    description:
      isDutch
        ? "Controleer HTTPS, security headers, WordPress-blootstelling en DNS-bescherming met de gratis Security Audit tool van Sphawn."
        : "Check HTTPS, security headers, WordPress exposure and DNS protection with the free Security Audit tool from Sphawn.",

    alternates: {
      canonical:
        `https://www.sphawn.nl/${locale}/security-audit`,
    },

    openGraph: {
      title:
        isDutch
          ? "Gratis Website Security Audit | Sphawn"
          : "Free Website Security Audit | Sphawn",

      description:
        isDutch
          ? "Controleer HTTPS, security headers, WordPress-blootstelling en DNS-bescherming."
          : "Check HTTPS, security headers, WordPress exposure and DNS protection.",

      url:
        `https://www.sphawn.nl/${locale}/security-audit`,

      siteName:
        "Sphawn",

      images: [
        {
          url: "/og-security-audit.jpg",

          width: 1200,

          height: 630,

          alt:
            "Sphawn Security Audit",
        },
      ],

      locale:
        isDutch
          ? "nl_NL"
          : "en_US",

      type:
        "website",
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        isDutch
          ? "Gratis Website Security Audit | Sphawn"
          : "Free Website Security Audit | Sphawn",

      description:
        isDutch
          ? "Controleer HTTPS, security headers en DNS-bescherming."
          : "Check HTTPS, security headers and DNS protection.",

      images: [
        "/og-security-audit.jpg",
      ],
    },
  };
}

export default function LocalizedSecurityAuditPage() {
  return (
    <SecurityAuditPageClient />
  );
}