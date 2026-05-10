import { NextResponse } from "next/server";

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function countMatches(html: string, regex: RegExp) {
  return html.match(regex)?.length ?? 0;
}

function extractMetaDescription(html: string) {
  const firstPattern = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );

  if (firstPattern?.[1]) {
    return firstPattern[1].trim();
  }

  const secondPattern = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i
  );

  return secondPattern?.[1]?.trim() ?? "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };
    const url = body.url?.trim();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Please enter a valid website URL." },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Sphawn SiteAudit Bot",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "The page could not be loaded for AI SEO analysis." },
        { status: 400 }
      );
    }

    const html = await response.text();

    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.trim() ?? "";
    const description = extractMetaDescription(html);

    const h1Count = countMatches(html, /<h1[\s>]/gi);
    const h2Count = countMatches(html, /<h2[\s>]/gi);
    const schemaCount = countMatches(html, /application\/ld\+json/gi);
    const faqDetected = /FAQPage|frequently asked questions|faq/i.test(html);
    const ogDetected = /property=["']og:/i.test(html);
    const canonicalDetected = /rel=["']canonical["']/i.test(html);

    let score = 40;

    if (title.length >= 30 && title.length <= 65) score += 10;
    if (description.length >= 80 && description.length <= 170) score += 10;
    if (h1Count === 1) score += 10;
    if (h2Count >= 2) score += 10;
    if (schemaCount > 0) score += 10;
    if (faqDetected) score += 5;
    if (ogDetected) score += 3;
    if (canonicalDetected) score += 2;

    const recommendations = [
      h1Count !== 1 ? "Use exactly one clear H1 heading on the page." : null,
      h2Count < 2
        ? "Add clear H2 sections to make the content easier to understand."
        : null,
      schemaCount === 0
        ? "Add structured data such as Organization, LocalBusiness, Article or FAQ schema."
        : null,
      !faqDetected
        ? "Add a small FAQ section to improve AI and search extraction."
        : null,
      !canonicalDetected
        ? "Add a canonical URL to prevent duplicate content confusion."
        : null,
    ].filter((item): item is string => Boolean(item));

    return NextResponse.json({
      url,
      score: Math.min(score, 100),
      extracted: {
        title,
        description,
        h1Count,
        h2Count,
        schemaCount,
        faqDetected,
        ogDetected,
        canonicalDetected,
      },
      recommendations,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while running the AI SEO audit." },
      { status: 500 }
    );
  }
}