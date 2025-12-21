// app/[locale]/process/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProcessClient from "./ProcessClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("process.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ProcessPage() {
  return <ProcessClient />;
}
