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
    "Professioneel webdesign in Heerlen. Moderne websites, webshops en maatwerk development in WordPress, Shopify en Next.js.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Webdesign Heerlen | Sphawn",
    description:
      "Moderne, snelle en duidelijke websites voor kleine ondernemers en freelancers in Heerlen en Limburg.",
    siteName: "Sphawn Webdesign",
    images: [
      {
        url: "/sphawn-og-cover.jpg", // ai deja poza asta în /public
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

        {/* Organization / ProfessionalService schema for Google */}
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
              logo: "https://www.sphawn.nl/logo.png", // asigură-te că ai /public/logo.png
              description:
                "Sphawn Webdesign oferă site-uri moderne, rapide și clare pentru afaceri mici și freelanceri în Heerlen și Limburg.",
              email: "mailto:support@sphawn.nl",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Heerlen",
                addressRegion: "Limburg",
                addressCountry: "NL",
              },
              areaServed: {
                "@type": "AdministrativeArea",
                name: "Limburg, Netherlands",
              },
              sameAs: [
                // adaugi aici când ai:
                // "https://www.linkedin.com/in/...",
                // "https://www.facebook.com/...",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
