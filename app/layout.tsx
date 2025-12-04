import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sphawn.nl"),
  title: {
    default: "Sphawn Webdesign & Development | Heerlen",
    template: "%s | Sphawn",
  },
  description:
    "Professioneel webdesign en development in Heerlen. Websites, webshops en maatwerk oplossingen in WordPress, Shopify en Next.js.",
  keywords: [
    "webdesign Heerlen",
    "website laten maken Heerlen",
    "webdesigner Limburg",
    "webdesign bedrijf Heerlen",
    "WordPress website Heerlen",
    "professioneel webdesign",
    "webshop laten maken",
    "Next.js developer Nederland",
  ],
  openGraph: {
    title: "Sphawn Webdesign & Development | Heerlen",
    description:
      "Modern en professioneel webdesign in Heerlen. Websites die snel, veilig en gebruiksvriendelijk zijn.",
    url: "https://www.sphawn.nl",
    siteName: "Sphawn",
    images: ["/og-sphawn.jpg"],
    type: "website",
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
      </body>
    </html>
  );
}
