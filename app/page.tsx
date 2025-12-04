import type { Metadata } from "next";
import Hero from "./components/Hero";

export const metadata: Metadata = {
  title: "Webdesign Heerlen | Sphawn",
  description:
    "Professioneel webdesign in Heerlen. Moderne websites, webshops en maatwerk development in WordPress, Shopify en Next.js.",
};

export default function Home() {
  return <Hero />;
}
