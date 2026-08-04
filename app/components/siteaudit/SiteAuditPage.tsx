"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import LocaleLink from "../LocaleLink";
import SiteAuditHero from "./SiteAuditHero";
import SiteAuditUrlForm from "./SiteAuditUrlForm";
import SpeedAuditResult from "./SpeedAuditResult";
import AiSeoAuditResult from "./AiSeoAuditResult";
import AuditShareCard from "./AuditShareCard";
import AiExplainResult, { type AiExplainData } from "./AiExplainResult";
import WebsiteComparisonResult, {
  type ComparisonExplanationData,
} from "./WebsiteComparisonResult";

type DeviceTab = "mobile" | "desktop";
type Severity = "high" | "medium" | "low";

export type SpeedIssue = {
  id?: string;
  category?: string;
  severity?: Severity;
  title: string;
  description: string;
  score: number | null;
  displayValue: string | null;
  numericValue?: number | null;
  numericUnit?: string | null;
  savingsMs?: number | null;
  savingsBytes?: number | null;
  evidence?: Array<Record<string, string | number | boolean | null>>;
};

export type DiagnosticSummary = {
  requestCount: number;
  totalTransferBytes: number | null;
  scriptTransferBytes: number | null;
  imageTransferBytes: number | null;
  thirdPartyCount: number;
  longTaskCount: number;
  layoutShiftCount: number;
  lcpElement: Record<string, string | number | boolean | null> | null;
};

export type SeoIssue = {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  measuredValue: string | number | boolean | null;
  expectedValue: string | number | boolean | null;
  evidence: string;
  recommendation: string;
};

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
  diagnosticSummary: DiagnosticSummary;
  issues: SpeedIssue[];
};

export type AiSeoResult = {
  score: number;
  scores?: {
    technicalSeo: number;
    content: number;
    localSeo: number;
    aiReadiness: number;
    conversion: number;
    social: number;
  };
  extracted: {
    title: string;
    description: string;
    h1Count: number;
    h2Count: number;
    schemaCount: number;
    faqDetected: boolean;
    ogDetected: boolean;
    canonicalDetected: boolean;
    [key: string]: unknown;
  };
  issues: SeoIssue[];
  recommendations: string[];
};

type SpeedResultCache = {
  mobile: SpeedResult | null;
  desktop: SpeedResult | null;
};

type AiExplainCache = {
  mobile: AiExplainData | null;
  desktop: AiExplainData | null;
};

type ComparisonExplanationCache = {
  mobile: ComparisonExplanationData | null;
  desktop: ComparisonExplanationData | null;
};

type AuditBundle = {
  speed: SpeedResult;
  ai: AiSeoResult;
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
  const locale = useLocale();

  const [url, setUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState("");
  const [lastAnalyzedCompetitorUrl, setLastAnalyzedCompetitorUrl] =
    useState("");
  const [activeTab, setActiveTab] = useState<DeviceTab>("mobile");

  const [speedResults, setSpeedResults] = useState<SpeedResultCache>({
    mobile: null,
    desktop: null,
  });

  const [aiResult, setAiResult] = useState<AiSeoResult | null>(null);
  const [aiExplainResults, setAiExplainResults] = useState<AiExplainCache>({
    mobile: null,
    desktop: null,
  });

  const [competitorSpeedResults, setCompetitorSpeedResults] =
    useState<SpeedResultCache>({
      mobile: null,
      desktop: null,
    });
  const [competitorAiResult, setCompetitorAiResult] =
    useState<AiSeoResult | null>(null);
  const [competitorAiExplainResults, setCompetitorAiExplainResults] =
    useState<AiExplainCache>({
      mobile: null,
      desktop: null,
    });

  const [comparisonExplanationResults, setComparisonExplanationResults] =
    useState<ComparisonExplanationCache>({
      mobile: null,
      desktop: null,
    });

  const [loadingTab, setLoadingTab] = useState<DeviceTab | null>(null);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingCompetitor, setLoadingCompetitor] = useState(false);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [comparisonError, setComparisonError] = useState("");
  const [error, setError] = useState("");
  const [saveConsent, setSaveConsent] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportPath, setReportPath] = useState<string | null>(null);
  const [savingReport, setSavingReport] = useState(false);
  const [saveError, setSaveError] = useState("");
  const lastSavedPayloadRef = useRef("");

  const normalizedUrl = normalizeUrl(url);
  const normalizedCompetitorUrl = normalizeUrl(competitorUrl);
  const activeSpeedResult = speedResults[activeTab];
  const activeCompetitorSpeedResult = competitorSpeedResults[activeTab];
  const activeAiExplain = aiExplainResults[activeTab];
  const activeComparisonExplanation = comparisonExplanationResults[activeTab];
  const isLoading = loadingTab !== null || loadingCompetitor;
  const canAnalyze =
    normalizedUrl.length > 0 &&
    !isLoading &&
    !loadingExplain &&
    !loadingComparison &&
    !savingReport;

  useEffect(() => {
    const websiteHasResult =
      Boolean(speedResults.mobile && aiExplainResults.mobile) ||
      Boolean(speedResults.desktop && aiExplainResults.desktop);
    const comparisonRequired = Boolean(lastAnalyzedCompetitorUrl);
    const competitorHasResult =
      Boolean(
        competitorSpeedResults.mobile && competitorAiExplainResults.mobile,
      ) ||
      Boolean(
        competitorSpeedResults.desktop && competitorAiExplainResults.desktop,
      );
    const comparisonHasExplanation =
      Boolean(comparisonExplanationResults.mobile) ||
      Boolean(comparisonExplanationResults.desktop);

    if (
      !saveConsent ||
      !lastAnalyzedUrl ||
      !aiResult ||
      !websiteHasResult ||
      loadingTab ||
      loadingExplain ||
      loadingCompetitor ||
      loadingComparison ||
      (comparisonRequired &&
        (!competitorAiResult ||
          !competitorHasResult ||
          !comparisonHasExplanation))
    )
      return;

    const payload = {
      ...(reportId ? { auditId: reportId } : {}),
      locale,
      website: {
        url: lastAnalyzedUrl,
        speedResults,
        aiResult,
        aiExplainResults,
      },
      competitor: comparisonRequired
        ? {
            url: lastAnalyzedCompetitorUrl,
            speedResults: competitorSpeedResults,
            aiResult: competitorAiResult,
            aiExplainResults: competitorAiExplainResults,
          }
        : null,
      comparisonExplanationResults: comparisonRequired
        ? comparisonExplanationResults
        : null,
    };
    const payloadKey = JSON.stringify(payload);
    if (lastSavedPayloadRef.current === payloadKey) return;

    lastSavedPayloadRef.current = payloadKey;
    setSavingReport(true);
    setSaveError("");

    void fetch("/api/siteaudit/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payloadKey,
    })
      .then(async (response) => {
        const data = (await response.json()) as {
          auditId?: string;
          reportPath?: string;
          error?: string;
        };
        if (!response.ok || !data.auditId || !data.reportPath) {
          throw new Error(data.error ?? "The report could not be saved.");
        }
        setReportId(data.auditId);
        setReportPath(data.reportPath);
      })
      .catch((failure: unknown) => {
        lastSavedPayloadRef.current = "";
        setSaveError(
          failure instanceof Error
            ? failure.message
            : "The report could not be saved.",
        );
      })
      .finally(() => setSavingReport(false));
  }, [
    aiExplainResults,
    aiResult,
    comparisonExplanationResults,
    competitorAiExplainResults,
    competitorAiResult,
    competitorSpeedResults,
    lastAnalyzedCompetitorUrl,
    lastAnalyzedUrl,
    loadingComparison,
    loadingCompetitor,
    loadingExplain,
    loadingTab,
    locale,
    reportId,
    saveConsent,
    speedResults,
  ]);

  async function fetchComparisonExplanation(params: {
    strategy: DeviceTab;
    website: AuditBundle;
    competitor: AuditBundle;
  }) {
    setLoadingComparison(true);
    setComparisonError("");

    try {
      const response = await fetch("/api/siteaudit/ai-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          strategy: params.strategy,
          website: {
            domain: getDomain(params.website.speed.finalUrl || normalizedUrl),
            scores: {
              performance: params.website.speed.scores.performance,
              lighthouseSeo: params.website.speed.scores.seo,
              accessibility: params.website.speed.scores.accessibility,
              bestPractices: params.website.speed.scores.bestPractices,
              aiReadiness:
                params.website.ai.scores?.aiReadiness ??
                params.website.ai.score,
            },
            metrics: params.website.speed.metrics,
            diagnosticSummary: params.website.speed.diagnosticSummary,
            speedIssues: params.website.speed.issues,
            seoIssues: params.website.ai.issues,
          },
          competitor: {
            domain: getDomain(
              params.competitor.speed.finalUrl || normalizedCompetitorUrl,
            ),
            scores: {
              performance: params.competitor.speed.scores.performance,
              lighthouseSeo: params.competitor.speed.scores.seo,
              accessibility: params.competitor.speed.scores.accessibility,
              bestPractices: params.competitor.speed.scores.bestPractices,
              aiReadiness:
                params.competitor.ai.scores?.aiReadiness ??
                params.competitor.ai.score,
            },
            metrics: params.competitor.speed.metrics,
            diagnosticSummary: params.competitor.speed.diagnosticSummary,
            speedIssues: params.competitor.speed.issues,
            seoIssues: params.competitor.ai.issues,
          },
        }),
      });

      const data = (await response.json()) as ComparisonExplanationData & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "AI comparison failed.");
      }

      setComparisonExplanationResults((current) => ({
        ...current,
        [params.strategy]: data,
      }));
    } catch (err) {
      setComparisonError(
        err instanceof Error ? err.message : "AI comparison failed.",
      );
    } finally {
      setLoadingComparison(false);
    }
  }

  async function fetchAiExplain(params: {
    domain: string;
    strategy: DeviceTab;
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
          locale,
          performanceScore: params.speedData.scores.performance,
          seoScore: params.speedData.scores.seo,
          accessibilityScore: params.speedData.scores.accessibility,
          bestPracticesScore: params.speedData.scores.bestPractices,
          aiSeoScore: params.aiData.scores?.aiReadiness ?? params.aiData.score,

          metrics: params.speedData.metrics,

          diagnosticSummary: params.speedData.diagnosticSummary,

          speedIssues: params.speedData.issues,
          seoIssues: params.aiData.issues,
        }),
      });

      const explainData = await explainResponse.json();

      if (!explainResponse.ok) {
        throw new Error(explainData.error ?? "AI explanation failed.");
      }

      setAiExplainResults((current) => ({
        ...current,
        [params.strategy]: explainData as AiExplainData,
      }));
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
      return {
        speed: speedResults[strategy],
        ai: aiResult,
      };
    }

    setError("");
    setActiveTab(strategy);

    const sameUrl = cleanUrl === lastAnalyzedUrl;

    if (
      sameUrl &&
      speedResults[strategy] &&
      aiResult &&
      aiExplainResults[strategy]
    ) {
      return;
    }

    setLoadingTab(strategy);

    try {
      const shouldFetchAiSeo = !sameUrl || !aiResult;
      const shouldFetchExplain = !sameUrl || !aiExplainResults[strategy];

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
          strategy,
          speedData,
          aiData: nextAiResult,
        });
      }

      if (!nextAiResult) return null;
      return { speed: speedData, ai: nextAiResult };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed.");
    } finally {
      setLoadingTab(null);
    }

    return null;
  }

  async function runCompetitorAudit(strategy: DeviceTab) {
    const cleanUrl = normalizeUrl(competitorUrl);

    if (!cleanUrl) return;

    const sameUrl = cleanUrl === lastAnalyzedCompetitorUrl;

    if (
      sameUrl &&
      competitorSpeedResults[strategy] &&
      competitorAiResult &&
      competitorAiExplainResults[strategy]
    ) {
      return {
        speed: competitorSpeedResults[strategy],
        ai: competitorAiResult,
      };
    }

    setLoadingCompetitor(true);

    try {
      const shouldFetchAiSeo = !sameUrl || !competitorAiResult;
      const shouldFetchExplain =
        !sameUrl || !competitorAiExplainResults[strategy];

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
        throw new Error(speedData.error ?? "Competitor speed audit failed.");
      }

      let nextAiResult = competitorAiResult;

      if (aiSeoPromise) {
        const aiSeoResponse = await aiSeoPromise;
        const aiSeoData = (await aiSeoResponse.json()) as AiSeoResult & {
          error?: string;
        };

        if (!aiSeoResponse.ok) {
          throw new Error(aiSeoData.error ?? "Competitor AI SEO audit failed.");
        }

        nextAiResult = aiSeoData;
        setCompetitorAiResult(aiSeoData);
      }

      setCompetitorSpeedResults((current) => {
        if (!sameUrl) {
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

      setLastAnalyzedCompetitorUrl(cleanUrl);

      if (shouldFetchExplain && nextAiResult) {
        const explainResponse = await fetch("/api/siteaudit/ai-explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domain: getDomain(speedData.finalUrl || cleanUrl),
            locale,
            performanceScore: speedData.scores.performance,
            seoScore: speedData.scores.seo,
            accessibilityScore: speedData.scores.accessibility,
            bestPracticesScore: speedData.scores.bestPractices,
            aiSeoScore: nextAiResult.scores?.aiReadiness ?? nextAiResult.score,
            metrics: speedData.metrics,
            diagnosticSummary: speedData.diagnosticSummary,
            speedIssues: speedData.issues,
            seoIssues: nextAiResult.issues,
          }),
        });

        const explainData = await explainResponse.json();

        if (!explainResponse.ok) {
          throw new Error(
            explainData.error ?? "Competitor AI explanation failed.",
          );
        }

        setCompetitorAiExplainResults((current) => ({
          ...current,
          [strategy]: explainData as AiExplainData,
        }));
      }

      if (!nextAiResult) return null;
      return { speed: speedData, ai: nextAiResult };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Competitor audit failed.");
    } finally {
      setLoadingCompetitor(false);
    }

    return null;
  }

  async function handleAnalyze(strategy: DeviceTab) {
    setError("");
    setActiveTab(strategy);

    const [websiteAudit, competitorAudit] = await Promise.all([
      runAudit(strategy),
      normalizedCompetitorUrl
        ? runCompetitorAudit(strategy)
        : Promise.resolve(null),
    ]);

    if (
      !normalizedCompetitorUrl ||
      !websiteAudit?.speed ||
      !websiteAudit.ai ||
      !competitorAudit?.speed ||
      !competitorAudit.ai ||
      comparisonExplanationResults[strategy]
    ) {
      return;
    }

    await fetchComparisonExplanation({
      strategy,
      website: {
        speed: websiteAudit.speed,
        ai: websiteAudit.ai,
      },
      competitor: {
        speed: competitorAudit.speed,
        ai: competitorAudit.ai,
      },
    });
  }

  function handleUrlChange(value: string) {
    setUrl(value);
    setError("");

    const cleanUrl = normalizeUrl(value);

    if (cleanUrl !== lastAnalyzedUrl) {
      setReportId(null);
      setReportPath(null);
      setSaveError("");
      lastSavedPayloadRef.current = "";
      setSpeedResults({
        mobile: null,
        desktop: null,
      });

      setAiResult(null);
      setAiExplainResults({
        mobile: null,
        desktop: null,
      });
      setComparisonExplanationResults({ mobile: null, desktop: null });
      setComparisonError("");
    }
  }

  function handleCompetitorUrlChange(value: string) {
    setCompetitorUrl(value);
    setError("");

    const cleanUrl = normalizeUrl(value);

    if (cleanUrl !== lastAnalyzedCompetitorUrl) {
      setReportId(null);
      setReportPath(null);
      setSaveError("");
      lastSavedPayloadRef.current = "";
      setCompetitorSpeedResults({
        mobile: null,
        desktop: null,
      });
      setCompetitorAiResult(null);
      setCompetitorAiExplainResults({
        mobile: null,
        desktop: null,
      });
      setComparisonExplanationResults({ mobile: null, desktop: null });
      setComparisonError("");
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
          competitorUrl={competitorUrl}
          setCompetitorUrl={handleCompetitorUrlChange}
          onAnalyze={() => void handleAnalyze(activeTab)}
          loading={isLoading || loadingExplain || loadingComparison}
          error={error}
          disabled={!canAnalyze}
          saveConsent={saveConsent}
          setSaveConsent={setSaveConsent}
        />

        <div className="mt-8 flex w-full rounded-2xl border border-white/10 bg-white/[0.04] p-1 sm:w-fit">
          {(["mobile", "desktop"] as const).map((tab) => {
            const hasCachedResult =
              lastAnalyzedUrl === normalizedUrl && Boolean(speedResults[tab]);

            return (
              <button
                key={tab}
                onClick={() => void handleAnalyze(tab)}
                disabled={isLoading || loadingExplain || loadingComparison}
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

        {activeSpeedResult &&
        aiResult &&
        activeCompetitorSpeedResult &&
        competitorAiResult ? (
          <WebsiteComparisonResult
            websiteUrl={lastAnalyzedUrl}
            competitorUrl={lastAnalyzedCompetitorUrl}
            websiteSpeed={activeSpeedResult}
            competitorSpeed={activeCompetitorSpeedResult}
            websiteAi={aiResult}
            competitorAi={competitorAiResult}
            explanation={activeComparisonExplanation}
            explanationLoading={loadingComparison}
            explanationError={comparisonError}
          />
        ) : null}

        {activeSpeedResult && aiResult ? (
          <section className="mt-8 rounded-3xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              {savingReport
                ? locale === "nl"
                  ? "Rapport opslaan"
                  : "Saving report"
                : locale === "nl"
                  ? "Jouw rapport is klaar"
                  : "Your report is ready"}
            </p>
            <p className="mt-2 text-sm text-white/65">
              {saveError
                ? saveError
                : reportPath
                  ? locale === "nl"
                    ? "Het rapport is opgeslagen en kan nu worden gedeeld."
                    : "The report was saved and can now be shared."
                  : locale === "nl"
                    ? "Het rapport wordt automatisch opgeslagen zodra de analyse klaar is."
                    : "The report will be saved automatically when the analysis is complete."}
            </p>
            {reportPath ? (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={reportPath}
                  className="rounded-2xl bg-[#D4AF37] px-5 py-3 text-center font-semibold text-black transition hover:bg-white"
                >
                  {locale === "nl"
                    ? "Volledig rapport bekijken"
                    : "View full report"}
                </a>
                <button
                  type="button"
                  onClick={() =>
                    void navigator.clipboard.writeText(
                      new URL(reportPath, window.location.origin).toString(),
                    )
                  }
                  className="rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-white/40"
                >
                  {locale === "nl"
                    ? "Rapportlink kopiëren"
                    : "Copy report link"}
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        {activeSpeedResult && aiResult ? (
          <div className="mt-12 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
            <div className="min-w-0 space-y-6">
              <SpeedAuditResult data={activeSpeedResult} />

              <AiExplainResult
                data={activeAiExplain}
                loading={loadingExplain}
              />

              <AiSeoAuditResult data={aiResult} />
            </div>

            <div className="min-w-0 space-y-6">
              <AuditShareCard
                domain={domain}
                speedScore={activeSpeedResult.scores.performance}
                seoScore={activeSpeedResult.scores.seo}
                accessibilityScore={activeSpeedResult.scores.accessibility}
                bestPracticesScore={activeSpeedResult.scores.bestPractices}
                aiScore={aiResult.scores?.aiReadiness ?? aiResult.score}
                fcp={activeSpeedResult.metrics.fcp}
                lcp={activeSpeedResult.metrics.lcp}
                cls={activeSpeedResult.metrics.cls}
                tbt={activeSpeedResult.metrics.tbt}
                speedIndex={activeSpeedResult.metrics.speedIndex}
              />

              <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
                <h2 className="text-xl font-semibold">{t("needHelpTitle")}</h2>

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