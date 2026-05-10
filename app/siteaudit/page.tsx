import type { Metadata } from "next";
import SiteAuditPage from "../components/siteaudit/SiteAuditPage";

export const metadata: Metadata = {
  title: "Website Speed Test & AI SEO Audit | Sphawn",
  description:
    "Analyze your website speed, SEO structure and AI visibility in seconds. Get real performance scores and smart recommendations powered by AI.",

  keywords: [
    "website speed test",
    "seo audit tool",
    "ai seo checker",
    "pagespeed test",
    "website analysis tool",
    "technical seo audit",
    "core web vitals test",
    "sphawn siteaudit",
  ],

  metadataBase: new URL("https://www.sphawn.nl"),

  alternates: {
    canonical: "/siteaudit",
  },

  openGraph: {
    title: "Website Speed & AI SEO Audit Tool",
    description:
      "Test your website performance and SEO instantly. Get clear, actionable recommendations powered by AI.",
    url: "https://www.sphawn.nl/siteaudit",
    siteName: "Sphawn",
    images: [
      {
        url: "/og-sphawn-siteaudit.png", // optional (poți adăuga ulterior)
        width: 1200,
        height: 630,
        alt: "Sphawn SiteAudit Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Website Speed & AI SEO Audit",
    description:
      "Analyze your website performance and SEO with one click.",
    images: ["/og-sphawn-siteaudit.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <SiteAuditPage />;
}