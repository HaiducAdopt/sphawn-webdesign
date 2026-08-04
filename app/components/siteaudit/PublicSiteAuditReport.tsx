"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "next-intl";

import AiExplainResult, { type AiExplainData } from "./AiExplainResult";
import AiSeoAuditResult from "./AiSeoAuditResult";
import AuditShareCard from "./AuditShareCard";
import SpeedAuditResult from "./SpeedAuditResult";
import type { AiSeoResult, SpeedResult } from "./SiteAuditPage";
import WebsiteComparisonResult, {
  type ComparisonExplanationData,
} from "./WebsiteComparisonResult";

type DeviceTab = "mobile" | "desktop";
type DeviceCache<T> = Record<DeviceTab, T | null>;

export type PublicAuditData = {
  locale: string;
  website: {
    url: string;
    speedResults: DeviceCache<SpeedResult>;
    aiResult: AiSeoResult;
    aiExplainResults: DeviceCache<AiExplainData>;
  };
  competitor?: {
    url: string;
    speedResults: DeviceCache<SpeedResult>;
    aiResult: AiSeoResult;
    aiExplainResults: DeviceCache<AiExplainData>;
  } | null;
  comparisonExplanationResults?: DeviceCache<ComparisonExplanationData> | null;
};

function getDomain(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

export default function PublicSiteAuditReport({ report }: { report: PublicAuditData }) {
  const locale = useLocale();
  const firstAvailable: DeviceTab = report.website.speedResults.mobile
    ? "mobile"
    : "desktop";
  const [activeTab, setActiveTab] = useState<DeviceTab>(firstAvailable);
  const [copied, setCopied] = useState(false);

  const speed = report.website.speedResults[activeTab];
  const explanation = report.website.aiExplainResults[activeTab];
  const competitorSpeed = report.competitor?.speedResults[activeTab] ?? null;
  const comparison = report.comparisonExplanationResults?.[activeTab] ?? null;
  const domain = speed
    ? getDomain(speed.finalUrl || report.website.url)
    : getDomain(report.website.url);

  const getShareData = () => {
    const url = window.location.href;
    const title =
      locale === "nl"
        ? `Website-auditrapport voor ${domain}`
        : `Website audit report for ${domain}`;

    return { url, title };
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=640");
  };

  const shareOnLinkedIn = () => {
    const { url } = getShareData();
    openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    );
  };

  const shareOnFacebook = () => {
    const { url } = getShareData();
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    );
  };

  const shareOnWhatsApp = () => {
    const { url, title } = getShareData();
    openShareWindow(
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    );
  };

  const shareByEmail = () => {
    const { url, title } = getShareData();
    const body =
      locale === "nl"
        ? `Bekijk dit website-auditrapport:\n\n${url}`
        : `View this website audit report:\n\n${url}`;

    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  };

  const copyReportLink = async () => {
    const { url } = getShareData();

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
     <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pt-36 lg:px-8">
  <div className="mb-10 flex flex-col items-start gap-5 border-b border-white/10 pb-8">
          <Link
            href={`/${locale}/siteaudit`}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <span aria-hidden="true">←</span>
            {locale === "nl"
              ? "Terug naar SiteAudit by Sphawn"
              : "Back to SiteAudit by Sphawn"}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-white/45">
              {locale === "nl" ? "Deel rapport:" : "Share report:"}
            </span>
            <button type="button" onClick={shareOnLinkedIn} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-white/75 transition hover:border-[#D4AF37]/50 hover:text-white">
              LinkedIn
            </button>
            <button type="button" onClick={shareOnFacebook} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-white/75 transition hover:border-[#D4AF37]/50 hover:text-white">
              Facebook
            </button>
            <button type="button" onClick={shareOnWhatsApp} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-white/75 transition hover:border-[#D4AF37]/50 hover:text-white">
              WhatsApp
            </button>
            <button type="button" onClick={shareByEmail} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-white/75 transition hover:border-[#D4AF37]/50 hover:text-white">
              {locale === "nl" ? "E-mail" : "Email"}
            </button>
            <button type="button" onClick={copyReportLink} className="rounded-xl bg-[#D4AF37] px-3 py-2 text-sm font-semibold text-black transition hover:bg-[#e6c65b]">
              {copied
                ? locale === "nl" ? "Gekopieerd!" : "Copied!"
                : locale === "nl" ? "Link kopiëren" : "Copy link"}
            </button>
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
          Sphawn SiteAudit
        </p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
          {locale === "nl" ? "Website-auditrapport" : "Website audit report"}
        </h1>
        <p className="mt-3 text-white/55">{domain}</p>

        <div className="mt-8 flex w-full rounded-2xl border border-white/10 bg-white/[0.04] p-1 sm:w-fit">
          {(["mobile", "desktop"] as const).map((tab) => {
            const available = Boolean(report.website.speedResults[tab]);
            return (
              <button
                key={tab}
                type="button"
                disabled={!available}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold capitalize transition sm:flex-none ${
                  activeTab === tab
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                } disabled:cursor-not-allowed disabled:opacity-30`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {speed && report.competitor && competitorSpeed ? (
          <WebsiteComparisonResult
            websiteUrl={report.website.url}
            competitorUrl={report.competitor.url}
            websiteSpeed={speed}
            competitorSpeed={competitorSpeed}
            websiteAi={report.website.aiResult}
            competitorAi={report.competitor.aiResult}
            explanation={comparison}
            explanationLoading={false}
            explanationError=""
          />
        ) : null}

        {speed ? (
          <div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
            <div className="min-w-0 space-y-6">
              <SpeedAuditResult data={speed} />
              <AiExplainResult data={explanation} loading={false} />
              <AiSeoAuditResult data={report.website.aiResult} />
            </div>

            <div className="min-w-0 space-y-6">
              <AuditShareCard
                domain={domain}
                speedScore={speed.scores.performance}
                seoScore={speed.scores.seo}
                accessibilityScore={speed.scores.accessibility}
                bestPracticesScore={speed.scores.bestPractices}
                aiScore={
                  report.website.aiResult.scores?.aiReadiness ??
                  report.website.aiResult.score
                }
                fcp={speed.metrics.fcp}
                lcp={speed.metrics.lcp}
                cls={speed.metrics.cls}
                tbt={speed.metrics.tbt}
                speedIndex={speed.metrics.speedIndex}
              />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}