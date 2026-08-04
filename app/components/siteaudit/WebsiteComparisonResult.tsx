"use client";

import { useLocale } from "next-intl";
import type { AiSeoResult, SpeedResult } from "./SiteAuditPage";

type Props = {
  websiteUrl: string;
  competitorUrl: string;
  websiteSpeed: SpeedResult;
  competitorSpeed: SpeedResult;
  websiteAi: AiSeoResult;
  competitorAi: AiSeoResult;
  explanation: ComparisonExplanationData | null;
  explanationLoading: boolean;
  explanationError: string;
};

export type ComparisonExplanationData = {
  verdict: string;
  websiteAdvantages: string[];
  competitorAdvantages: string[];
  keyDifferences: string[];
  priorityActions: string[];
  caution: string;
};

type ComparisonRow = {
  metric: "score" | "lcp" | "cls" | "pageSize" | "requests";
  label: string;
  websiteValue: string;
  competitorValue: string;
  websiteNumeric: number | null;
  competitorNumeric: number | null;
  higherIsBetter: boolean;
};

type Rating = "good" | "needs-improvement" | "poor" | "unknown";

function ratingFor(row: ComparisonRow, value: number | null): Rating {
  if (value === null) return "unknown";

  switch (row.metric) {
    case "score":
      if (value >= 90) return "good";
      if (value >= 50) return "needs-improvement";
      return "poor";
    case "lcp":
      if (value <= 2.5) return "good";
      if (value <= 4) return "needs-improvement";
      return "poor";
    case "cls":
      if (value <= 0.1) return "good";
      if (value <= 0.25) return "needs-improvement";
      return "poor";
    case "pageSize":
      if (value <= 1024 * 1024) return "good";
      if (value <= 3 * 1024 * 1024) return "needs-improvement";
      return "poor";
    case "requests":
      if (value <= 50) return "good";
      if (value <= 100) return "needs-improvement";
      return "poor";
  }
}

function ratingLabel(rating: Rating, isDutch: boolean) {
  if (rating === "good") return isDutch ? "Goed" : "Good";
  if (rating === "needs-improvement") {
    return isDutch ? "Kan beter" : "Needs improvement";
  }
  if (rating === "poor") return isDutch ? "Slecht" : "Poor";
  return isDutch ? "Niet beoordeeld" : "Not rated";
}

function ratingClass(rating: Rating) {
  if (rating === "good") return "text-emerald-400";
  if (rating === "needs-improvement") return "text-amber-300";
  if (rating === "poor") return "text-red-300";
  return "text-white/40";
}

function getDomain(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function parseMetric(value: string) {
  const normalized = value.replace(",", ".");
  const match = normalized.match(/[\d.]+/);
  if (!match) return null;

  const numericValue = Number(match[0]);
  if (!Number.isFinite(numericValue)) return null;

  if (/\bms\b/i.test(value)) return numericValue / 1000;
  return numericValue;
}

function formatBytes(value: number | null, locale: string) {
  if (value === null) return "—";

  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value / 1024 / 1024)} MB`;
}

function winnerFor(row: ComparisonRow) {
  if (
    row.websiteNumeric === null ||
    row.competitorNumeric === null ||
    row.websiteNumeric === row.competitorNumeric
  ) {
    return "tie" as const;
  }

  const websiteWins = row.higherIsBetter
    ? row.websiteNumeric > row.competitorNumeric
    : row.websiteNumeric < row.competitorNumeric;

  return websiteWins ? ("website" as const) : ("competitor" as const);
}

export default function WebsiteComparisonResult({
  websiteUrl,
  competitorUrl,
  websiteSpeed,
  competitorSpeed,
  websiteAi,
  competitorAi,
  explanation,
  explanationLoading,
  explanationError,
}: Props) {
  const currentLocale = useLocale();
  const isDutch = currentLocale === "nl";
  const numberLocale = isDutch ? "nl-NL" : "en-GB";

  const websiteDomain = getDomain(websiteSpeed.finalUrl || websiteUrl);
  const competitorDomain = getDomain(competitorSpeed.finalUrl || competitorUrl);

  const rows: ComparisonRow[] = [
    {
      metric: "score",
      label: "Performance",
      websiteValue: String(websiteSpeed.scores.performance),
      competitorValue: String(competitorSpeed.scores.performance),
      websiteNumeric: websiteSpeed.scores.performance,
      competitorNumeric: competitorSpeed.scores.performance,
      higherIsBetter: true,
    },
    {
      metric: "score",
      label: "SEO",
      websiteValue: String(websiteSpeed.scores.seo),
      competitorValue: String(competitorSpeed.scores.seo),
      websiteNumeric: websiteSpeed.scores.seo,
      competitorNumeric: competitorSpeed.scores.seo,
      higherIsBetter: true,
    },
    {
      metric: "score",
      label: "AI Readiness",
      websiteValue: String(websiteAi.scores?.aiReadiness ?? websiteAi.score),
      competitorValue: String(
        competitorAi.scores?.aiReadiness ?? competitorAi.score,
      ),
      websiteNumeric: websiteAi.scores?.aiReadiness ?? websiteAi.score,
      competitorNumeric: competitorAi.scores?.aiReadiness ?? competitorAi.score,
      higherIsBetter: true,
    },
    {
      metric: "lcp",
      label: "LCP",
      websiteValue: websiteSpeed.metrics.lcp,
      competitorValue: competitorSpeed.metrics.lcp,
      websiteNumeric: parseMetric(websiteSpeed.metrics.lcp),
      competitorNumeric: parseMetric(competitorSpeed.metrics.lcp),
      higherIsBetter: false,
    },
    {
      metric: "cls",
      label: "CLS",
      websiteValue: websiteSpeed.metrics.cls,
      competitorValue: competitorSpeed.metrics.cls,
      websiteNumeric: parseMetric(websiteSpeed.metrics.cls),
      competitorNumeric: parseMetric(competitorSpeed.metrics.cls),
      higherIsBetter: false,
    },
    {
      metric: "pageSize",
      label: isDutch ? "Paginagrootte" : "Page size",
      websiteValue: formatBytes(
        websiteSpeed.diagnosticSummary.totalTransferBytes,
        numberLocale,
      ),
      competitorValue: formatBytes(
        competitorSpeed.diagnosticSummary.totalTransferBytes,
        numberLocale,
      ),
      websiteNumeric: websiteSpeed.diagnosticSummary.totalTransferBytes,
      competitorNumeric: competitorSpeed.diagnosticSummary.totalTransferBytes,
      higherIsBetter: false,
    },
    {
      metric: "requests",
      label: isDutch ? "Netwerkverzoeken" : "Network requests",
      websiteValue: String(websiteSpeed.diagnosticSummary.requestCount),
      competitorValue: String(competitorSpeed.diagnosticSummary.requestCount),
      websiteNumeric: websiteSpeed.diagnosticSummary.requestCount,
      competitorNumeric: competitorSpeed.diagnosticSummary.requestCount,
      higherIsBetter: false,
    },
  ];

  const websiteWins = rows.filter((row) => winnerFor(row) === "website").length;
  const competitorWins = rows.filter(
    (row) => winnerFor(row) === "competitor",
  ).length;

  const summary =
    websiteWins === competitorWins
      ? isDutch
        ? "De websites presteren over de gemeten onderdelen ongeveer gelijk. Bekijk de afzonderlijke verschillen voordat je conclusies trekt."
        : "The websites perform similarly across the measured areas. Review the individual differences before drawing conclusions."
      : websiteWins > competitorWins
        ? isDutch
          ? `${websiteDomain} scoort beter op ${websiteWins} van de ${rows.length} gemeten onderdelen. Dit wijst op een technisch voordeel, maar bewijst op zichzelf geen hogere omzet of betere rankings.`
          : `${websiteDomain} performs better in ${websiteWins} of the ${rows.length} measured areas. This indicates a technical advantage, but does not by itself prove higher revenue or rankings.`
        : isDutch
          ? `${competitorDomain} scoort beter op ${competitorWins} van de ${rows.length} gemeten onderdelen. De grootste achterstanden hieronder zijn goede kandidaten voor verbetering.`
          : `${competitorDomain} performs better in ${competitorWins} of the ${rows.length} measured areas. The largest gaps below are strong candidates for improvement.`;

  return (
    <section className="mt-12 w-full min-w-0 rounded-3xl border border-[#D4AF37]/30 bg-white/[0.06] p-5 shadow-2xl sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            {isDutch ? "Websitevergelijking" : "Website comparison"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            {websiteDomain} <span className="text-white/35">vs.</span>{" "}
            {competitorDomain}
          </h2>
        </div>
        <p className="text-sm text-white/50">
          {websiteSpeed.strategy === "mobile"
            ? isDutch
              ? "Mobiele resultaten"
              : "Mobile results"
            : isDutch
              ? "Desktopresultaten"
              : "Desktop results"}
        </p>
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[minmax(110px,1fr)_minmax(90px,0.8fr)_minmax(90px,0.8fr)] bg-black/30 px-3 py-3 text-xs font-semibold text-white/55 sm:px-5">
          <span>{isDutch ? "Metriek" : "Metric"}</span>
          <span className="truncate text-center">{websiteDomain}</span>
          <span className="truncate text-center">{competitorDomain}</span>
        </div>

        {rows.map((row) => {
          const winner = winnerFor(row);
          const websiteRating = ratingFor(row, row.websiteNumeric);
          const competitorRating = ratingFor(row, row.competitorNumeric);

          return (
            <div
              key={row.label}
              className="grid grid-cols-[minmax(110px,1fr)_minmax(90px,0.8fr)_minmax(90px,0.8fr)] items-center border-t border-white/10 px-3 py-4 text-sm sm:px-5"
            >
              <span className="font-medium text-white/70">{row.label}</span>
              <MetricValue
                value={row.websiteValue}
                rating={websiteRating}
                isWinner={winner === "website"}
                isDutch={isDutch}
              />
              <MetricValue
                value={row.competitorValue}
                rating={competitorRating}
                isWinner={winner === "competitor"}
                isDutch={isDutch}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-black/25 p-5">
        <p className="text-sm font-semibold text-[#D4AF37]">
          {isDutch
            ? "Wat de vergelijking laat zien"
            : "What the comparison shows"}
        </p>
        <p className="mt-3 text-sm leading-6 text-white/65">{summary}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-black/25 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
          {isDutch ? "AI-vergelijkingsanalyse" : "AI comparison analysis"}
        </p>

        {explanationLoading ? (
          <div className="mt-4 flex items-center gap-3 text-sm text-white/60">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-[#D4AF37]" />
            <span>
              {isDutch
                ? "De verschillen worden geanalyseerd..."
                : "Analysing the differences..."}
            </span>
          </div>
        ) : explanationError ? (
          <p className="mt-4 text-sm leading-6 text-red-300">
            {explanationError}
          </p>
        ) : explanation ? (
          <div className="mt-5 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">
                {isDutch ? "Conclusie" : "Verdict"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {explanation.verdict}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ComparisonList
                title={
                  isDutch
                    ? `Voordelen van ${websiteDomain}`
                    : `${websiteDomain} advantages`
                }
                items={explanation.websiteAdvantages}
                emptyText={
                  isDutch
                    ? "Geen duidelijk voordeel aangetoond."
                    : "No clear advantage was demonstrated."
                }
                accent="emerald"
              />
              <ComparisonList
                title={
                  isDutch
                    ? `Voordelen van ${competitorDomain}`
                    : `${competitorDomain} advantages`
                }
                items={explanation.competitorAdvantages}
                emptyText={
                  isDutch
                    ? "Geen duidelijk voordeel aangetoond."
                    : "No clear advantage was demonstrated."
                }
                accent="blue"
              />
            </div>

            <ComparisonList
              title={isDutch ? "Belangrijkste verschillen" : "Key differences"}
              items={explanation.keyDifferences}
              emptyText={
                isDutch
                  ? "Geen belangrijke verschillen gevonden."
                  : "No significant differences were found."
              }
              numbered
            />

            <ComparisonList
              title={
                isDutch
                  ? `Prioriteiten voor ${websiteDomain}`
                  : `Priorities for ${websiteDomain}`
              }
              items={explanation.priorityActions}
              emptyText={
                isDutch
                  ? "Geen ondersteunde prioriteitsactie gevonden."
                  : "No supported priority action was found."
              }
              accent="gold"
              numbered
            />

            <p className="border-t border-white/10 pt-4 text-xs leading-5 text-white/45">
              {explanation.caution}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MetricValue({
  value,
  rating,
  isWinner,
  isDutch,
}: {
  value: string;
  rating: Rating;
  isWinner: boolean;
  isDutch: boolean;
}) {
  return (
    <div className="min-w-0 text-center">
      <p className="font-semibold text-white/85">{value}</p>
      <div className="mt-1 flex flex-col items-center gap-0.5 text-[10px] leading-4 sm:text-xs">
        {isWinner ? (
          <span className="text-emerald-400">
            {isDutch ? "Beter dan concurrent" : "Better than competitor"}
          </span>
        ) : null}
        <span className={ratingClass(rating)}>
          {ratingLabel(rating, isDutch)}
        </span>
      </div>
    </div>
  );
}

function ComparisonList({
  title,
  items,
  emptyText,
  accent = "neutral",
  numbered = false,
}: {
  title: string;
  items: string[];
  emptyText: string;
  accent?: "neutral" | "emerald" | "blue" | "gold";
  numbered?: boolean;
}) {
  const borderColor =
    accent === "emerald"
      ? "border-emerald-400/20"
      : accent === "blue"
        ? "border-sky-400/20"
        : accent === "gold"
          ? "border-[#D4AF37]/25"
          : "border-white/10";

  return (
    <div className={`rounded-xl border ${borderColor} bg-white/[0.03] p-4`}>
      <h3 className="text-sm font-semibold text-white/85">{title}</h3>
      {items.length > 0 ? (
        <ol className="mt-3 space-y-2 text-sm leading-6 text-white/65">
          {items.map((item, index) => (
            <li key={`${index}-${item}`} className="flex gap-3">
              <span className="shrink-0 text-[#D4AF37]">
                {numbered ? `${index + 1}.` : "•"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-white/45">{emptyText}</p>
      )}
    </div>
  );
}