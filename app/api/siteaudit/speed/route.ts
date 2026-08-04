import { NextResponse } from "next/server";
import {
  checkSiteAuditRateLimit,
  getClientIp,
} from "@/lib/siteauditRateLimit";

type Strategy = "mobile" | "desktop";
type Severity = "high" | "medium" | "low";

type LighthouseAudit = {
  id?: string;
  title?: string;
  description?: string;
  score?: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
  details?: {
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
    items?: Array<Record<string, unknown>>;
  };
};

type AuditEvidence = Record<string, string | number | boolean | null>;

const EVIDENCE_KEYS = [
  "url",
  "source",
  "entity",
  "label",
  "groupLabel",
  "wastedMs",
  "wastedBytes",
  "totalBytes",
  "transferSize",
  "resourceSize",
  "duration",
  "blockingTime",
] as const;

function getNodeLabel(value: unknown) {
  if (!value || typeof value !== "object") return null;

  const node = value as Record<string, unknown>;
  const label = node.nodeLabel ?? node.snippet ?? node.selector;

  return typeof label === "string" ? label.slice(0, 500) : null;
}

function extractEvidence(audit?: LighthouseAudit, limit = 5) {
  const items = audit?.details?.items ?? [];

  return items.slice(0, limit).map((item) => {
    const evidence: AuditEvidence = {};

    for (const key of EVIDENCE_KEYS) {
      const value = item[key];

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        evidence[key] =
          typeof value === "string" ? value.slice(0, 1000) : value;
      }
    }

    const node = getNodeLabel(item.node);
    if (node) evidence.node = node;

    return evidence;
  });
}

function getAuditItemCount(audit?: LighthouseAudit) {
  return audit?.details?.items?.length ?? 0;
}

function sumItemNumber(audit: LighthouseAudit | undefined, key: string) {
  return roundOptional(
    (audit?.details?.items ?? []).reduce((total, item) => {
      const value = item[key];
      return total + (typeof value === "number" ? value : 0);
    }, 0)
  );
}

const RELEVANT_AUDIT_IDS = [
  "render-blocking-resources",
  "unused-javascript",
  "unused-css-rules",
  "uses-optimized-images",
  "modern-image-formats",
  "uses-responsive-images",
  "offscreen-images",
  "uses-text-compression",
  "server-response-time",
  "uses-long-cache-ttl",
  "redirects",
  "mainthread-work-breakdown",
  "bootup-time",
  "third-party-summary",
  "third-party-facades",
  "total-byte-weight",
  "network-requests",
  "network-rtt",
  "network-server-latency",
  "dom-size",
  "long-tasks",
  "duplicated-javascript",
  "legacy-javascript",
  "unminified-javascript",
  "unminified-css",
  "uses-rel-preconnect",
  "uses-rel-preload",
  "font-display",
  "largest-contentful-paint-element",
  "lcp-lazy-loaded",
  "prioritize-lcp-image",
  "layout-shifts",
  "unsized-images",
  "efficient-animated-content",
] as const;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function cleanDescription(description?: string) {
  if (!description) return "";

  return description
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function roundOptional(value?: number, decimals = 0) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function getSeverity(audit: LighthouseAudit): Severity {
  const score = audit.score;
  const savingsMs = audit.details?.overallSavingsMs ?? 0;
  const savingsBytes = audit.details?.overallSavingsBytes ?? 0;

  if (
    (typeof score === "number" && score < 0.5) ||
    savingsMs >= 1000 ||
    savingsBytes >= 250 * 1024
  ) {
    return "high";
  }

  if (
    (typeof score === "number" && score < 0.9) ||
    savingsMs >= 300 ||
    savingsBytes >= 75 * 1024
  ) {
    return "medium";
  }

  return "low";
}

function isFailedAudit(audit?: LighthouseAudit) {
  if (!audit) return false;

  const ignoredModes = new Set([
    "notApplicable",
    "manual",
    "informative",
    "error",
  ]);

  if (
    audit.scoreDisplayMode &&
    ignoredModes.has(audit.scoreDisplayMode)
  ) {
    return false;
  }

  if (typeof audit.score !== "number") {
    return false;
  }

  return audit.score < 0.9;
}

function getMetric(audits: Record<string, LighthouseAudit>, id: string) {
  const audit = audits[id];

  return {
    displayValue: audit?.displayValue ?? "N/A",
    numericValue: roundOptional(audit?.numericValue, 3),
    numericUnit: audit?.numericUnit ?? null,
    score:
      typeof audit?.score === "number"
        ? roundOptional(audit.score, 3)
        : null,
  };
}

function getFieldMetric(
  data: Record<string, unknown> | undefined,
  metricName: string
) {
  const metrics = data?.metrics as
    | Record<
        string,
        {
          percentile?: number;
          category?: string;
          distributions?: unknown[];
        }
      >
    | undefined;

  const metric = metrics?.[metricName];

  if (!metric) return null;

  return {
    percentile: roundOptional(metric.percentile),
    category: metric.category ?? null,
    distributions: metric.distributions ?? [],
  };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkSiteAuditRateLimit(`siteaudit-speed:${ip}`);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "You reached the free speed audit limit. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as {
      url?: string;
      strategy?: Strategy;
    };

    const url = body.url?.trim();
    const strategy: Strategy =
      body.strategy === "desktop" ? "desktop" : "mobile";

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Please enter a valid website URL." },
        { status: 400 }
      );
    }

    const apiUrl = new URL(
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    );

    apiUrl.searchParams.set("url", url);
    apiUrl.searchParams.set("strategy", strategy);
    apiUrl.searchParams.append("category", "performance");
    apiUrl.searchParams.append("category", "seo");
    apiUrl.searchParams.append("category", "accessibility");
    apiUrl.searchParams.append("category", "best-practices");

    if (process.env.GOOGLE_PAGESPEED_API_KEY) {
      apiUrl.searchParams.set(
        "key",
        process.env.GOOGLE_PAGESPEED_API_KEY
      );
    }

    const response = await fetch(apiUrl.toString(), {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ??
            "The speed audit could not be completed right now.",
        },
        { status: response.status }
      );
    }

    const lighthouse = data?.lighthouseResult;

    if (!lighthouse?.categories || !lighthouse?.audits) {
      return NextResponse.json(
        {
          error:
            "PageSpeed did not return a complete Lighthouse report.",
        },
        { status: 502 }
      );
    }

    const categories = lighthouse.categories;
    const audits = lighthouse.audits as Record<
      string,
      LighthouseAudit
    >;

    const issues = RELEVANT_AUDIT_IDS
      .map((id) => {
        const audit = audits[id];

        if (!isFailedAudit(audit)) {
          return null;
        }

        const savingsMs = roundOptional(
          audit.details?.overallSavingsMs
        );
        const savingsBytes = roundOptional(
          audit.details?.overallSavingsBytes
        );

        return {
          id,
          category: "performance",
          severity: getSeverity(audit),
          title: audit.title ?? "Performance issue",
          description: cleanDescription(audit.description),
          score:
            typeof audit.score === "number"
              ? roundOptional(audit.score, 3)
              : null,
          displayValue: audit.displayValue ?? null,
          numericValue: roundOptional(audit.numericValue, 3),
          numericUnit: audit.numericUnit ?? null,
          savingsMs,
          savingsBytes,
          summary:
            audit.displayValue ??
            (savingsMs
              ? `Estimated time savings: ${savingsMs} ms`
              : savingsBytes
                ? `Estimated transfer savings: ${savingsBytes} bytes`
                : null),
          evidence: extractEvidence(audit),
        };
      })
      .filter(
        (
          issue
        ): issue is NonNullable<typeof issue> => issue !== null
      )
      .sort((a, b) => {
        const severityOrder: Record<Severity, number> = {
          high: 3,
          medium: 2,
          low: 1,
        };

        const severityDifference =
          severityOrder[b.severity] -
          severityOrder[a.severity];

        if (severityDifference !== 0) {
          return severityDifference;
        }

        return (a.score ?? 1) - (b.score ?? 1);
      });

    const metricDetails = {
      fcp: getMetric(audits, "first-contentful-paint"),
      lcp: getMetric(audits, "largest-contentful-paint"),
      cls: getMetric(audits, "cumulative-layout-shift"),
      tbt: getMetric(audits, "total-blocking-time"),
      speedIndex: getMetric(audits, "speed-index"),
      interactive: getMetric(audits, "interactive"),
      serverResponseTime: getMetric(
        audits,
        "server-response-time"
      ),
      mainThreadWork: getMetric(
        audits,
        "mainthread-work-breakdown"
      ),
      javascriptExecution: getMetric(audits, "bootup-time"),
      totalByteWeight: getMetric(audits, "total-byte-weight"),
      domSize: getMetric(audits, "dom-size"),
    };

    const fieldData = {
      origin: {
        lcp: getFieldMetric(
          data?.originLoadingExperience,
          "LARGEST_CONTENTFUL_PAINT_MS"
        ),
        inp: getFieldMetric(
          data?.originLoadingExperience,
          "INTERACTION_TO_NEXT_PAINT"
        ),
        cls: getFieldMetric(
          data?.originLoadingExperience,
          "CUMULATIVE_LAYOUT_SHIFT_SCORE"
        ),
        fcp: getFieldMetric(
          data?.originLoadingExperience,
          "FIRST_CONTENTFUL_PAINT_MS"
        ),
        ttfb: getFieldMetric(
          data?.originLoadingExperience,
          "EXPERIMENTAL_TIME_TO_FIRST_BYTE"
        ),
      },
      page: {
        lcp: getFieldMetric(
          data?.loadingExperience,
          "LARGEST_CONTENTFUL_PAINT_MS"
        ),
        inp: getFieldMetric(
          data?.loadingExperience,
          "INTERACTION_TO_NEXT_PAINT"
        ),
        cls: getFieldMetric(
          data?.loadingExperience,
          "CUMULATIVE_LAYOUT_SHIFT_SCORE"
        ),
        fcp: getFieldMetric(
          data?.loadingExperience,
          "FIRST_CONTENTFUL_PAINT_MS"
        ),
        ttfb: getFieldMetric(
          data?.loadingExperience,
          "EXPERIMENTAL_TIME_TO_FIRST_BYTE"
        ),
      },
    };

    const diagnosticSummary = {
      requestCount: getAuditItemCount(audits["network-requests"]),
      totalTransferBytes: sumItemNumber(
        audits["network-requests"],
        "transferSize"
      ),
      scriptTransferBytes: roundOptional(
        (audits["network-requests"]?.details?.items ?? []).reduce(
          (total, item) =>
            total +
            (item.resourceType === "Script" &&
            typeof item.transferSize === "number"
              ? item.transferSize
              : 0),
          0
        )
      ),
      imageTransferBytes: roundOptional(
        (audits["network-requests"]?.details?.items ?? []).reduce(
          (total, item) =>
            total +
            (item.resourceType === "Image" &&
            typeof item.transferSize === "number"
              ? item.transferSize
              : 0),
          0
        )
      ),
      thirdPartyCount: getAuditItemCount(
        audits["third-party-summary"]
      ),
      longTaskCount: getAuditItemCount(audits["long-tasks"]),
      layoutShiftCount: getAuditItemCount(audits["layout-shifts"]),
      lcpElement: extractEvidence(
        audits["largest-contentful-paint-element"],
        1
      )[0] ?? null,
    };

    return NextResponse.json({
      url,
      strategy,
      finalUrl: lighthouse.finalDisplayedUrl ?? url,
      fetchedAt: lighthouse.fetchTime ?? new Date().toISOString(),

      scores: {
        performance: Math.round(
          (categories.performance?.score ?? 0) * 100
        ),
        seo: Math.round((categories.seo?.score ?? 0) * 100),
        accessibility: Math.round(
          (categories.accessibility?.score ?? 0) * 100
        ),
        bestPractices: Math.round(
          (categories["best-practices"]?.score ?? 0) * 100
        ),
      },

      // Păstrat pentru compatibilitatea cu interfața actuală.
      metrics: {
        fcp: metricDetails.fcp.displayValue,
        lcp: metricDetails.lcp.displayValue,
        cls: metricDetails.cls.displayValue,
        tbt: metricDetails.tbt.displayValue,
        speedIndex: metricDetails.speedIndex.displayValue,
      },

      // Date numerice pentru comparații și explicații bazate pe dovezi.
      metricDetails,
      fieldData,
      diagnosticSummary,
      issues,
      issueCount: issues.length,
    });
  } catch (error) {
    console.error("SiteAudit speed route error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while running the speed audit.",
      },
      { status: 500 }
    );
  }
}