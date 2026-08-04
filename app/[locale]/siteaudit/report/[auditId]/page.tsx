import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { adminDb } from "@/lib/firebase-admin";
import PublicSiteAuditReport, {
  type PublicAuditData,
} from "@/app/components/siteaudit/PublicSiteAuditReport";

type Props = {
  params: Promise<{ locale: string; auditId: string }>;
};

const VALID_SLUG = /^[A-Za-z0-9][A-Za-z0-9_-]{8,127}$/;

async function getReport(auditId: string) {
  if (!VALID_SLUG.test(auditId)) return null;

  const snapshot = await adminDb.collection("siteAudits").doc(auditId).get();
  if (!snapshot.exists) return null;

  const data = snapshot.data();
  if (!data || data.public !== true || data.status !== "complete") return null;

  return {
    locale: data.locale,
    website: data.website,
    competitor: data.competitor ?? null,
    comparisonExplanationResults:
      data.comparisonExplanationResults ?? null,
  } as PublicAuditData;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { auditId, locale } = await params;
  const report = await getReport(auditId);

  if (!report) return { title: "Report not found | Sphawn SiteAudit" };

  const domain = new URL(report.website.url).hostname.replace(/^www\./, "");
  const title =
    locale === "nl"
      ? `Website-audit voor ${domain} | Sphawn`
      : `Website audit for ${domain} | Sphawn`;

  return {
    title,
    description:
      locale === "nl"
        ? `Performance-, SEO- en AI-auditrapport voor ${domain}.`
        : `Performance, SEO and AI audit report for ${domain}.`,
    robots: { index: false, follow: false },
  };
}

export default async function SiteAuditReportPage({ params }: Props) {
  const { auditId } = await params;
  const report = await getReport(auditId);

  if (!report) notFound();

  return <PublicSiteAuditReport report={report} />;
}