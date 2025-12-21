// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const siteUrl = "https://www.sphawn.nl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "nl" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isNL = locale === "nl";
  const title = isNL
    ? "Webdesign Heerlen | Sphawn"
    : "Web Design Heerlen | Sphawn";

  const description = isNL
    ? "Sphawn Webdesign bouwt moderne, snelle en duidelijke websites voor ondernemers en freelancers in Heerlen en Limburg."
    : "Sphawn builds modern, fast, and clear websites for entrepreneurs and freelancers in Heerlen and Limburg.";

  const canonical = `${siteUrl}/${locale}`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        nl: `${siteUrl}/nl`,
        en: `${siteUrl}/en`,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "Sphawn Webdesign",
      images: [
        {
          url: "/sphawn-og-cover.jpg",
          width: 1200,
          height: 630,
          alt: "Sphawn Webdesign – moderne website mockups",
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "nl" && locale !== "en") notFound();

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      {children}
      <Footer />

      <Analytics />

      <Script
        id="org-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Sphawn Webdesign",
            url: siteUrl,
            logo: "https://www.sphawn.nl/logo.png",
            description:
              locale === "nl"
                ? "Sphawn Webdesign biedt moderne, snelle en duidelijke websites voor kleine ondernemers en freelancers in Heerlen en Limburg."
                : "Sphawn builds modern, fast, and clear websites for entrepreneurs and freelancers in Heerlen and Limburg.",
            email: "mailto:support@sphawn.nl",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Heerlen",
              addressRegion: "Limburg",
              addressCountry: "NL",
            },
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Limburg, Nederland",
            },
            sameAs: [],
          }),
        }}
      />
    </NextIntlClientProvider>
  );
}
