// app/[locale]/contact/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactClient from "./ContactClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
