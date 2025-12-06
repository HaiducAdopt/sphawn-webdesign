import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = "https://www.sphawn.nl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Webdesign Heerlen | Sphawn",
  description:
    "Sphawn Webdesign bouwt moderne, snelle en duidelijke websites voor ondernemers en freelancers in Heerlen en Limburg.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Webdesign Heerlen | Sphawn",
    description:
      "Professioneel webdesign in Heerlen. Websites, webshops en maatwerk in WordPress, Shopify en Next.js.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A1A2F] text-white`}
      >
        <Navbar />

        {children}

        <Footer />

        {/* Vercel Analytics */}
        <Analytics />

        {/* Organization / ProfessionalService schema (in het Nederlands) */}
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
                "Sphawn Webdesign biedt moderne, snelle en duidelijke websites voor kleine ondernemers en freelancers in Heerlen en Limburg.",
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
      </body>
    </html>
  );
}
