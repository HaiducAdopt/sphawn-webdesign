import { NextResponse } from "next/server";
import {
  checkSiteAuditRateLimit,
  getClientIp,
} from "@/lib/siteauditRateLimit";

type Strategy = "mobile" | "desktop";

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkSiteAuditRateLimit(`siteaudit-speed:${ip}`);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "You reached the free speed audit limit. Please try again later.",
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
      apiUrl.searchParams.set("key", process.env.GOOGLE_PAGESPEED_API_KEY);
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

    const lighthouse = data.lighthouseResult;
    const categories = lighthouse.categories;
    const audits = lighthouse.audits;

    return NextResponse.json({
      url,
      strategy,
      finalUrl: lighthouse.finalDisplayedUrl ?? url,
      scores: {
        performance: Math.round((categories.performance?.score ?? 0) * 100),
        seo: Math.round((categories.seo?.score ?? 0) * 100),
        accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round(
          (categories["best-practices"]?.score ?? 0) * 100
        ),
      },
      metrics: {
        fcp: audits["first-contentful-paint"]?.displayValue ?? "N/A",
        lcp: audits["largest-contentful-paint"]?.displayValue ?? "N/A",
        cls: audits["cumulative-layout-shift"]?.displayValue ?? "N/A",
        tbt: audits["total-blocking-time"]?.displayValue ?? "N/A",
        speedIndex: audits["speed-index"]?.displayValue ?? "N/A",
      },
      issues: [
        audits["render-blocking-resources"],
        audits["unused-javascript"],
        audits["uses-optimized-images"],
        audits["uses-text-compression"],
        audits["server-response-time"],
      ]
        .filter(Boolean)
        .map(
          (audit: {
            title?: string;
            description?: string;
            score?: number | null;
            displayValue?: string;
          }) => ({
            title: audit.title ?? "Audit issue",
            description: audit.description ?? "",
            score: audit.score ?? null,
            displayValue: audit.displayValue ?? null,
          })
        ),
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while running the speed audit." },
      { status: 500 }
    );
  }
}