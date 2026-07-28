import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import TailwindCssPage from "../../../technologies/tailwindcss/page";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "TailwindPage.metadata",
  });
  const canonicalUrl = `https://www.sphawn.nl/${locale}/technologies/tailwindcss`;

  return {
    metadataBase: new URL("https://www.sphawn.nl"),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.sphawn.nl/en/technologies/tailwindcss",
        nl: "https://www.sphawn.nl/nl/technologies/tailwindcss",
        "x-default": "https://www.sphawn.nl/en/technologies/tailwindcss",
      },
    },
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      url: canonicalUrl,
      siteName: "Sphawn",
      images: [{
        url: "/hero-tailwindcss.webp",
        width: 1536,
        height: 1024,
        alt: t("imageAlt"),
      }],
      locale: locale === "nl" ? "nl_NL" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: ["/hero-tailwindcss.webp"],
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
  return <TailwindCssPage />;
}
