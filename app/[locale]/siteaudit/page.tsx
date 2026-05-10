import type { Metadata } from "next";
import SiteAuditPage from "../../components/siteaudit/SiteAuditPage";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isDutch = locale === "nl";

  const canonicalUrl = `https://www.sphawn.nl/${locale}/siteaudit`;

  return {
    metadataBase: new URL("https://www.sphawn.nl"),

    title: isDutch
      ? "Website snelheidstest & AI SEO audit | Sphawn"
      : "Website Speed Test & AI SEO Audit | Sphawn",

    description: isDutch
      ? "Analyseer de snelheid, SEO-structuur en AI-zichtbaarheid van je website. Ontvang duidelijke scores en praktische aanbevelingen."
      : "Analyze your website speed, SEO structure and AI visibility. Get clear scores and practical recommendations powered by AI.",

    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.sphawn.nl/en/siteaudit",
        nl: "https://www.sphawn.nl/nl/siteaudit",
        "x-default": "https://www.sphawn.nl/en/siteaudit",
      },
    },

    openGraph: {
      title: isDutch
        ? "Website snelheid & AI SEO audit tool | Sphawn"
        : "Website Speed & AI SEO Audit Tool | Sphawn",
      description: isDutch
        ? "Test de prestaties, technische SEO-structuur en AI-zichtbaarheid van je website met duidelijke aanbevelingen."
        : "Test your website performance, technical SEO structure and AI visibility with clear AI-powered recommendations.",
      url: canonicalUrl,
      siteName: "Sphawn",
      images: [
        {
          url: "/og-sphawn-siteaudit.png",
          width: 1200,
          height: 630,
          alt: isDutch
            ? "Sphawn Website snelheid en AI SEO audit tool"
            : "Sphawn Website Speed and AI SEO Audit Tool",
        },
      ],
      locale: isDutch ? "nl_NL" : "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: isDutch
        ? "Website snelheid & AI SEO audit | Sphawn"
        : "Website Speed & AI SEO Audit | Sphawn",
      description: isDutch
        ? "Analyseer je websiteprestaties, SEO-structuur en AI-zichtbaarheid met één klik."
        : "Analyze your website performance, SEO structure and AI visibility with one click.",
      images: ["/og-sphawn-siteaudit.png"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function Page() {
  return <SiteAuditPage />;
}