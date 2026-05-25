"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import LocaleLink from "../LocaleLink";
import SiteAuditHero from "./SiteAuditHero";
import SiteAuditUrlForm from "./SiteAuditUrlForm";
import SpeedAuditResult from "./SpeedAuditResult";
import AiSeoAuditResult from "./AiSeoAuditResult";
import AuditShareCard from "./AuditShareCard";
import AiExplainResult, { type AiExplainData } from "./AiExplainResult";

type DeviceTab = "mobile" | "desktop";

export type SpeedResult = {
  finalUrl: string;
  strategy: DeviceTab;
  scores: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
  };
  metrics: {
    fcp: string;
    lcp: string;
    cls: string;
    tbt: string;
    speedIndex: string;
  };
  issues: {
    title: string;
    description: string;
    score: number | null;
    displayValue: string | null;
  }[];
};

export type AiSeoResult = {
  score: number;
  extracted: {
    title: string;
    description: string;
    h1Count: number;
    h2Count: number;
    schemaCount: number;
    faqDetected: boolean;
    ogDetected: boolean;
    canonicalDetected: boolean;
  };
  recommendations: string[];
};

type SpeedResultCache = {
  mobile: SpeedResult | null;
  desktop: SpeedResult | null;
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getDomain(value: string) {
  try {
    return new URL(value).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export default function SiteAuditPage() {
  const t = useTranslations("siteaudit");

  const [url, setUrl] = useState("");
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState("");
  const [activeTab, setActiveTab] = useState<DeviceTab>("mobile");

  const [speedResults, setSpeedResults] = useState<SpeedResultCache>({
    mobile: null,
    desktop: null,
  });

  const [aiResult, setAiResult] = useState<AiSeoResult | null>(null);
  const [aiExplain, setAiExplain] = useState<AiExplainData | null>(null);

  const [loadingTab, setLoadingTab] = useState<DeviceTab | null>(null);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [error, setError] = useState("");

  const normalizedUrl = normalizeUrl(url);
  const activeSpeedResult = speedResults[activeTab];
  const isLoading = loadingTab !== null;
  const canAnalyze = normalizedUrl.length > 0 && !isLoading && !loadingExplain;

  async function fetchAiExplain(params: {
    domain: string;
    speedData: SpeedResult;
    aiData: AiSeoResult;
  }) {
    setLoadingExplain(true);

    try {
      const explainResponse = await fetch("/api/siteaudit/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: params.domain,
          performanceScore: params.speedData.scores.performance,
          seoScore: params.speedData.scores.seo,
          accessibilityScore: params.speedData.scores.accessibility,
          bestPracticesScore: params.speedData.scores.bestPractices,
          aiSeoScore: params.aiData.score,
          issues: params.speedData.issues,
        }),
      });

      const explainData = await explainResponse.json();

      if (!explainResponse.ok) {
        throw new Error(explainData.error ?? "AI explanation failed.");
      }

      setAiExplain(explainData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI explanation failed.");
    } finally {
      setLoadingExplain(false);
    }
  }

  async function runAudit(strategy: DeviceTab) {
    const cleanUrl = normalizeUrl(url);

    if (!cleanUrl) {
      setError("Please enter a website URL.");
      return;
    }

    setError("");
    setActiveTab(strategy);

    const sameUrl = cleanUrl === lastAnalyzedUrl;

    if (sameUrl && speedResults[strategy] && aiResult && aiExplain) {
      return;
    }

    setLoadingTab(strategy);

    try {
      const shouldFetchAiSeo = !sameUrl || !aiResult;
      const shouldFetchExplain = !sameUrl || !aiExplain;

      const speedPromise = fetch("/api/siteaudit/speed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl, strategy }),
      });

      const aiSeoPromise = shouldFetchAiSeo
        ? fetch("/api/siteaudit/ai-seo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: cleanUrl }),
          })
        : null;

      const speedResponse = await speedPromise;
      const speedData = (await speedResponse.json()) as SpeedResult & {
        error?: string;
      };

      if (!speedResponse.ok) {
        throw new Error(speedData.error ?? "Speed audit failed.");
      }

      let nextAiResult = aiResult;

      if (aiSeoPromise) {
        const aiSeoResponse = await aiSeoPromise;
        const aiSeoData = (await aiSeoResponse.json()) as AiSeoResult & {
          error?: string;
        };

        if (!aiSeoResponse.ok) {
          throw new Error(aiSeoData.error ?? "AI SEO audit failed.");
        }

        nextAiResult = aiSeoData;
        setAiResult(aiSeoData);
      }

      setSpeedResults((current) => {
        if (cleanUrl !== lastAnalyzedUrl) {
          return {
            mobile: strategy === "mobile" ? speedData : null,
            desktop: strategy === "desktop" ? speedData : null,
          };
        }

        return {
          ...current,
          [strategy]: speedData,
        };
      });

      setLastAnalyzedUrl(cleanUrl);

      if (shouldFetchExplain && nextAiResult) {
        await fetchAiExplain({
          domain: getDomain(speedData.finalUrl || cleanUrl),
          speedData,
          aiData: nextAiResult,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed.");
    } finally {
      setLoadingTab(null);
    }
  }

  function handleUrlChange(value: string) {
    setUrl(value);
    setError("");

    const cleanUrl = normalizeUrl(value);

    if (cleanUrl !== lastAnalyzedUrl) {
      setSpeedResults({
        mobile: null,
        desktop: null,
      });

      setAiResult(null);
      setAiExplain(null);
    }
  }

  const domain = activeSpeedResult?.finalUrl
    ? getDomain(activeSpeedResult.finalUrl)
    : getDomain(normalizedUrl);

 return (
  <main className="min-h-screen overflow-x-hidden bg-[#070A12] text-white">
    <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-20 sm:px-6 lg:px-8">
      <SiteAuditHero />

      <SiteAuditUrlForm
        url={url}
        setUrl={handleUrlChange}
        onAnalyze={() => void runAudit(activeTab)}
        loading={isLoading || loadingExplain}
        error={error}
        disabled={!canAnalyze}
      />

      <div className="mt-8 flex w-full rounded-2xl border border-white/10 bg-white/[0.04] p-1 sm:w-fit">
        {(["mobile", "desktop"] as const).map((tab) => {
          const hasCachedResult =
            lastAnalyzedUrl === normalizedUrl && Boolean(speedResults[tab]);

          return (
            <button
              key={tab}
              onClick={() => void runAudit(tab)}
              disabled={isLoading || loadingExplain}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold capitalize transition sm:flex-none sm:px-6 ${
                activeTab === tab
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loadingTab === tab
                ? t("tabs.loading")
                : hasCachedResult
                  ? `${t(`tabs.${tab}`)} ✓`
                  : t(`tabs.${tab}`)}
            </button>
          );
        })}
      </div>

      {(isLoading && !activeSpeedResult) || loadingExplain ? (
        <div className="mt-12 w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] sm:text-sm">
            {t("runningAudit")}
          </p>

          <h2 className="mt-4 text-xl font-semibold sm:text-2xl">
            {loadingExplain
              ? t("chatgptLoadingTitle")
              : t("testingWebsite", {
                  domain: domain || t("testingFallback"),
                  device: t(`tabs.${loadingTab ?? "mobile"}`).toLowerCase(),
                })}
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/55">
            {loadingExplain
              ? t("chatgptLoadingText")
              : t("pagespeedLoadingText")}
          </p>
        </div>
      ) : null}

      {activeSpeedResult && aiResult ? (
        <div className="mt-12 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
          <div className="min-w-0 space-y-6">
            <SpeedAuditResult data={activeSpeedResult} />

            <AiExplainResult data={aiExplain} loading={loadingExplain} />

            <AiSeoAuditResult data={aiResult} />
          </div>

          <div className="min-w-0 space-y-6">
           <AuditShareCard
  domain={domain}
  speedScore={activeSpeedResult.scores.performance}
  seoScore={activeSpeedResult.scores.seo}
  accessibilityScore={activeSpeedResult.scores.accessibility}
  bestPracticesScore={activeSpeedResult.scores.bestPractices}
  aiScore={aiResult.score}
  fcp={activeSpeedResult.metrics.fcp}
  lcp={activeSpeedResult.metrics.lcp}
  cls={activeSpeedResult.metrics.cls}
  tbt={activeSpeedResult.metrics.tbt}
  speedIndex={activeSpeedResult.metrics.speedIndex}
/>

            <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
              <h2 className="text-xl font-semibold">
                {t("needHelpTitle")}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/60">
                {t("needHelpText")}
              </p>

              <LocaleLink
                href="/contact"
                className="mt-6 block rounded-2xl bg-[#D4AF37] px-5 py-4 text-center font-semibold text-black transition hover:bg-white"
              >
                {t("contactButton")}
              </LocaleLink>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </main>
);
}