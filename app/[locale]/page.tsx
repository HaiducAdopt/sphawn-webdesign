import type { Metadata } from "next";
import Hero from "../components/Hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "nl" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === "nl") {
    return {
      title: "Webdesign Heerlen | Sphawn",
      description:
        "Professioneel webdesign in Heerlen. Moderne websites, webshops en maatwerk development in WordPress, Shopify en Next.js.",
    };
  }

  return {
    title: "Web Design Heerlen | Sphawn",
    description:
      "Professional web design in Heerlen. Modern websites, webshops and custom development in WordPress, Shopify and Next.js.",
  };
}

export default function Home() {
  return <Hero />;
}
