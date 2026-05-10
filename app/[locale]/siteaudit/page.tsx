import type { Metadata } from "next";
import SiteAuditPage from "../../siteaudit/page";

type Props = {
  params: {
    locale: string;
  };
};

export function generateMetadata({ params }: Props): Metadata {
  const isDutch = params.locale === "nl";

  return {
    title: isDutch
      ? "Website snelheidstest & AI SEO audit | Sphawn"
      : "Website Speed Test & AI SEO Audit | Sphawn",

    description: isDutch
      ? "Analyseer de snelheid, SEO-structuur en AI-zichtbaarheid van je website. Ontvang duidelijke scores en praktische aanbevelingen."
      : "Analyze your website speed, SEO structure and AI visibility. Get clear scores and practical recommendations powered by AI.",

    alternates: {
      canonical: `/${params.locale}/siteaudit`,
      languages: {
        en: "/en/siteaudit",
        nl: "/nl/siteaudit",
        "x-default": "/siteaudit",
      },
    },

    openGraph: {
      title: isDutch
        ? "Website snelheid & AI SEO audit tool"
        : "Website Speed & AI SEO Audit Tool",
      description: isDutch
        ? "Test de prestaties en SEO van je website en ontvang duidelijke aanbevelingen."
        : "Test your website performance and SEO instantly with clear AI-powered recommendations.",
      url: `https://www.sphawn.nl/${params.locale}/siteaudit`,
      siteName: "Sphawn",
      images: [
        {
          url: "/og-sphawn-siteaudit.png",
          width: 1200,
          height: 630,
          alt: "Sphawn SiteAudit Tool",
        },
      ],
      locale: isDutch ? "nl_NL" : "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: isDutch
        ? "Website snelheid & AI SEO audit"
        : "Website Speed & AI SEO Audit",
      description: isDutch
        ? "Analyseer je websiteprestaties en SEO met één klik."
        : "Analyze your website performance and SEO with one click.",
      images: ["/og-sphawn-siteaudit.png"],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function Page() {
  return <SiteAuditPage />;
}