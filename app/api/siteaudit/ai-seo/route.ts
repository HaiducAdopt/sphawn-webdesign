import { isIP } from "node:net";
import { lookup } from "node:dns/promises";
import { NextResponse } from "next/server";

import {
  checkSiteAuditRateLimit,
  getClientIp,
} from "@/lib/siteauditRateLimit";

type Severity = "high" | "medium" | "low";
type IssueCategory =
  | "technicalSeo"
  | "content"
  | "localSeo"
  | "aiReadiness"
  | "conversion"
  | "social";

type SeoIssue = {
  id: string;
  category: IssueCategory;
  severity: Severity;
  title: string;
  measuredValue: string | number | boolean | null;
  expectedValue: string | number | boolean;
  evidence: string;
  recommendation: string;
};

type HtmlAttributes = Record<string, string>;

type SchemaResult = {
  count: number;
  validCount: number;
  invalidCount: number;
  types: string[];
};

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_HTML_LENGTH = 2_000_000;

function isValidPublicUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function isPrivateIpv4(ip: string) {
  const parts = ip.split(".").map(Number);

  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

function isPrivateIpv6(ip: string) {
  const normalized = ip.toLowerCase().split("%")[0];

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb") ||
    normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") ||
    normalized.startsWith("::ffff:192.168.") ||
    normalized.startsWith("::ffff:169.254.")
  );
}

function isPrivateIp(ip: string) {
  const version = isIP(ip);

  if (version === 4) return isPrivateIpv4(ip);
  if (version === 6) return isPrivateIpv6(ip);

  return true;
}

async function assertPublicUrl(value: string) {
  if (!isValidPublicUrl(value)) {
    throw new Error("INVALID_URL");
  }

  const url = new URL(value);
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error("PRIVATE_URL");
  }

  if (isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error("PRIVATE_URL");
    }

    return;
  }

  const addresses = await lookup(hostname, {
    all: true,
    verbatim: true,
  });

  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => isPrivateIp(address))
  ) {
    throw new Error("PRIVATE_URL");
  }
}

async function fetchPublicHtml(initialUrl: string) {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    await assertPublicUrl(currentUrl);

    const response = await fetch(currentUrl, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Sphawn-SiteAudit/1.0 (+https://www.sphawn.nl)",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");

      if (!location) {
        throw new Error("INVALID_REDIRECT");
      }

      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    if (!response.ok) {
      throw new Error(`FETCH_FAILED:${response.status}`);
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

    if (!contentType.includes("text/html")) {
      throw new Error("NOT_HTML");
    }

    const contentLength = Number(response.headers.get("content-length") ?? 0);

    if (contentLength > MAX_HTML_LENGTH) {
      throw new Error("HTML_TOO_LARGE");
    }

    const html = await response.text();

    if (html.length > MAX_HTML_LENGTH) {
      throw new Error("HTML_TOO_LARGE");
    }

    return {
      html,
      finalUrl: currentUrl,
      statusCode: response.status,
    };
  }

  throw new Error("TOO_MANY_REDIRECTS");
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    quot: '"',
    apos: "'",
    lt: "<",
    gt: ">",
    nbsp: " ",
  };

  return value
    .replace(
      /&(#x?[0-9a-f]+|[a-z]+);/gi,
      (match, entity: string) => {
        const normalized = entity.toLowerCase();

        if (normalized.startsWith("#x")) {
          const codePoint = Number.parseInt(normalized.slice(2), 16);

          return Number.isFinite(codePoint)
            ? String.fromCodePoint(codePoint)
            : match;
        }

        if (normalized.startsWith("#")) {
          const codePoint = Number.parseInt(normalized.slice(1), 10);

          return Number.isFinite(codePoint)
            ? String.fromCodePoint(codePoint)
            : match;
        }

        return namedEntities[normalized] ?? match;
      }
    )
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, " "));
}

function parseAttributes(tag: string): HtmlAttributes {
  const attributes: HtmlAttributes = {};
  const attributeRegex =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  let match: RegExpExecArray | null;

  while ((match = attributeRegex.exec(tag)) !== null) {
    const name = match[1]?.toLowerCase();

    if (!name || name.startsWith("<") || name === "meta" || name === "link") {
      continue;
    }

    attributes[name] = decodeHtmlEntities(
      match[2] ?? match[3] ?? match[4] ?? ""
    );
  }

  return attributes;
}

function getTags(html: string, tagName: string) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

function findMetaContent(
  html: string,
  attributeName: "name" | "property",
  attributeValue: string
) {
  const normalizedValue = attributeValue.toLowerCase();

  for (const tag of getTags(html, "meta")) {
    const attributes = parseAttributes(tag);

    if (attributes[attributeName]?.toLowerCase() === normalizedValue) {
      return attributes.content?.trim() ?? "";
    }
  }

  return "";
}

function findLinkHref(html: string, relValue: string) {
  const normalizedValue = relValue.toLowerCase();

  for (const tag of getTags(html, "link")) {
    const attributes = parseAttributes(tag);
    const relValues = (attributes.rel ?? "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (relValues.includes(normalizedValue)) {
      return attributes.href?.trim() ?? "";
    }
  }

  return "";
}

function extractHeadingTexts(html: string, level: number) {
  const matches = Array.from(
    html.matchAll(
      new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi")
    )
  );

  return matches
    .map((match) => stripTags(match[1] ?? ""))
    .filter(Boolean);
}

function extractVisibleText(html: string) {
  const cleanedHtml = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " ");

  return stripTags(cleanedHtml);
}

function countWords(text: string) {
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
}

function extractSchemaTypes(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(extractSchemaTypes);
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const rawType = record["@type"];

  const currentTypes =
    typeof rawType === "string"
      ? [rawType]
      : Array.isArray(rawType)
        ? rawType.filter((item): item is string => typeof item === "string")
        : [];

  const graphTypes = extractSchemaTypes(record["@graph"]);

  return [...currentTypes, ...graphTypes];
}

function analyzeSchemas(html: string): SchemaResult {
  const scripts = Array.from(
    html.matchAll(
      /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    )
  );

  let validCount = 0;
  let invalidCount = 0;
  const types = new Set<string>();

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script[1]?.trim() ?? "");
      validCount += 1;

      for (const type of extractSchemaTypes(parsed)) {
        types.add(type);
      }
    } catch {
      invalidCount += 1;
    }
  }

  return {
    count: scripts.length,
    validCount,
    invalidCount,
    types: [...types].sort(),
  };
}

function normalizeHref(href: string, baseUrl: string) {
  try {
    const url = new URL(href, baseUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function analyzeLinks(html: string, finalUrl: string) {
  const pageUrl = new URL(finalUrl);
  let internal = 0;
  let external = 0;
  let missingHref = 0;

  for (const tag of getTags(html, "a")) {
    const attributes = parseAttributes(tag);
    const href = attributes.href?.trim();

    if (!href || href === "#") {
      missingHref += 1;
      continue;
    }

    const normalized = normalizeHref(href, finalUrl);

    if (!normalized) continue;

    if (normalized.hostname === pageUrl.hostname) {
      internal += 1;
    } else {
      external += 1;
    }
  }

  return {
    internal,
    external,
    missingHref,
    total: internal + external,
  };
}

function analyzeImages(html: string) {
  const images = getTags(html, "img");
  let missingAlt = 0;
  let emptyAlt = 0;
  let lazyLoaded = 0;

  for (const tag of images) {
    const attributes = parseAttributes(tag);

    if (!Object.prototype.hasOwnProperty.call(attributes, "alt")) {
      missingAlt += 1;
    } else if (!attributes.alt.trim()) {
      emptyAlt += 1;
    }

    if (attributes.loading?.toLowerCase() === "lazy") {
      lazyLoaded += 1;
    }
  }

  return {
    total: images.length,
    missingAlt,
    emptyAlt,
    withAlt: Math.max(images.length - missingAlt - emptyAlt, 0),
    lazyLoaded,
  };
}

function getSeverityWeight(severity: Severity) {
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function sortIssues(issues: SeoIssue[]) {
  return [...issues].sort(
    (a, b) => getSeverityWeight(b.severity) - getSeverityWeight(a.severity)
  );
}

function calculateCategoryScore(
  issues: SeoIssue[],
  category: IssueCategory
) {
  const deductions: Record<Severity, number> = {
    high: 25,
    medium: 15,
    low: 7,
  };

  return Math.max(
    0,
    100 -
      issues
        .filter((issue) => issue.category === category)
        .reduce((total, issue) => total + deductions[issue.severity], 0)
  );
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkSiteAuditRateLimit(`siteaudit-ai-seo:${ip}`);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "You reached the free SEO audit limit. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as { url?: string };
    const requestedUrl = body.url?.trim();

    if (!requestedUrl || !isValidPublicUrl(requestedUrl)) {
      return NextResponse.json(
        { error: "Please enter a valid public website URL." },
        { status: 400 }
      );
    }

    const { html, finalUrl, statusCode } =
      await fetchPublicHtml(requestedUrl);

    const title = stripTags(
      html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""
    );
    const description = findMetaContent(html, "name", "description");
    const robots = findMetaContent(html, "name", "robots");
    const viewport = findMetaContent(html, "name", "viewport");

    const canonical = findLinkHref(html, "canonical");
    const htmlLanguage =
      html
        .match(/<html\b[^>]*>/i)
        ?.map(parseAttributes)[0]
        ?.lang?.trim() ?? "";

    const ogTitle = findMetaContent(html, "property", "og:title");
    const ogDescription = findMetaContent(
      html,
      "property",
      "og:description"
    );
    const ogImage = findMetaContent(html, "property", "og:image");
    const ogUrl = findMetaContent(html, "property", "og:url");

    const h1Texts = extractHeadingTexts(html, 1);
    const h2Texts = extractHeadingTexts(html, 2);
    const h3Texts = extractHeadingTexts(html, 3);

    const visibleText = extractVisibleText(html);
    const wordCount = countWords(visibleText);

    const schema = analyzeSchemas(html);
    const links = analyzeLinks(html, finalUrl);
    const images = analyzeImages(html);

    const schemaTypesLower = schema.types.map((type) =>
      type.toLowerCase()
    );

    const faqSchemaDetected = schemaTypesLower.includes("faqpage");
    const organizationSchemaDetected = schemaTypesLower.some((type) =>
      ["organization", "localbusiness", "professionalservice"].includes(type)
    );
    const localBusinessSchemaDetected = schemaTypesLower.some((type) =>
      ["localbusiness", "professionalservice"].includes(type)
    );
    const pageSchemaDetected = schemaTypesLower.some((type) =>
      [
        "website",
        "webpage",
        "aboutpage",
        "contactpage",
        "collectionpage",
        "article",
        "blogposting",
        "service",
        "product",
      ].includes(type)
    );

    const visibleFaqHeadingDetected = [...h2Texts, ...h3Texts].some(
      (heading) =>
        /\b(faq|frequently asked questions|veelgestelde vragen)\b/i.test(
          heading
        )
    );

    const noindexDetected = /(?:^|[\s,])noindex(?:$|[\s,])/i.test(
      robots
    );

    const contactDetected =
      /\b(contact|contact us|contact opnemen|neem contact op)\b/i.test(
        visibleText
      );

    const emailDetected =
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(visibleText) ||
      /href\s*=\s*["']mailto:/i.test(html);

    const phoneDetected =
      /href\s*=\s*["']tel:/i.test(html) ||
      /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,5}\d{2,4}/.test(
        visibleText
      );

    const issues: SeoIssue[] = [];

    if (!title) {
      issues.push({
        id: "missing-title",
        category: "technicalSeo",
        severity: "high",
        title: "Page title is missing",
        measuredValue: 0,
        expectedValue: "A descriptive page title",
        evidence: "No non-empty <title> element was found.",
        recommendation:
          "Add a unique title that describes the page and its main service or subject.",
      });
    } else if (title.length < 30 || title.length > 65) {
      issues.push({
        id: "title-length",
        category: "technicalSeo",
        severity: "medium",
        title: "Page title length can be improved",
        measuredValue: title.length,
        expectedValue: "30–65 characters",
        evidence: `The page title contains ${title.length} characters.`,
        recommendation:
          "Rewrite the title so its subject and value are clear without unnecessary wording.",
      });
    }

    if (!description) {
      issues.push({
        id: "missing-description",
        category: "technicalSeo",
        severity: "medium",
        title: "Meta description is missing",
        measuredValue: 0,
        expectedValue: "A useful page description",
        evidence: "No meta description was found in the HTML.",
        recommendation:
          "Add a concise description explaining what the page offers and why it is relevant.",
      });
    } else if (description.length < 80 || description.length > 170) {
      issues.push({
        id: "description-length",
        category: "technicalSeo",
        severity: "low",
        title: "Meta description length can be improved",
        measuredValue: description.length,
        expectedValue: "80–170 characters",
        evidence: `The meta description contains ${description.length} characters.`,
        recommendation:
          "Adjust the description so it communicates the page value clearly and naturally.",
      });
    }

    if (h1Texts.length === 0) {
      issues.push({
        id: "missing-h1",
        category: "content",
        severity: "high",
        title: "The page has no H1 heading",
        measuredValue: 0,
        expectedValue: 1,
        evidence: "No H1 element was found in the fetched HTML.",
        recommendation:
          "Add one clear H1 that describes the primary subject of this page.",
      });
    } else if (h1Texts.length > 1) {
      issues.push({
        id: "multiple-h1",
        category: "content",
        severity: "medium",
        title: "The page has multiple H1 headings",
        measuredValue: h1Texts.length,
        expectedValue: 1,
        evidence: `${h1Texts.length} H1 headings were found.`,
        recommendation:
          "Use one primary H1 and organize subordinate sections with H2 and H3 headings.",
      });
    }

    if (h2Texts.length === 0 && wordCount >= 250) {
      issues.push({
        id: "missing-content-sections",
        category: "content",
        severity: "medium",
        title: "Long content is not divided into clear sections",
        measuredValue: h2Texts.length,
        expectedValue: "At least one relevant H2 for longer content",
        evidence: `${wordCount} visible words were found but no H2 headings were detected.`,
        recommendation:
          "Divide the content into meaningful sections using descriptive H2 headings.",
      });
    }

    if (wordCount < 150) {
      issues.push({
        id: "thin-visible-content",
        category: "content",
        severity: "medium",
        title: "The page contains limited visible text",
        measuredValue: wordCount,
        expectedValue: "Enough original text to explain the page subject",
        evidence: `Approximately ${wordCount} visible words were detected in the initial HTML.`,
        recommendation:
          "Add useful, specific content about the service, audience, process or page subject.",
      });
    }

    if (!canonical) {
      issues.push({
        id: "missing-canonical",
        category: "technicalSeo",
        severity: "medium",
        title: "Canonical URL is missing",
        measuredValue: false,
        expectedValue: true,
        evidence: "No canonical link element was found.",
        recommendation:
          "Add a self-referencing canonical URL to clarify the preferred page address.",
      });
    }

    if (noindexDetected) {
      issues.push({
        id: "page-noindex",
        category: "technicalSeo",
        severity: "high",
        title: "The page requests noindex",
        measuredValue: robots,
        expectedValue: "index, follow for a public landing page",
        evidence: `The robots meta content is "${robots}".`,
        recommendation:
          "Remove noindex if this page is intended to appear in search results.",
      });
    }

    if (!viewport) {
      issues.push({
        id: "missing-viewport",
        category: "technicalSeo",
        severity: "medium",
        title: "Viewport metadata is missing",
        measuredValue: false,
        expectedValue: true,
        evidence: "No viewport meta tag was found.",
        recommendation:
          "Add responsive viewport metadata for correct rendering on mobile devices.",
      });
    }

    if (!htmlLanguage) {
      issues.push({
        id: "missing-html-language",
        category: "technicalSeo",
        severity: "low",
        title: "Page language is not declared",
        measuredValue: "",
        expectedValue: "A valid lang attribute",
        evidence: "The HTML element has no language attribute.",
        recommendation:
          "Declare the page language with the lang attribute on the HTML element.",
      });
    }

    if (schema.count === 0) {
      issues.push({
        id: "missing-structured-data",
        category: "aiReadiness",
        severity: "medium",
        title: "Structured data is missing",
        measuredValue: 0,
        expectedValue: "Relevant JSON-LD for this page",
        evidence: "No JSON-LD structured-data block was found.",
        recommendation:
          "Add schema that accurately represents the organization, service, article or other page entity.",
      });
    }

    if (schema.invalidCount > 0) {
      issues.push({
        id: "invalid-json-ld",
        category: "technicalSeo",
        severity: "high",
        title: "Invalid JSON-LD was detected",
        measuredValue: schema.invalidCount,
        expectedValue: 0,
        evidence: `${schema.invalidCount} JSON-LD block(s) could not be parsed as valid JSON.`,
        recommendation:
          "Correct the JSON syntax and validate the structured data before publishing.",
      });
    }

    if (schema.validCount > 0 && !organizationSchemaDetected) {
      issues.push({
        id: "missing-entity-schema",
        category: "aiReadiness",
        severity: "medium",
        title: "Organization entity data was not detected",
        measuredValue: schema.types.join(", ") || "No recognized type",
        expectedValue:
          "Organization, LocalBusiness or ProfessionalService schema",
        evidence:
          "Valid JSON-LD exists, but it does not identify the organization or business behind the website.",
        recommendation:
          "Add accurate Organization, LocalBusiness or ProfessionalService JSON-LD with the entity name, URL, logo and relevant identity details.",
      });
    }

    if (schema.validCount > 0 && !pageSchemaDetected) {
      issues.push({
        id: "missing-page-schema",
        category: "aiReadiness",
        severity: "low",
        title: "Page-level structured data was not detected",
        measuredValue: schema.types.join(", ") || "No recognized type",
        expectedValue:
          "A relevant page type such as WebSite, WebPage, Service or Article",
        evidence:
          "Valid JSON-LD exists, but no supported schema type describing this page was found.",
        recommendation:
          "Add a JSON-LD type that accurately describes this page, such as WebSite or WebPage for a homepage, Service for a service page, or Article for editorial content.",
      });
    }

    if (!ogTitle || !ogDescription || !ogImage) {
      const missingOgFields = [
        !ogTitle ? "og:title" : null,
        !ogDescription ? "og:description" : null,
        !ogImage ? "og:image" : null,
      ].filter((item): item is string => Boolean(item));

      issues.push({
        id: "incomplete-open-graph",
        category: "social",
        severity: "low",
        title: "Open Graph metadata is incomplete",
        measuredValue: missingOgFields.join(", "),
        expectedValue: "og:title, og:description and og:image",
        evidence: `Missing fields: ${missingOgFields.join(", ")}.`,
        recommendation:
          "Add the missing Open Graph fields so shared links have a clear title, description and image.",
      });
    }

    if (images.missingAlt > 0) {
      issues.push({
        id: "images-missing-alt",
        category: "content",
        severity: "medium",
        title: "Some images have no alt attribute",
        measuredValue: images.missingAlt,
        expectedValue: 0,
        evidence: `${images.missingAlt} of ${images.total} image(s) have no alt attribute.`,
        recommendation:
          "Add concise alternative text to informative images; use an empty alt value only for decorative images.",
      });
    }

    if (links.internal === 0) {
      issues.push({
        id: "no-internal-links",
        category: "content",
        severity: "medium",
        title: "No internal links were detected",
        measuredValue: 0,
        expectedValue: "Relevant links to other useful pages",
        evidence: "The fetched HTML did not contain internal HTTP links.",
        recommendation:
          "Link to relevant services, contact information, supporting content or other important pages.",
      });
    }

    if (!contactDetected && !emailDetected && !phoneDetected) {
      issues.push({
        id: "contact-path-not-detected",
        category: "conversion",
        severity: "medium",
        title: "A clear contact path was not detected",
        measuredValue: false,
        expectedValue: true,
        evidence:
          "No visible contact wording, email address, mailto link or telephone link was detected.",
        recommendation:
          "Add a clear route to contact the business, such as a prominent contact link or call to action.",
      });
    }

    const aiReadinessChecks = [
      {
        passed:
          schema.validCount > 0 &&
          schema.invalidCount === 0 &&
          organizationSchemaDetected,
        weight: 20,
      },
      {
        passed:
          schema.validCount > 0 &&
          schema.invalidCount === 0 &&
          pageSchemaDetected,
        weight: 15,
      },
      {
        passed: Boolean(title && description),
        weight: 10,
      },
      {
        passed: h1Texts.length === 1 && h2Texts.length > 0,
        weight: 10,
      },
      {
        passed: wordCount >= 300,
        weight: 15,
      },
      {
        passed: Boolean(htmlLanguage),
        weight: 5,
      },
      {
        passed: Boolean(canonical) && !noindexDetected,
        weight: 5,
      },
      {
        passed: Boolean(ogTitle && ogDescription && ogImage),
        weight: 5,
      },
      {
        passed: links.internal > 0,
        weight: 5,
      },
      {
        passed:
          images.total === 0 ||
          images.missingAlt === 0,
        weight: 5,
      },
      {
        passed: contactDetected || emailDetected || phoneDetected,
        weight: 5,
      },
    ];

    const aiReadinessScore = aiReadinessChecks.reduce(
      (total, check) => total + (check.passed ? check.weight : 0),
      0
    );

    const scores = {
      technicalSeo: calculateCategoryScore(issues, "technicalSeo"),
      content: calculateCategoryScore(issues, "content"),
      localSeo: calculateCategoryScore(issues, "localSeo"),
      aiReadiness: aiReadinessScore,
      conversion: calculateCategoryScore(issues, "conversion"),
      social: calculateCategoryScore(issues, "social"),
    };

    const overallScore = Math.round(
      scores.technicalSeo * 0.3 +
        scores.content * 0.25 +
        scores.aiReadiness * 0.15 +
        scores.conversion * 0.1 +
        scores.social * 0.1 +
        scores.localSeo * 0.1
    );

    const sortedIssues = sortIssues(issues);

    return NextResponse.json({
      url: requestedUrl,
      finalUrl,
      statusCode,
      fetchedAt: new Date().toISOString(),

      // Păstrat pentru compatibilitatea cu interfața actuală.
      score: overallScore,

      scores,

      extracted: {
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length,

        h1Count: h1Texts.length,
        h2Count: h2Texts.length,
        h3Count: h3Texts.length,
        h1Texts,
        h2Texts,

        wordCount,
        htmlLanguage,
        robots,
        noindexDetected,
        canonical,
        canonicalDetected: Boolean(canonical),
        viewportDetected: Boolean(viewport),

        schemaCount: schema.count,
        validSchemaCount: schema.validCount,
        invalidSchemaCount: schema.invalidCount,
        schemaTypes: schema.types,
        organizationSchemaDetected,
        localBusinessSchemaDetected,
        pageSchemaDetected,

        faqDetected: faqSchemaDetected || visibleFaqHeadingDetected,
        faqSchemaDetected,
        visibleFaqHeadingDetected,

        ogDetected: Boolean(
          ogTitle || ogDescription || ogImage || ogUrl
        ),
        openGraph: {
          title: ogTitle,
          description: ogDescription,
          image: ogImage,
          url: ogUrl,
        },

        links,
        images,

        contact: {
          contactWordingDetected: contactDetected,
          emailDetected,
          phoneDetected,
        },
      },

      issues: sortedIssues,

      // Păstrat temporar pentru componenta actuală.
      recommendations: sortedIssues
        .slice(0, 8)
        .map((issue) => issue.recommendation),

      evidence: sortedIssues.map((issue) => ({
        issueId: issue.id,
        evidence: issue.evidence,
        measuredValue: issue.measuredValue,
        expectedValue: issue.expectedValue,
      })),
    });
  } catch (error) {
    console.error("SiteAudit AI SEO route error:", error);

    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (
      message === "INVALID_URL" ||
      message === "PRIVATE_URL" ||
      message === "INVALID_REDIRECT"
    ) {
      return NextResponse.json(
        {
          error:
            "Only public website URLs can be analyzed.",
        },
        { status: 400 }
      );
    }

    if (message === "NOT_HTML") {
      return NextResponse.json(
        { error: "The requested URL did not return an HTML page." },
        { status: 400 }
      );
    }

    if (message === "HTML_TOO_LARGE") {
      return NextResponse.json(
        { error: "The page is too large to analyze safely." },
        { status: 413 }
      );
    }

    if (
      message === "TOO_MANY_REDIRECTS" ||
      message.startsWith("FETCH_FAILED:")
    ) {
      return NextResponse.json(
        { error: "The page could not be loaded for SEO analysis." },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError")
    ) {
      return NextResponse.json(
        { error: "The website took too long to respond." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while running the AI SEO audit." },
      { status: 500 }
    );
  }
}